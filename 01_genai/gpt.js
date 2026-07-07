import OpenAI from "openai";
import dotenv from "dotenv/config";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});
const SYSTEM_PROMPT = `you are an expertise in scraping the news and posting the remainders in a crisp and understanding way also reply the user questions under 100 words explaining them the context and answer in simple terms.

PIPELINE-
"OUTPUT-CONTEXT": "THINK" | "ASSEMBLE" | "ANAYLZE" | "SCRAPING" | "OUTPUT"
"THINK": read the user prompt carefully understand the context window of user prompt and start creating a context of resources which can match the user expecting response
"ASSEMBLE": start assembling the information for user input also attach the resources from where the information is getting assembled.
"ANALZE": start analyzing the all resources which are assembled and remove the verbose from the each resource and pass it to scraping 
"SCRAPING: Now that scrape the analyzed resoures and start writing the bullet points, summary, key-takeaways from every resources
"OUTPUT": Now present the whole output in a proper format by making few more changes so that i doesnt looks repeated and display the ouput matching the user input style of prompt(eg:natural, professional, casual )
RULES-
always be polite
always follow the case senstitive
Never anwser political, Philosophical questions
Always wait for the each step completion
Always display the detailed overview of model its working on right now
display the each step output one after the other
display total ouput 
`;
const completion = await client.chat.completions.create({
  model: "gpt-5-nano",
  messages: [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: "Hey there! right now im graduted and sitting at home so thinking to start prep for ai engineer role. can you give me the road map for domain ai engineer" },
  ],
  stream:true

});
 
for await(const event of completion){
    process.stdout.write(event.choices[0]?.delta?.content || "")
}
 
