const {
    ApplicationCommandOptionType,
    EmbedBuilder,
    AttachmentBuilder,
} = require('discord.js');
const { petpetMaker, SoCuteMaker } = require('../../modules/actions/gifEncode');
const { resolveImage } = require('../../functions/blob/resolveGifImage')
const emojiUpload = require('../../components/buttons/emojiUpload')
module.exports = {
    deleted: false,
    name: 'make-emoji',
    description: 'Create Custom Animated Emojis',
    options: [
        {
            name: 'gif',
            description: 'The user whose avatar use as image',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'petPet',
                    value: 'petpet'
                },
                {
                    name: 'soCute',
                    value: 'socute'
                }]
        },
        {
            name: 'user',
            description: 'The user whose avatar use as image',
            required: false,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'image',
            description: 'Image attachment to use',
            required: false,
            type: ApplicationCommandOptionType.Attachment,
        },
        {
            name: "url",
            description: "URL to fetch image from",
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'delay',
            description: 'The delay between each frame. Defaults to 20.',
            type: ApplicationCommandOptionType.Integer,
        },
        {
            name: 'resolution',
            description: 'Resolution for the GIF. Defaults to 128.',
            type: ApplicationCommandOptionType.Integer,
        },
        {
            name: 'rounded',
            description: 'The image renders rounded shape.',
            type: ApplicationCommandOptionType.Boolean,
        },
        {
            name: 'no-server-avatar',
            description: 'Use the personal user avatar instead of the server-specific one',
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        },

    ],
    devOnly: false,



    callback: async (client, interaction) => {
        const img = interaction.options.getAttachment('image');
        const gifOption = interaction.options.getString('gif');
        const urlString = interaction.options.getString('url');
        const delay = interaction.options.getInteger('delay') || 20;
        const resolution = interaction.options.getInteger('resolution') || 128;
        const isRounded = interaction.options.getBoolean('rounded') ?? false;
        const noServerAvatar = !interaction.options.getBoolean('no-server-avatar') ?? false;

        try {

            if (!img && !gifOption && !urlString) return interaction.reply({ content: 'You must select a source format among image, url and user. Try again', ephemeral: true });
            if (urlString) {
              const isValidUrl = urlString.match(/\.(jpeg|jpg|png|webp|gif|apng)$/i);
              if (!isValidUrl) {
                return interaction.reply({
                  content:
                    "Invalid file URL. Please provide a valid image or GIF URL ending in .gif | .jpeg | .png like: \n ```https://example.com/mikugif.gif```",
                  ephemeral: true,
                });
              }
            }

            const embedColor = Math.floor(Math.random() * 16777214) + 1;
            const waitEmbed = new EmbedBuilder()
              .setColor(embedColor)
              .setDescription(`Generating your **${gifOption}** gif...\n*This may take a few seconds...*`);
            await interaction.reply({ embeds: [waitEmbed], ephemeral: false});

            const options = [
                { name: 'image', attachment: interaction.options.getAttachment('image') },
                { name: 'url', value: urlString },
                { name: 'user', value: interaction.options.getUser('user')?.id, noServerAvatar },
            ];

            const imageUrl = await resolveImage(options, interaction, isbgRemoved);


            let gifBuffer;

            switch (gifOption) {
                case "petpet":
                    gifBuffer = await petpetMaker(imageUrl, 10, delay, resolution, isRounded);
                    break;
                case "socute":
                    gifBuffer = await SoCuteMaker(imageUrl, 12, delay, resolution, isRounded);
                    break;
                default:
                    throw 'Invalid GIF option selected';
            }



            const attachment = new AttachmentBuilder(gifBuffer, { name: `output.gif` });
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setImage(`attachment://output.gif`)
                .setDescription(`Your **${gifOption}** gif \n has been generated!`)
                .setTimestamp();

            
                await  emojiUpload(interaction,embed,attachment,gifBuffer)
        } catch (err) {

            console.log(`There was an error in emoji maker: ${err}`);
            await interaction.editReply({ content: 'You must select a source format either image, url or user. Try again', ephemeral: true });

        }

    },
};
