

async function resolveImage(options, interaction) {

    for (const opt of options) {
        switch (opt.name) {
            case 'image':
                const attachment = opt.attachment;
                if (attachment) {
                    if (!attachment.contentType?.startsWith('image/')) {
                        throw 'Upload is not an image';
                    }
                    return attachment.url;
                }
                break;
            case 'url':
                if (opt.value) {
                    return opt.value;
                }
                break;
            case 'user':
                if (opt.value) {
                    const user = await interaction.client.users.fetch(opt.value);
                    if(user) return user.displayAvatarURL({ size: 2048, extension: 'png' });
                }
                break;
        }
    }
    throw 'No image specified!';
}


module.exports = {resolveImage}