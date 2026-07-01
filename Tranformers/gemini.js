import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: "",
});

client.models.generateContent({
    model:'gemini-2.5-flash',
    contents:'how do i get response from chatGPT'
}).then(response=>{
    console.log(response.text)
})