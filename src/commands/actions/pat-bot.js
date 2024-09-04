const {
    ApplicationCommandOptionType,
    EmbedBuilder
  } = require('discord.js');
  const fs = require('fs');
const path = require('path');

  module.exports = {
    deleted: false,
    name: 'pat-me',
    description: 'Pats enjoyed bot',
  
  
    callback: async (client, interaction) => {
  
      const channel = interaction.channel;
    
  
      if (!channel) {
        await interaction.reply({ content: "You are not in a channel :(", ephemeral: true });
        return;
      }
  
      if (!interaction.guild) {
        return interaction.reply({
            content: 'This command can only be used with guild context.',
            ephemeral: true
        });
    }
  
      try {

        await interaction.deferReply();

        //this is temporary
        const gifsFilePath = path.join(__dirname, '../../../data/gifs.json');
        const gifsData = JSON.parse(fs.readFileSync(gifsFilePath, 'utf8'));
  
        const gifsArray = gifsData.hiyori;
  

        let randIndex = Math.floor(Math.random() *  gifsArray.length);
      
        const embed = new EmbedBuilder()
          .setColor(Math.floor(Math.random() * 16777214) + 1)
          .setDescription(`Aww, thank you so much :3 \n\n **${interaction.user}** *pats me* `)
          .setImage(gifsArray[randIndex])
          .setTimestamp()
  
          await interaction.editReply({ content: null, embeds: [embed] });
      } catch (err) {
  
        console.log(`There was an error: ${err}`);
        await interaction.editReply({
          content: `Someone tell Mac, there's a problem with my system.`,
          ephemeral: true,
        });
  
      }
  
    },
  };
  