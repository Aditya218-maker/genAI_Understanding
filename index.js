import 'dotenv/config';
import readline from 'readline/promises'; 
import { ChatMistralAI } from '@langchain/mistralai';
import { HumanMessage, tool, createAgent } from 'langchain'
import * as z from "zod";
import { sendEmail } from './mail.service.js';


const EmailTool = tool(
    sendEmail,
    {
        name:"Emailtool",
        description: "Use this tool to send an Email.",
        schema: z.object({
            to: z.string().describe("The recipient's Email adress"),
            html: z.string().describe("The HTML content of the Email"),
            subject: z.string().describe("The subject of the Email")
        })
    }
)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const model = new ChatMistralAI({
  model: 'mistral-small-latest' 
})

//An agent is a model calling tools in a loop until a given task is complete.
const agent = createAgent(
    { 
        model, 
        tools : [ EmailTool ]
    }
);

const messages = []; 

while(true) {
    const userInput = await rl.question("\x1b[32mYou:\x1b[0m ")  


    messages.push(new HumanMessage(userInput)) 

    //by default agent provides whole history not just a message
    const response = await agent.invoke({messages}) 

    messages.push(response.messages[response.messages.length-1])

   
    console.log(response)
}

rl.close();  


