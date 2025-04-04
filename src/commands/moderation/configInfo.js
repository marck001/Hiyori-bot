const { EmbedBuilder } = require('discord.js');
const Config = require('../../models/Config');
module.exports = {
    name: `config-info`,
    description: 'Information about configuration status',
    devOnly: true,
    inGuild:true,
  
    callback: async (client, interaction) => {
      await interaction.deferReply({ ephemeral: true });

      const configs = await Config.findAll(  {where:{guildId:interaction.guild.id}})

      if(!configs) return interaction.editReply({content:'No configuration set yet',ephemeral:true});
      const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('----- Channels settings -----')
      .setDescription(`*Your server configuration of channels*`)
      .setTimestamp()
      .setFooter({ text: 'config', iconURL: 'https://static.wikia.nocookie.net/projectsekai/images/f/f6/Hatsune_Miku_-_25-ji%2C_Nightcord_de._April_Fools_Chibi.png/revision/latest?cb=20230922025244' });
      configs.forEach((config, i) => { 
        const index =  i + 1;
        const active = config.isActive ? '🟢 Enabled' : '🔴 Disabled';
        embed.addFields({
          name: `${index}. ***Config:*** ${config.channelType}`,
          inline: false,
          value: `\n**Channel: ** <#${config.channelId}>\n ** State: ** ${active} `,
        });
      });
     
  
      interaction.editReply({embeds: [embed],ephemeral:true});
    },
  };
  