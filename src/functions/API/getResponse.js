

require('dotenv').config();

async function getResponse(text) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: process.env.MODEL, 
            messages: [
                {
                    role: 'system',
                    content: `You are Bot-tester, a bot for testing hiyori features in discord. You don't do anything else, that's your only purpose.`,
                  },
              {
                role: 'user',
                content: text,
              },
            ],
          }),
        });
  
        const data = await response.json();
  
        
        const botReply = data.choices[0].message.content;

        return botReply;

    } catch (err) {
        console.error('Error in LLM API response:', err);
        throw err;
    }

}

module.exports = { getResponse };