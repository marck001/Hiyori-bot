
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');
const { GlobalFonts } = Canvas
const sharp = require('sharp');


const filePath = path.join(__dirname, '../../../data/streakRecord.json');
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
GlobalFonts.registerFromPath(path.join(__dirname, '../../../data/fonts/impact.ttf'), 'Impact');
GlobalFonts.registerFromPath(path.join(__dirname, '../../../data/fonts/arial.ttf'), 'Arial');



module.exports = async (streakCount, sticker, record, user, channel) => {


    try {
        const canvas = Canvas.createCanvas(800, 400);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(jsonData.background || 'https://media.sketchfab.com/models/c2400a60188e411c9c52add8983574e6/thumbnails/8ed44a79373a414688b64b3d351d2c30/e2f60297f67f494ea328f19eb022736e.jpeg');

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


        const stickerX = canvas.width - 250;
        const stickerY = 90;
        const stickerSize = 220;

        const stickerURL = `https://cdn.discordapp.com/stickers/${sticker.id}.png`;

        const { body } = await request(stickerURL);
        const buffer = Buffer.from(await body.arrayBuffer());

        // Convert APNG to PNG (if animated) or keep PNG (if static)
        const imageBuffer = await sharp(buffer)
            .toFormat('png')  // Ensures PNG output
            .toBuffer();


        const stickerImg = await Canvas.loadImage(imageBuffer);

        ctx.save();

        ctx.beginPath();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1;
        ctx.strokeRect(stickerX - 10, stickerY - 10, stickerSize + 20, stickerSize + 20);
        ctx.drawImage(stickerImg, stickerX, stickerY, stickerSize, stickerSize);
        ctx.restore();

        ctx.font = '38px Impact';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.strokeText('New Streak Record', canvas.width / 3, 115);
        ctx.fillText('New Streak Record', canvas.width / 3, 115);

        // Streak Count
        ctx.font = '30px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.strokeText(`${streakCount} × ${sticker.name}`, canvas.width / 3, 160);
        ctx.fillText(`${streakCount} × ${sticker.name}`, canvas.width / 3, 160);

        // "In a row!"
        ctx.font = '28px Impact';
        ctx.strokeText('In a row!', canvas.width / 3, 210);
        ctx.fillText('In a row!', canvas.width / 3, 210);

        // Last record difference
        ctx.font = '22px Arial';
        ctx.strokeText(`${record} of the last record`, canvas.width / 3, 260);
        ctx.fillText(`${record} of the last record`, canvas.width / 3, 260);

        // Broken by user
        ctx.font = '24px Arial';
        ctx.strokeText(`Broken by ${user.displayName}`, canvas.width / 3, 310);
        ctx.fillText(`Broken by ${user.displayName}`, canvas.width / 3, 310);



        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'streakRecord-image.png' });

        await channel.send({
            content: 'New Streak record',
            files: [attachment]
        });
        console.log("sent")

    } catch (err) {
        console.error("Error processing  image:", err);
    }


}
