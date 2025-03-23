
const {
    EmbedBuilder, AttachmentBuilder
} = require('discord.js');

const { generatePetGif, SoCuteMaker } = require('../../modules/actions/gifEncode')
module.exports = async (replyMessage, message, isPing) => {

    let embed;
    const channel = message.channel;
    const member = message.member;



    if (replyMessage.includes('FILTERED!')) {
        if (isPing) {
            embed = new EmbedBuilder()
                .setColor(0xD4D5D2)
                .setThumbnail(member.displayAvatarURL())
                .setDescription(`**${member.displayName}** got FILTERED! \n\n **${member.displayName} said: ** \n ${message.content}  `)
                .setTimestamp();
            message.delete();
            return await channel.send({ embeds: [embed] });
        } else {
            return await channel.send(`-# I tried getting ${message.author.displayName} FILTERED!, but something is stopping me. I guess you are saved for now...`)
        }

    } else if (replyMessage.includes('petpet')) {
        const avatarUrl = member.displayAvatarURL({ size: 2048, extension: 'png' });
        const gifBuffer = await generatePetGif(avatarUrl, 100, 10);
        const attachment = new AttachmentBuilder(gifBuffer, { name: `petpet.gif` });
        embed = new EmbedBuilder()
            .setColor(0xD4D5D2)
            .setDescription(`I'm patting **${member.displayName}** (˶˃ ᵕ ˂˶) `)
            .setImage(`attachment://petpet.gif`)
            .setTimestamp();
        return await channel.send({ content: null, embeds: [embed], files: [attachment] });
    } else if (replyMessage.includes('soCute')) {
        const avatarUrl = member.displayAvatarURL({ size: 2048, extension: 'png' });
        const gifBuffer = await SoCuteMaker(avatarUrl, 12, 20, 100, true);
        const attachment = new AttachmentBuilder(gifBuffer, { name: `socute.gif` });
        embed = new EmbedBuilder()
            .setColor(0xD4D5D2)
            .setDescription(` **${member.displayName}** is cute (˶˃ ᵕ ˂˶) `)
            .setImage(`attachment://socute.gif`)
            .setTimestamp();
        return await channel.send({ content: null, embeds: [embed], files: [attachment] });
    }






}


const includesWord = (replyMessage) => {
    return replyMessage.includes('FILTERED!')
}