
const {
    EmbedBuilder
  } = require('discord.js');


module.exports = async (userMessage, user, channel) => {

    const embed = new EmbedBuilder()
        .setColor(0xD4D5D2)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(`**${user.displayName}** got FILTERED! \n\n **${user.displayName} said: ** \n ${userMessage} `)
        .setTimestamp();

    channel.send({ embeds: [embed] });



}