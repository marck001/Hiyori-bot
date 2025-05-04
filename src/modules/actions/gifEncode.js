const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { quantize, applyPalette, GIFEncoder } = require('gifenc');
const { InvalidURLError, ImageProcessingError, FileReadError } = require('../exceptions/Exceptions');

const DEFAULT_DELAY = 20;
const DEFAULT_RESOLUTION = 128;
const IS_ROUNDED = false;
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



async function petpetMaker(imageUrl, FRAMES, delay = DEFAULT_DELAY, resolution = DEFAULT_RESOLUTION, rounded = IS_ROUNDED) {

    try {
        const frames = await loadFrames(`https://raw.githubusercontent.com/VenPlugs/petpet/main/frames/pet`, 10);

        const avatar = await loadImage(imageUrl)
            .catch(error => {
                if (error.code === 'ERR_INVALID_URL') {
                    throw new InvalidURLError(imageUrl);
                }
                throw new ImageProcessingError(`Failed to load image: ${error.message}`);
            });

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

            if (rounded) {

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
            }

            ctx.drawImage(
                avatar,
                offsetX * resolution,
                offsetY * resolution,
                width * resolution,
                height * resolution
            );
            if (rounded) ctx.restore();


            ctx.drawImage(frames[i], 0, 0, resolution, resolution);
            const imageData = ctx.getImageData(0, 0, resolution, resolution);
            const palette = quantize(imageData.data, 256, { transparent: true });
            const index = applyPalette(imageData.data, palette);
            gif.writeFrame(index, resolution, resolution, {
                transparent: true,
                palette,
                delay,
            });
        }
        gif.finish();
        const gifBuffer = Buffer.from(gif.bytesView());

        return gifBuffer;
    } catch (error) {
        if (error.message.includes('Symbol.asyncIterator')) {
            throw new FileReadError("Failed to process file - invalid file data");
        } else {
            throw new ImageProcessingError(`Error generating GIF: ${error.message}`);
        }
    }
}

async function generateSoCute(imageUrl, FRAMES, delay = DEFAULT_DELAY, resolution = DEFAULT_RESOLUTION, rounded = IS_ROUNDED) {
    const frames = await loadFrames(`https://raw.githubusercontent.com/marck001/Hiyori-bot/main/data/img/frames/cute/frame`, 12);
    const avatar = await loadImage(imageUrl);

    const canvas = createCanvas(resolution, resolution);
    const ctx = canvas.getContext('2d');

    const gif = GIFEncoder();


    const HORIZONTAL_SHAKE_AMPLITUDE = 2;
    const HORIZONTAL_SHAKE_FREQUENCY = 3;

    const VERTICAL_SHAKE_AMPLITUDE = 1;
    const VERTICAL_SHAKE_FREQUENCY = 0.9;

    for (let i = 0; i < FRAMES; i++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // const j = i < FRAMES / 2 ? i : FRAMES - i;

        const width = 0.8;
        const height = 0.8;
        const offsetX = (1 - width) * 0.5 + 0.135;
        const offsetY = 1.0 - height - 0.05;
        const horizontalShake = Math.sin(i * HORIZONTAL_SHAKE_FREQUENCY) * HORIZONTAL_SHAKE_AMPLITUDE;
        const verticalShake = Math.cos(i * VERTICAL_SHAKE_FREQUENCY) * VERTICAL_SHAKE_AMPLITUDE;

        if (rounded) {
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
        }

        ctx.drawImage(
            avatar,
            offsetX * resolution + horizontalShake,
            offsetY * resolution + verticalShake,
            width * resolution,
            height * resolution
        );

        if (rounded) ctx.restore();


        ctx.drawImage(frames[i], 0, 0, resolution, resolution);

        const imageData = ctx.getImageData(0, 0, resolution, resolution);
        const palette = quantize(imageData.data, 256, { transparent: true });
        const index = applyPalette(imageData.data, palette);

        gif.writeFrame(index, resolution, resolution, {
            transparent: true,
            palette,
            delay,
        });
    }

    gif.finish();
    return Buffer.from(gif.bytesView());
}

async function hyperSoCuteMaker(imageUrl, FRAMES, delay = DEFAULT_DELAY, resolution = DEFAULT_RESOLUTION, rounded = IS_ROUNDED) {
    const frames = await loadFrames(`https://raw.githubusercontent.com/marck001/Hiyori-bot/main/data/img/frames/cute/frame`, 12);
    const avatar = await loadImage(imageUrl);

    const canvas = createCanvas(resolution, resolution);
    const ctx = canvas.getContext('2d');

    const gif = GIFEncoder();

    const HORIZONTAL_SHAKE_AMPLITUDE = 0.4;
    const HORIZONTAL_SHAKE_FREQUENCY = 0.35;
    const VERTICAL_SHAKE_AMPLITUDE = 0.1;
    const VERTICAL_SHAKE_FREQUENCY = 0.2;

    for (let i = 0; i < FRAMES; i++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const j = i < FRAMES / 2 ? i : FRAMES - i;

        const width = 0.85 + j * 0.02;
        const height = 0.85 - j * 0.03;
        const offsetX = (1 - width) * 0.5 + 0.1;
        const offsetY = 1.0 - height - 0.05;

        const horizontalShake = Math.sin(i * HORIZONTAL_SHAKE_FREQUENCY) * HORIZONTAL_SHAKE_AMPLITUDE;
        const verticalShake = Math.cos(i * VERTICAL_SHAKE_FREQUENCY) * VERTICAL_SHAKE_AMPLITUDE;

        const drawX = offsetX * resolution + horizontalShake;
        const drawY = offsetY * resolution + verticalShake;
        const drawWidth = width * resolution;
        const drawHeight = height * resolution;

        if (rounded) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(
                drawX + drawWidth / 2,
                drawY + drawHeight / 2,
                Math.min(drawWidth, drawHeight) / 2,
                0,
                Math.PI * 2
            );
            ctx.closePath();
            ctx.clip();
        }

        ctx.drawImage(
            avatar,
            drawX,
            drawY,
            drawWidth,
            drawHeight
        );

        if (rounded) ctx.restore();

        ctx.drawImage(frames[i], 0, 0, resolution, resolution);

        const imageData = ctx.getImageData(0, 0, resolution, resolution);
        const palette = quantize(imageData.data, 256, { transparent: true });
        const index = applyPalette(imageData.data, palette);

        gif.writeFrame(index, resolution, resolution, {
            transparent: true,
            palette,
            delay,
        });
    }

    gif.finish();
    return Buffer.from(gif.bytesView());
}

