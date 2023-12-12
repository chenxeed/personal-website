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
import { Model } from 'mongoose';
import { captureException } from '@sentry/node';

const client = new Client({
  apiUrl: process.env.LANGCHAIN_ENDPOINT,
  apiKey: process.env.LANGCHAIN_API_KEY,
});

new LangChainTracer({
  projectName: process.env.LANGCHAIN_PROJECT,
  client: client as any, // Unresolved TS error: Types have separate declarations of a private property 'apiKey'
});

const GPT_MODEL = 'text-embedding-ada-002';

/**
 * Get the collection from our connected AstraDB
 */
async function getCollectionDB() {
  const { DATASTAX_TOKEN, DATASTAX_API_ENDPOINT } = process.env;
  const db = new AstraDB(DATASTAX_TOKEN, DATASTAX_API_ENDPOINT);
  const col = await db.collection('personal_vector');
  if (col) {
    return col;
  } else {
    await db.createCollection('personal_vector', {
      vector: {
        dimension: 1536,
        metric: 'cosine',
      } as any, // Current version of the library has wrong type annotation for `dimension`,
    });
    return await db.collection('personal_vector');
  }
}

/**
 * Get the embeddings vector from OpenAI API
 */
async function getTextVector(texts: string[]) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: GPT_MODEL,
  });
  const vectors = await embeddings.embedDocuments(texts);
  return vectors;
}

export class EmbedderService {
  constructor(@InjectModel(Source.name) private sourceModel: Model<Source>) {}

  async clearSource(sourceId: string) {
    const col = await getCollectionDB();
    await col.deleteMany({
      sourceId,
    });
    await this.sourceModel.deleteOne({ _id: sourceId });
  }

  async createSource(body: { file: Express.Multer.File }) {
    // Create the source as the pointer of the vector
    const source = new this.sourceModel({
      filename: body.file.originalname,
    });
    const newSource = await source.save();

    // Save it to our Vector DB
    const col = await getCollectionDB();

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
    const documentEmbeddings = await getTextVector(chunks);

    // Map the value to be saved into the DB
    const dbRows = [];
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
      const col = await getCollectionDB();

      // Convert the search text into embeddings vector
      const [textVector] = await getTextVector([searchText]);

      // Search the DB for the most relevant answer
      const colQuery = col.find(
        {},
        {
          sort: {
            $vector: textVector,
          },
          limit: 8,
        },
      );

      const result = (await colQuery.toArray()) as {
        _id: string;
        text: string;
        $vector: number[];
      }[];

      // Get the maximal marginal relevance to sort the result with both relevant and diverse answer
      const mmrVector = maximalMarginalRelevance(
        textVector,
        result.map((row) => row.$vector),
        0.5,
        5,
      );
      const sortedResult = mmrVector.map((index) => result[index]);

      return sortedResult.map((row) => row.text);
    } catch (e) {
      captureException(e);
      return [];
    }
  }
}
