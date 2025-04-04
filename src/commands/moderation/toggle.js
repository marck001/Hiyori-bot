require('dotenv').config();

const {
    ApplicationCommandOptionType,
    PermissionFlagsBits, ChannelType,
} = require('discord.js');
const { getConfig } = require('../../functions/config/getConfig')
const Config = require('../../models/Config');

const nameMap = new Map([
    ["emoji-counter", "Emoji Counter"],
    ["welcome", "Welcome Message"],
    ["emote-library", "Emote Library"],
    ["sticker-counter", "Sticker Counter"],
    ["streak-record", "Streak Records"],
    ["free-will", "Free Will"],
  ]);

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
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    devOnly: true,
    deleted: false,
    autocomplete: true,

    callback: async (client, interaction) => {

        if (!interaction.inGuild()) {
            await interaction.reply({
              content: 'This command can only be used in a server!',
              ephemeral: true,
            });
            return;
          }
          
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

        if (!interaction.inGuild()) {
            await interaction.respond([]); 
            return;
        }

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
                    name: `${config.isActive ? "🟢 • Disable" : "🔴 • Enable"} ${nameMap.get(config.channelType) ?? config.channelType}`,
                    value: config.channelType,
                }))
            );
        } catch (err) {
            console.error('Error in autocomplete:', err);
            await interaction.respond([{ name: 'Error loading config', value: 'error' }]);
        }
    }

}
