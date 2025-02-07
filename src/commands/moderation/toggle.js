require('dotenv').config();

const {
    ApplicationCommandOptionType,
    PermissionFlagsBits, ChannelType,
} = require('discord.js');
const { getConfig } = require('../../functions/config/getConfig')
const Config = require('../../models/Config');

module.exports = {

    name: 'toggle',
    description: 'Enable or disable functions',
    options: [
        {
            name: 'config',
            description: 'function to perform action',
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
            /*    choices:[
                {
                   name: 'evil-playlist',
                   value: 'evil-playlist'
               },
               {
                 name: 'neuro-playlist',
                 value: 'neuro-playlist'
             },
             {
               name: 'tutel',
               value: 'tutel'
           },
               ]*/
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    devOnly: true,
    deleted: false,
    autocomplete: true,

    callback: async (client, interaction) => {

        const channelType = interaction.options.getString('config');
        const guildId = interaction.guild.id;
        try {
            await interaction.deferReply({ ephemeral: false });


            const config = await getConfig(guildId, channelType)
            const active = !config.isActive;

            await config.update({ isActive: active });

            await interaction.editReply({ content: `**${channelType}** is now ${active ? 'enabled' : 'disabled'}.`, ephemeral: true });



        } catch (err) {
            console.error('Error :', err);
        }


    },

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const guildId = interaction.guild.id;

        try {


            const configs = await Config.findAll({ where: { guildId: guildId } });
            console.log("working")

            const filteredConfigs = configs
                .filter(config => config.channelType && config.channelType.toLowerCase().startsWith(focusedValue.toLowerCase()));


            if (!filteredConfigs.length) {
                await interaction.respond([{ name: 'No config found', value: 'none' }]);
                return;
            }

            await interaction.respond(
                filteredConfigs.map(config => ({
                    name: `${config.channelType}-${config.isActive ? 'enabled' : 'disabled'}`,
                    value: config.channelType,
                }))
            );
        } catch (err) {
            console.error('Error in autocomplete:', err);
            await interaction.respond([{ name: 'Error loading config', value: 'error' }]);
        }
    }

}
