
const {
    EmbedBuilder
  } = require('discord.js');


module.exports = async (userMessage, user, channel) => {

    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(`**${user.displayName}** got FILTERED! \n\n **${user.displayName} said: ** \n ${userMessage} `)
        .setTimestamp();

    channel.send({ embeds: [embed] });



}