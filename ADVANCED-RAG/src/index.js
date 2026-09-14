import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

const key = process.env.OPENAI_API_KEY;
// console.log(apiKey)
async function pdf(filePath) {
  const loader = new PDFLoader(filePath);
  const document = await loader.load();

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    apiKey: key,
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "jsdoc",
    },
  );

  await vectorStore.addDocuments(document);
  console.log("Documents inserted successfully!");
}

pdf("js.pdf").catch(console.error);
