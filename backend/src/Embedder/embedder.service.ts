import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { blob } from 'stream/consumers';
import { Readable } from 'stream';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { AstraDB } from '@datastax/astra-db-ts';
import { Client } from 'langsmith';
import { LangChainTracer } from 'langchain/callbacks';
import { maximalMarginalRelevance } from 'langchain/util/math';
import { InjectModel } from '@nestjs/mongoose';
import { Source } from 'src/Source/source.schema';
import { Model, Types } from 'mongoose';
import { captureException } from '@sentry/node';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './text_embedding';
import { config as dotEnvConfig } from 'dotenv';
import { ChromaClient, IncludeEnum } from 'chromadb';

dotEnvConfig();

interface Embedding {
  text: string;
  $vector: number[];
  sourceId: Types.ObjectId;
}

/**
 * Langchain Tracer for Langsmith
 */
const langchainClient = new Client({
  apiUrl: process.env.LANGCHAIN_ENDPOINT,
  apiKey: process.env.LANGCHAIN_API_KEY,
});

new LangChainTracer({
  projectName: process.env.LANGCHAIN_PROJECT,
  client: langchainClient as any, // Unresolved TS error: Types have separate declarations of a private property 'apiKey'
});

enum EmbeddingType {
  GPT_EMBEDDING_ADA_002 = 'gpt-embedding-ada-002',
  MINI_LM_L6_V2 = 'mini-lm-l6-v2',
}

// Define the service definition
const PROTO_PATH = __dirname + '/text_to_embedding/text_embedding.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = (
  grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType
).text_to_embedding;

// Create a new client instance
const grpcClient = new proto.TextToEmbedding(
  process.env.EMBEDDER_ENDPOINT,
  grpc.credentials.createInsecure(),
);

async function getTextEmbedding(
  texts: string[],
  type: EmbeddingType,
): Promise<number[][]> {
  switch (type) {
    case EmbeddingType.MINI_LM_L6_V2: {
      return new Promise((resolve, reject) => {
        grpcClient.Convert({ texts }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.embeddings.map((embedding) => embedding.value));
          }
        });
      });
      break;
    }
    case EmbeddingType.GPT_EMBEDDING_ADA_002:
    default: {
      const GPT_MODEL = 'text-embedding-ada-002';
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: GPT_MODEL,
      });
      const vectors = await embeddings.embedDocuments(texts);
      return vectors;
    }
  }
}

async function getEmbeddingDatabase(type: EmbeddingType) {
  switch (type) {
    case EmbeddingType.MINI_LM_L6_V2: {
      return getChromaCollectionDB();
    }
    case EmbeddingType.GPT_EMBEDDING_ADA_002:
    default: {
      return getDatastaxCollectionDB('personal_vector', 1536);
    }
  }
}

interface GetCollectionDB {
  insertMany: (data: Embedding[]) => Promise<any>;
  find: (
    vector: number[],
    limit: number,
  ) => Promise<Omit<Embedding, 'sourceId'>[]>;
  deleteMany: (sourceId: string) => Promise<any>;
}

async function getChromaCollectionDB(): Promise<GetCollectionDB> {
  const chromaClient = new ChromaClient({
    path: `http://${process.env.CHROMA_ENDPOINT}`,
  });
  const collection = await chromaClient.getOrCreateCollection({
    name: 'chroma_vector',
  });
  return {
    insertMany: async (data: Embedding[]) => {
      const dataDict = data.reduce(
        (dict, row) => {
          dict['ids'].push(crypto.randomUUID());
          dict['$vector'].push(row.$vector);
          dict['sourceId'].push({ sourceId: row.sourceId });
          dict['text'].push(row.text);
          return dict;
        },
        {
          ids: [],
          $vector: [],
          text: [],
          sourceId: [],
        },
      );
      await collection.add({
        ids: dataDict['ids'],
        embeddings: dataDict['$vector'],
        metadatas: dataDict['sourceId'],
        documents: dataDict['text'],
      });
    },
    find: async (vector, limit) => {
      const columnarResult = await collection.query({
        queryEmbeddings: [vector],
        nResults: limit,
        include: [IncludeEnum.Documents, IncludeEnum.Embeddings],
      });
      const rowResult = columnarResult.ids[0].map((_, i) => ({
        $vector: columnarResult.embeddings[0][i],
        text: columnarResult.documents[0][i],
      }));
      return rowResult;
    },
    deleteMany: async (sourceId: string) => {
      await collection.delete({
        where: {
          sourceId,
        },
      });
    },
  };
}

