const {
    ApplicationCommandOptionType,
    EmbedBuilder, PermissionFlagsBits
} = require('discord.js');


const { setChannel } = require('../../functions/config/setChannel')

module.exports = {
    name: 'set-channel',
    description: 'Saves files url',
    options: [
       
        {
            name: 'channel-type',
            description: 'give it a name',
            required: false,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'sticker-counter',
                    value: 'sticker-counter'
                },
                {
                    name: 'emoji-counter',
                    value: 'emoji-counter'
                }, {
                    name: 'streak-record',
                    value: 'streak-record'
                },{
                    name:'welcome',
                    value:'welcome'
                },{
                    name:'emote-library',
                    value:'emote-library'
                }
                ,{
                    name:'free-will',
                    value:'free-will'
                }
            ]
        },
        {
            name: 'channel',
            description: 'The channel',
            required: false,
            type: ApplicationCommandOptionType.Channel,
        },
        {
            name: 'active',
            description: 'Activate it or not',
            required: false,
            type: ApplicationCommandOptionType.Boolean     
        },
    ],
    deleted: false,
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    devOnly: true,


    callback: async (client, interaction) => {

        //if (!hasRole(interaction)) return;
        const channelObj = interaction.options.getChannel('channel');
        const channel= channelObj || interaction.channel;
        const channelType= interaction.options.getString('channel-type');
        const isActive = interaction.options.getBoolean('active')?.true;

        if (!channelType) return interaction.reply({ content:"Channel type not selected",ephemeral:true})


        await interaction.deferReply({ ephemeral: false });

      
        try {

            const guildId = interaction.guild.id

            await setChannel(interaction,guildId, channel.id,channelType,isActive)


        } catch (error) {
            console.error('Error channel:', error);
            interaction.editReply({ content: 'An error occurred while saving channel.', ephemeral: true });
        }
    },
};
