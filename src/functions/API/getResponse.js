

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../../data/chatbot.json');
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

async function getResponse(client, history, userMessage, index) {
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
            content: jsonData.system,
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

    if ((data.error && data.error.code === '429') || !data.choices || data.choices.length === 0 || !data.choices[0].message) {
      client.tokenIndex = client.tokenIndex >= jsonData.tokens.length - 1 ? 0 : client.tokenIndex + 1;
      console.log("Token updated to ", client.tokenIndex);
      return await getResponse(client, history, userMessage, client.tokenIndex);
    }
    const botReply = data.choices[0].message.content;

    console.log('message:', botReply);

    return botReply;

  } catch (err) {

    client.tokenIndex = client.tokenIndex >= jsonData.tokens.length - 1 ? 0 : client.tokenIndex + 1;
    console.log("Unexpected error. Retrying with a new token...");
    return await getResponse(client, history, userMessage, client.tokenIndex);
  }

}

module.exports = { getResponse };