import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"
dotenv.config()
const client = new GoogleGenAI({
  apiKey: process.env.API_KEY
});

client.models.generateContent({
    model:'gemini-1.0-pro',
    contents:'im using free plan of google ai studio, how many requests i can make? '
}).then(response=>{
    console.log(response.text)
})
 