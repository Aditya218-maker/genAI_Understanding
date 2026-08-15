import 'dotenv/config';
import readline from 'readline/promises'; //to take user input 
import { ChatMistralAI } from '@langchain/mistralai';
import { sendEmail } from './mail.service.js';

// by default AI k pass chat history nahi hoti that means wo current chat se pehle wle chat ko bhool jata hai 
// for that we import these packages 
import { HumanMessage } from 'langchain'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const model = new ChatMistralAI({
  model: 'mistral-small-latest' //use small models

})

const messages = []; //to maintain. chat history


// ye loop infinte times chalega 
// matlab jab tak 
while(true) {
    const userInput = await rl.question("\x1b[32mYou:\x1b[0m ")  //user se input liya aur userInput constant me save kiya
//will use colours to show chats

    messages.push(new HumanMessage(userInput)) //naye user input ko messages array me daal do

    const response = await model.invoke(messages) 
    //ab server chat history maintain krne k liye pure messgaes arrya ko hi Ai k paas bhejega
    //aur ai pure convo history ko dekh pata hai

    messages.push(response) // naye ai response ko messages array me daaldo
    
    console.log(`\x1b[34m[AI]\x1b[0m ${response.content}`)
}

rl.close();  //stop taking user input 


