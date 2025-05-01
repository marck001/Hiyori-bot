const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../../data/chatbot.json');


function loadData() {
    if (!fs.existsSync(filePath)) {

        const template = {
            system: "", 
            model: "", 
            role: "chatbot", 
            tokens: [], 
            messages: [], 
        };
        fs.writeFileSync(filePath, JSON.stringify(template, null, 2)); 
        console.log("New chatbot.json file has been created. Please fill in the required fields.");
        return template;
    }

    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}


function addMessageToHistory(role, content, metadata) {
    const data = loadData();
    const userMessages = data.messages.filter(
        (msg) => msg.userId === metadata.userId && msg.channelId === metadata.channelId
    );


    if (userMessages.length >= 8) {
        const oldestUserMessageIndex = data.messages.findIndex(
            (msg) => msg.userId === metadata.userId && msg.channelId === metadata.channelId
        );
        if (oldestUserMessageIndex !== -1) {
            data.messages.splice(oldestUserMessageIndex, 1); 
        }
    }
    data.messages.push({
        role,
        content,
        ...metadata, 
        timestamp: new Date().toISOString(), 
    });


    if (data.messages.length > 100) {
        data.messages.splice(0, data.messages.length - 100); 
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); 
}

function getChannelHistory(history, channelId) {
    return history
        .filter((msg) => msg.channelId === channelId) 
        .slice(-8); 
}


function getMessageHistory(channelId) {
    const data = loadData();
    return getChannelHistory(data.messages, channelId); 
}

module.exports = {getMessageHistory,addMessageToHistory }