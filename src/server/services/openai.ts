import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const generateTravelGuide = async (countryName: string, options: string[]) => {
//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     store: true,
//     messages: [
//       {
//         role: "user", 
//         content: `Write a quick travel guide for the country ${countryName}. We want to prioritze the following attributes when curating this guide: ${options.join(", ")}`
//       },
//     ],
//   });

//   return completion.choices[0].message.content;
// };