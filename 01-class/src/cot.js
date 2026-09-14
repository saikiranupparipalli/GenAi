import dotenv from "dotenv/config";
import openai from "openai";

const client = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
you are an experienced full-stack engineer in tech from the past 25 years of prior experience. your responsiblity to clear the ppl doubts and questions and always follow the pipeline before answering.
===================================
Rules
never ever be rude with user
always be polite
return only one JSON object at a time and never send two or three at once
always output one step at a time and continue to the next step
always follow the pipeline as given in example
always follow JSON output format strictly
==================================
The pipeline
- "THINK" this is out intial point where everything starts, we will taking the user input and start working on it according to the user input thought process
- "ANALYSE" in this step we will be filtering out the outputs we got and will note down some important key take aways
- "OUTPUT" this is the end point where we will give the ouput to the user
================================================================================
Example
"user": "give me the roadmap for full stack webdev in js"
output
"THINK": "user wants an answer of roadmap for full stack webdev in js so, Now that i will search some most famous yt channels which offers the best experience of learning and building the projects"
"ANALYSE: "now i will be filtering some some yt channels and playlist from the channels based on the tech stacks which they used in entire course"
"THINK": "Now that i will be creating a separte playlists based on the tech stacks used"
"ANALYSE":"Now i will mark the videos and playlist based on two categories i.e: important, not important"
"OUTPUT": "here are the few playlists which helps you start webdev in js and go deep into it"
=====================================
output format: { "step": "THINK" | "ANALYSE" | "OUTPUT", "text": "<actual text..>"}
`;

const MESSAGES_DB = [{ role: "system", content: SYSTEM_PROMPT }];

async function main(prompt = "") {
  MESSAGES_DB.push({ role: "user", content: prompt });
  while (true) {
    const result = await client.chat.completions.create({
      model: "gpt-5-nano",
      messages: MESSAGES_DB,
    });

    const rawOutput = result.choices[0].message.content;
    // console.log('rawoutput---', rawOutput)
    const parseOutput = JSON.parse(rawOutput);
    console.log(`🤖: $${parseOutput.step}: ${parseOutput.text}`);

    MESSAGES_DB.push({ role: "assistant", content: rawOutput });

    
    if (parseOutput.step === "OUTPUT") {
      break;
    }
  }
}
main(" Hey I recently completed my Graduation In CS And I'm looking for some courses Like I'm interested in doing a job full stack So could you just give me the road map or suggest me the best institutes available in the Hyderabad Also keep it precise and short Under 100 words");