async function SoCuteMaker(imageUrl, FRAMES, delay = DEFAULT_DELAY, resolution = DEFAULT_RESOLUTION, rounded = IS_ROUNDED) {

    try {
        const frames = await loadFrames(`https://raw.githubusercontent.com/marck001/Hiyori-bot/main/data/img/frames/cute/frame`, 12);
        const avatar = await loadImage(imageUrl)
            .catch(error => {
                if (error.code === 'ERR_INVALID_URL') {
                    throw new InvalidURLError(imageUrl);
                }
                throw new ImageProcessingError(`Failed to load image: ${error.message}`);
            });


        const canvas = createCanvas(resolution, resolution);
        const ctx = canvas.getContext('2d');

        const gif = GIFEncoder();

        const SHAKE_AMPLITUDE = 0.5;
        const SHAKE_FREQUENCY = 0.1;

        for (let i = 0; i < FRAMES; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);


            const j = i < FRAMES / 2 ? i : FRAMES - i;
            const width = 0.8 + j * 0.02;
            const height = 0.8 - j * 0.05;
            const offsetX = (1 - width) * 0.5 + 0.1;
            const offsetY = 1.1 - height - 0.05;


            const shakeOffset = Math.sin(i * SHAKE_FREQUENCY) * SHAKE_AMPLITUDE;

            if (rounded) {

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
            }

            ctx.drawImage(
                avatar,
                offsetX * resolution + shakeOffset,
                offsetY * resolution,
                width * resolution,
                height * resolution
            );
            if (rounded) ctx.restore();
            ctx.drawImage(frames[i], 0, 0, resolution, resolution);
            const imageData = ctx.getImageData(0, 0, resolution, resolution);
            const palette = quantize(imageData.data, 256, { transparent: true });
            const index = applyPalette(imageData.data, palette);

            gif.writeFrame(index, resolution, resolution, {
                transparent: true,
                palette,
                delay,
            });
        }

        gif.finish();

        const gifBuffer = Buffer.from(gif.bytesView());

        return gifBuffer;
    } catch (error) {
        if (error.message.includes('Symbol.asyncIterator')) {
            throw new FileReadError("Failed to process file - invalid file data");
        } else {
            throw new ImageProcessingError(`Error generating GIF: ${error.message}`);
        }
    }
}



async function explosionMaker(imageUrl, FRAMES, delay = DEFAULT_DELAY, resolution = DEFAULT_RESOLUTION, rounded = IS_ROUNDED) {
    try {
        const frames = await loadFrames(`https://raw.githubusercontent.com/marck001/Hiyori-bot/main/data/img/frames/explosion/frame`, 17);
        const avatar = await loadImage(imageUrl)
            .catch(error => {
                if (error.code === 'ERR_INVALID_URL') {
                    throw new InvalidURLError(imageUrl);
                }
                throw new ImageProcessingError(`Failed to load image: ${error.message}`);
            });
        const ctx = canvas.getContext('2d');
        const gif = GIFEncoder();

        for (let i = 0; i < FRAMES; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);


            /*  const j = i < FRAMES / 2 ? i : FRAMES - i;
              const width = 0.8 + j * 0.02;
              const height = 0.8 - j * 0.05;
              const offsetX = (1 - width) * 0.5 + 0.1;
              const offsetY = 1 - height - 0.08; */

            if (rounded) {

                ctx.save();
                ctx.beginPath();
                ctx.arc(
                    resolution / 2,
                    resolution / 2,
                    resolution / 2,
                    0,
                    Math.PI * 2
                );
                ctx.closePath();
                ctx.clip();
            }
            ctx.drawImage(
                avatar,
                0,
                0,
                resolution,
                resolution
            );

            if (rounded) {
                ctx.restore();
            }
            ctx.drawImage(frames[i], 0, 0, resolution, resolution);
            const imageData = ctx.getImageData(0, 0, resolution, resolution);
            const palette = quantize(imageData.data, 256, { transparent: true });
            const index = applyPalette(imageData.data, palette);
            gif.writeFrame(index, resolution, resolution, {
                transparent: true,
                palette,
                delay,
            });
        }
        gif.finish();
        const gifBuffer = Buffer.from(gif.bytesView());
        return gifBuffer;
    } catch (error) {
        if (error.message.includes('Symbol.asyncIterator')) {
            throw new FileReadError("Failed to process file - invalid file data");
        } else {
            throw new ImageProcessingError(`Error generating GIF: ${error.message}`);
        }
    }
}

module.exports = { petpetMaker, SoCuteMaker, hyperSoCuteMaker, generatePetGif, explosionMaker, generateSoCute };