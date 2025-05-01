const {
    EmbedBuilder
} = require('discord.js');


module.exports = (message) => {
     return embed = new EmbedBuilder()
                .setColor(0xD4D5D2)
                .setDescription(message);  

}