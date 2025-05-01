
const {
    EmbedBuilder, AttachmentBuilder
} = require('discord.js');

const { SoCuteMaker, petpetMaker ,generateSoCute } = require('../../modules/actions/gifEncode')
module.exports = async (client, replyMessage, message, isPing, targetMember) => {

    let embed;
    const channel = message.channel;
    const lowercaseMsg = replyMessage.toLowerCase()
    if (replyMessage.includes('FILTERED!')) {
        if (isPing && message.author.id !== client.user.id) {
            embed = new EmbedBuilder()
                .setColor(0xD4D5D2)
                .setThumbnail(targetMember.displayAvatarURL())
                .setDescription(`**${targetMember.displayName}** got FILTERED! \n\n **${targetMember.displayName} said: ** \n ${message.content}  `)
                .setTimestamp();
            message.delete();
            return await channel.send({ content: replyMessage, embeds: [embed] });
        } else {
            return await channel.send(`-# I tried getting ${message.author.displayName} FILTERED!, but something is stopping me. I guess you are saved for now...`)
        }

    } else if (lowercaseMsg.includes('petpet')) {
        const avatarUrl = targetMember.displayAvatarURL({ size: 2048, extension: 'png' });
        const gifBuffer = await petpetMaker(avatarUrl, 10, 20, 100, true);
        const attachment = new AttachmentBuilder(gifBuffer, { name: `petpet.gif` });
        embed = new EmbedBuilder()
            .setColor(0xD4D5D2)
            .setDescription(`I'm patting **${targetMember.displayName}** (˶˃ ᵕ ˂˶) `)
            .setImage(`attachment://petpet.gif`)
            .setTimestamp();
        return await channel.send({ content: replyMessage, embeds: [embed], files: [attachment] });
    } else if (lowercaseMsg.includes('socute')) {
        const avatarUrl = targetMember.displayAvatarURL({ size: 2048, extension: 'png' });
        const gifBuffer = await generateSoCute(avatarUrl, 12, 20, 100, true);
        const attachment = new AttachmentBuilder(gifBuffer, { name: `socute.gif` });
        embed = new EmbedBuilder()
            .setColor(0xD4D5D2)
            .setDescription(` **${targetMember.displayName}** is cute (˶˃ ᵕ ˂˶) `)
            .setImage(`attachment://socute.gif`)
            .setTimestamp();
        return await channel.send({ content: replyMessage, embeds: [embed], files: [attachment] });
    } else {
        return await channel.send({ content: replyMessage });
    }
}

