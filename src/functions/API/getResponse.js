

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../../data/chatbot.json');
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

async function getResponse(history,userMessage,index) {
    try {
        const response = await fetch(process.env.API_BASE, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jsonData.tokens[index]}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: jsonData.model, 
            messages: [
                {
                    role: 'system',
                    content:jsonData.system ,
                  },
                ...history.filter((msg) => msg.role === 'user') 
                  .map((msg) => ({ role: msg.role, content: msg.content })),
              {
                role: 'user',
                content: userMessage,
              },
            ],
          }),
        });
  
        const data = await response.json();
        console.log('API Response:', data); 
  
        
        const botReply = data.choices[0].message.content;
        console.log('message:', botReply); 

        return botReply;

    } catch (err) {
        console.error('Error in LLM API response:', err);
        throw err;
    }

}

module.exports = { getResponse };