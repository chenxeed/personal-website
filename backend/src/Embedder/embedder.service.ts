import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { blob } from 'stream/consumers';
import { Readable } from 'stream';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { AstraDB } from '@datastax/astra-db-ts';

async function getCollectionDB() {
  const { DATASTAX_TOKEN, DATASTAX_API_ENDPOINT } = process.env;
  const db = new AstraDB(DATASTAX_TOKEN, DATASTAX_API_ENDPOINT);
  try {
    await db.createCollection('personal_vector', {
      vector: {
        dimension: 1536,
        metric: 'cosine',
      },
    });
  } catch (e) {
    console.log(e, 'collection already exists');
  }
  const col = await db.collection('personal_vector');
  return col;
}

async function getTextVector(texts: string[]) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'text-embedding-ada-002',
  });
  const vectors = await embeddings.embedDocuments(texts);
  return vectors;
}

export class EmbedderService {
  constructor() {}

  async createEmbedder(body: { file: Express.Multer.File }) {
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
      chunkSize: 1024,
      chunkOverlap: 200,
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
      });
    });

    const result = await col.insertMany(dbRows);

    return result;
  }

  async getRelevantAnswer(searchText: string) {
    const col = await getCollectionDB();

    // Convert the search text into embeddings vector
    console.log('searchText', searchText);
    const [textVector] = await getTextVector([searchText]);

    // Search the DB for the most relevant answer
    const result = (await col
      .find(
        {},
        {
          sort: {
            $vector: textVector,
          },
          limit: 2,
        },
      )
      .toArray()) as { _id: string; text: string; $vector: number[] }[];

    // Based on the

    return result;
  }
}
