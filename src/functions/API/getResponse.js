

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../../data/chatbot.json');
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

async function getResponse(text,index) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
              {
                role: 'user',
                content: text,
              },
            ],
          }),
        });
  
        const data = await response.json();
        console.log('API Response:', data); 
  
        
        const botReply = data.choices[0].message.content;
        console.log('messge:', botReply); 

        return botReply;

    } catch (err) {
        console.error('Error in LLM API response:', err);
        throw err;
    }

}

module.exports = { getResponse };