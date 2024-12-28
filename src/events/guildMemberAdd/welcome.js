const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');


const filePath = path.join(__dirname, '../../../data/welcome.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));


module.exports = async (client, member) => {



    console.log("loading")


    console.log(`New member joined: ${member.displayName}`);
    console.log('working')
    if (!member.guild) return;

    try {
        const canvas = Canvas.createCanvas(1000, 630);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage(data.background);

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const { body } = await request(member.displayAvatarURL({ extension: 'jpg' }));
        const avatar = await Canvas.loadImage(await body.arrayBuffer());



        ctx.beginPath();

        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);

        ctx.closePath();

        ctx.clip();

        ctx.drawImage(avatar, 25, 25, 200, 200);
        ctx.font = applyText(canvas, member.displayName);
        ctx.fillStyle = '#ffffff';

        ctx.fillText(
            member.displayName,
            canvas.width / 2 - ctx.measureText(member.displayName).width / 2,
            canvas.height - 100
        );

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'welcome-image.png' });

        const channel = member.guild.channels.cache.find(
            (ch) => ch.id === data.channel
        );
        if (!channel) {
            console.error("Channel not found:", data.channel);
            return;
        }


        channel.send({ files: [attachment] });
        console.log('finished')

    } catch (err) {
        console.error("Error processing welcome image:", err);
    }


};

function applyText(canvas, text) {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;

    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);

    return ctx.font;
}