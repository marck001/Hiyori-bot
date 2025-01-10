
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');
const { GlobalFonts } = Canvas


const filePath = path.join(__dirname, '../../../data/streakRecord.json');
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
GlobalFonts.registerFromPath(path.join(__dirname, '../../../data/fonts/impact.ttf'), 'Impact');
GlobalFonts.registerFromPath(path.join(__dirname, '../../../data/fonts/arial.ttf'), 'Arial');



module.exports = async ( streakCount,sticker, record,user,channel) => {


    try {
        const canvas = Canvas.createCanvas(800, 400);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage( jsonData.background || 'https://media.sketchfab.com/models/c2400a60188e411c9c52add8983574e6/thumbnails/8ed44a79373a414688b64b3d351d2c30/e2f60297f67f494ea328f19eb022736e.jpeg');

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


        const stickerX = canvas.width - 220;
        const stickerY = 90;
        const stickerSize = 160;

        const stickerURL = sticker.animated
        ? `https://cdn.discordapp.com/emojis/${sticker.id}.gif`
        : `https://cdn.discordapp.com/emojis/${sticker.id}.png`;

   
        const { body } = await request(stickerURL);
        const stickerImg = await Canvas.loadImage(await body.arrayBuffer());
        ctx.save();

        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(stickerX - 10, stickerY - 10, stickerSize + 20, stickerSize + 20);
        ctx.drawImage(stickerImg, stickerX, stickerY, stickerSize, stickerSize);
        ctx.restore();

        ctx.font = '38px Impact';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.strokeText('New Streak Record', canvas.width / 3, 80);
        ctx.fillText('New Streak Record', canvas.width / 3, 80);
        
        // Streak Count
        ctx.font = '30px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.strokeText(`${streakCount} × ${sticker.name}`, canvas.width / 3, 130);
        ctx.fillText(`${streakCount} × ${sticker.name}`, canvas.width / 3, 130);
        
        // "In a row!"
        ctx.font = '28px Impact';
        ctx.strokeText('In a row!', canvas.width / 3, 180);
        ctx.fillText('In a row!', canvas.width / 3, 180);
        
        // Last record difference
        ctx.font = '22px Arial';
        ctx.strokeText(`${record} of the last record`, canvas.width / 3, 230);
        ctx.fillText(`${record} of the last record`, canvas.width / 3, 230);
        
        // Broken by user
        ctx.font = '24px Arial';
        ctx.strokeText(`Broken by ${user.displayName}`, canvas.width / 3, 280);
        ctx.fillText(`Broken by ${user.displayName}`, canvas.width / 3, 280);

       

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'streakRecord-image.png' });

        await channel.send({
            content: 'Test',
            files: [attachment]
        });
        console.log("sent")

    } catch (err) {
        console.error("Error processing  image:", err);
    }


}
/*
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

*/