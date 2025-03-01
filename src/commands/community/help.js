const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays all the available commands',
    devOnly: true,
  
    callback: async (client, interaction) => {
      await interaction.deferReply();

      const commands = await client.application.commands.fetch();

        const commandsList = commands.map(cmd => {
            return `</${cmd.name}:${cmd.id}> - ${cmd.description}`;
        }).join('\n');

      const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Commands List ')
      .setThumbnail('https://i.postimg.cc/gc7pGcF1/hiyori.png')
      .setDescription(commandsList)
      .setTimestamp()
      .setFooter({ text: 'Click a command to use it!', iconURL: 'https://static.wikia.nocookie.net/projectsekai/images/f/f6/Hatsune_Miku_-_25-ji%2C_Nightcord_de._April_Fools_Chibi.png/revision/latest?cb=20230922025244' });
  
      interaction.editReply({embeds: [embed]});
    },
  };
  