const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');


const filePath = path.join(__dirname, '../../../data/welcome.json');
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));


module.exports = async (client, member) => {


    console.log('working')
    if (!member.guild) return;

    try {
        const canvas = Canvas.createCanvas(1000, 630);
        const ctx = canvas.getContext('2d');

        const astArray = jsonData.assets;
        let randIndex = Math.floor(Math.random() * astArray.length);
        const data = astArray[randIndex]
        const emojisArray = data.emojis

        const background = await Canvas.loadImage(data.background);

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


        const avatarX = canvas.width / 2;
        const avatarY = canvas.height / 2;
        const avatarRadius = 120;

        const { body } = await request(member.displayAvatarURL({ extension: 'jpg' }));
        const avatar = await Canvas.loadImage(await body.arrayBuffer());
        ctx.save();

        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);

        ctx.restore();
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#000000';
        ctx.stroke();



        ctx.font = '65px Impact';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(jsonData.title, canvas.width / 5, canvas.height / 4);
        ctx.fillText(jsonData.title, canvas.width / 5, canvas.height / 4);

        drawText(ctx, member.displayName, canvas.width / 2 - ctx.measureText(member.displayName).width / 2, canvas.height - 100, {
            padding: 10,
            bgColor: data.bgColor,
            textColor: '#ffffff',
            font: applyText(canvas, member.displayName),
        });

        const counterString = `Member #${member.guild.memberCount}`;
        drawText(ctx, counterString, canvas.width / 2 - ctx.measureText(counterString).width / 2.5, 80, {
            padding: 5,
            bgColor: data.bgColor,
            textColor: '#ffffff',
            font: '38px Arial',
        });


        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'welcome-image.png' });

        const channel = member.guild.channels.cache.find(
            (ch) => ch.id === jsonData.channel
        );
        if (!channel) {
            console.error("Channel not found:", jsonData.channel);
            return;
        }
        const message = `Hi hello ${emojisArray[0]} welcome to our server. Glad to see new people joining us <@${member.id}> #${member.guild.memberCount}. We are ⚔ Secret Base ⚔ ${emojisArray[1]} . 
              
            We are hoping to know you better. Hope you like been here. Thank you <:ElivThankYou:1295009702530515005>
            
            `


        channel.send({
            content: message,
            files: [attachment]
        });
        console.log('finished')

    } catch (err) {
        console.error("Error processing welcome image:", err);
    }


};

function applyText(canvas, text) {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;

    do {
        ctx.font = `${fontSize -= 10}px Arial`;
    } while (ctx.measureText(text).width > canvas.width - 200);

    return ctx.font;
}

function drawText(ctx, text, x, y, options = {}) {
    const padding = options.padding || 10;
    const bgColor = options.bgColor || 'rgba(0, 0, 0, 0.5)';
    const textColor = options.textColor || '#ffffff';
    const font = options.font || '32px Arial';

    ctx.font = font;
    const textWidth = ctx.measureText(text).width;
    const textHeight = parseInt(font, 10);

    const rectX = x - padding;
    const rectY = y - textHeight;
    const rectWidth = textWidth + padding * 2;
    const rectHeight = textHeight + padding * 2;

    ctx.fillStyle = bgColor;
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    ctx.strokeStyle = '#000000';
    ctx.fillStyle = textColor;
    ctx.lineWidth = 2;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
}