async function getDatastaxCollectionDB(
  dbName: string,
  dimension: number,
): Promise<GetCollectionDB> {
  const { DATASTAX_TOKEN, DATASTAX_API_ENDPOINT } = process.env;
  const db = new AstraDB(DATASTAX_TOKEN, DATASTAX_API_ENDPOINT);
  let col = await db.collection(dbName);
  if (!col) {
    await db.createCollection(dbName, {
      vector: {
        dimension,
        metric: 'cosine',
      } as any, // Current version of the library has wrong type annotation for `dimension`,
    });
    col = await db.collection(dbName);
  }
  return {
    insertMany: async (data: Embedding[]) => col.insertMany(data),
    find: async (vector: number[], limit: number) => {
      const colQuery = col.find(
        {},
        {
          sort: {
            $vector: vector,
          },
          limit,
        },
      );
      return (await colQuery.toArray()) as {
        _id: string;
        text: string;
        $vector: number[];
      }[];
    },
    deleteMany: async (sourceId: string) =>
      col.deleteMany({
        sourceId,
      }),
  };
}

export class EmbedderService {
  private embeddingType = EmbeddingType.MINI_LM_L6_V2;

  constructor(@InjectModel(Source.name) private sourceModel: Model<Source>) {}

  async clearSource(sourceId: string) {
    const col = await getEmbeddingDatabase(this.embeddingType);
    await col.deleteMany(sourceId);
    await this.sourceModel.deleteOne({ _id: sourceId });
  }

  async createSource(body: { file: Express.Multer.File }) {
    // Save it to our Vector DB
    const col = await getEmbeddingDatabase(this.embeddingType);

    // Convert the file into Document
    const stream = Readable.from(body.file.buffer);
    const fileBlob = await blob(stream);
    const bufferLoader = new PDFLoader(fileBlob);
    const document = await bufferLoader.load();

    // Get the texts of the document
    let texts = '';
    document.forEach((docs) => {
      texts += docs.pageContent.replace(/\n/g, '');
    });

    // Split the document into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 512,
      chunkOverlap: 100,
    });
    const chunks = await splitter.splitText(texts);

    // Generate the embeddings for each chunk
    const documentEmbeddings = await getTextEmbedding(
      chunks,
      this.embeddingType,
    );

    // Create the source as the pointer of the vector
    const source = new this.sourceModel({
      filename: body.file.originalname,
    });
    const newSource = await source.save();

    // Map the value to be saved into the DB
    const dbRows: Embedding[] = [];
    documentEmbeddings.forEach((vector: number[], index) => {
      dbRows.push({
        text: chunks[index],
        $vector: vector,
        sourceId: newSource._id,
      });
    });

    const result = await col.insertMany(dbRows);

    return result;
  }

  async getRelevantSources(searchText: string): Promise<string[]> {
    try {
      // Try to connect to the AstraDB for the vector
      const col = await getEmbeddingDatabase(this.embeddingType);

      // Convert the search text into embeddings vector
      const [textVector] = await getTextEmbedding(
        [searchText],
        this.embeddingType,
      );

      // Search the DB for the most relevant answer
      const result = await col.find(textVector, 8);

      // Get the maximal marginal relevance to sort the result with both relevant and diverse answer
      const mmrVector = maximalMarginalRelevance(
        textVector,
        result.map((row) => row.$vector),
        0.5,
        5,
      );
      const sortedResult = mmrVector.map((index) => result[index]);

      console.log(
        'sorted',
        sortedResult.map((row) => row.text),
      );

      return sortedResult.map((row) => row.text);
    } catch (e) {
      captureException(e);
      return [];
    }
  }
}
