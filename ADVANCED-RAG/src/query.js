import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
async function query(userQuery) {
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "jsdoc",
    },
  );

  const vectorRetriver = vectorStore.asRetriever({ k: 3 });
  const results = await vectorRetriver.invoke(userQuery);

  const SYSTEM_PROMPT = `
   you are an expertised tutor in javascript and answer the every question of user only from the above provided context document
   - always be polite
   - do not answer anything beyond which is not provided
  - always mention the page number and output should be 5-6 lines
   user Documents:
   ${results.map((e) => JSON.stringify({ pagecontent: e.pageContent, pageNumber: e.metadata.loc.pageNumber })).join("\n")}
  `;

  const llmRes = await client.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userQuery },
    ],
  });

  console.log("LLM RESPONSE \n", llmRes.choices[0].message.content);
}

query('what does asynchronous functions do?');

// 'what does asynchronous functions do?'
