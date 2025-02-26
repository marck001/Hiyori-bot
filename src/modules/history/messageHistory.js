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
    data.messages.push({
        role,
        content,
        ...metadata, 
        timestamp: new Date().toISOString(), 
    });


    if (data.messages.length > 20) {
        data.messages.splice(0, data.messages.length - 20); 
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); 
}



function getMessageHistory(channelId) {
    const data = loadData();
    return data.messages.filter((message) => message.channelId === channelId);
}

module.exports = {getMessageHistory,addMessageToHistory }