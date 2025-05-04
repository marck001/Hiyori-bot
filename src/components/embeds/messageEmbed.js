const {
    EmbedBuilder
} = require('discord.js');


module.exports = (message, type = "info") => {
    let embedColor = `0xD4D5D2`;
    let resultMessage = "Hello there";
    switch (type) {
        case 'success':
            embedColor = `#57F287`;
            resultMessage = `<a:success:1368297692727480350> ${message} `;
            break;
        case 'error':
            embedColor = `#ED4245`
            resultMessage = `<:error:1368294921093779537> ${message} `;
            break;
        case 'info':
            embedColor = `#3498DB`;
            resultMessage = `<:info:1368299344570224683> ${message} `;
            break;
    }
    return embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(resultMessage);
}