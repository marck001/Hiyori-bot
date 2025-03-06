const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { quantize, applyPalette, GIFEncoder } = require('gifenc');


const DEFAULT_DELAY = 20;


async function loadFrames(url, FRAMES) {
    const frames = [];
    for (let i = 0; i < FRAMES; i++) {
        const frame = await loadImage(`${url}${i}.gif`);
        frames.push(frame);
    }
    return frames;
}


async function generatePetGif(avatarUrl, resolution, FRAMES) {
    const frames = await loadFrames(`https://raw.githubusercontent.com/VenPlugs/petpet/main/frames/pet`, 10);
    const avatar = await loadImage(avatarUrl);

    const canvas = createCanvas(resolution, resolution);
    const ctx = canvas.getContext('2d');

    const gif = GIFEncoder();

    for (let i = 0; i < FRAMES; i++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        const j = i < FRAMES / 2 ? i : FRAMES - i;
        const width = 0.8 + j * 0.02;
        const height = 0.8 - j * 0.05;
        const offsetX = (1 - width) * 0.5 + 0.1;
        const offsetY = 1 - height - 0.08;


        ctx.save();
        ctx.beginPath();
        ctx.arc(
            (offsetX + width / 2) * resolution,
            (offsetY + height / 2) * resolution,
            (width * resolution) / 2,
            0,
            Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();


        ctx.drawImage(
            avatar,
            offsetX * resolution,
            offsetY * resolution,
            width * resolution,
            height * resolution
        );
        ctx.restore();

        ctx.drawImage(frames[i], 0, 0, resolution, resolution);

        const imageData = ctx.getImageData(0, 0, resolution, resolution);
        const palette = quantize(imageData.data, 256, { transparent: true });
        const index = applyPalette(imageData.data, palette);


        gif.writeFrame(index, resolution, resolution, {
            transparent: true,
            palette,
            delay: DEFAULT_DELAY,
        });
    }

    gif.finish();

    const gifBuffer = Buffer.from(gif.bytesView());

    return gifBuffer;
}

async function generateSoCuteGif(avatarUrl, resolution, FRAMES) {
    const frames = await loadFrames(`https://raw.githubusercontent.com/marck001/Hiyori-bot/main/data/img/frames/cute/frame`, 12);
    const avatar = await loadImage(avatarUrl);

    const canvas = createCanvas(resolution, resolution);
    const ctx = canvas.getContext('2d');

    const gif = GIFEncoder();

    const SHAKE_AMPLITUDE = 3;
    const SHAKE_FREQUENCY = 0.2;

    for (let i = 0; i < FRAMES; i++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        const j = i < FRAMES / 2 ? i : FRAMES - i;
        const width = 0.8 + j * 0.02;
        const height = 0.8 - j * 0.05;
        const offsetX = (1 - width) * 0.5 + 0.1;
        const offsetY = 1 - height - 0.08;


        const shakeOffset = Math.sin(i * SHAKE_FREQUENCY) * SHAKE_AMPLITUDE;


        ctx.save();
        ctx.beginPath();
        ctx.arc(
            (offsetX + width / 2) * resolution,
            (offsetY + height / 2) * resolution,
            (width * resolution) / 2,
            0,
            Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();


        ctx.drawImage(
            avatar,
            offsetX * resolution + shakeOffset,
            offsetY * resolution,
            width * resolution,
            height * resolution
        );
        ctx.restore();


        ctx.drawImage(frames[i], 0, 0, resolution, resolution);


        const imageData = ctx.getImageData(0, 0, resolution, resolution);
        const palette = quantize(imageData.data, 256, { transparent: true });
        const index = applyPalette(imageData.data, palette);

        gif.writeFrame(index, resolution, resolution, {
            transparent: true,
            palette,
            delay: DEFAULT_DELAY,
        });
    }

    gif.finish();

    const gifBuffer = Buffer.from(gif.bytesView());

    return gifBuffer;
}


module.exports = { generatePetGif, generateSoCuteGif };