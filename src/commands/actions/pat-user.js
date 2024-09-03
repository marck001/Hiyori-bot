const {
    ApplicationCommandOptionType,
    EmbedBuilder
  } = require('discord.js');
const fs = require('fs');
const path = require('path');

  module.exports = {
    deleted: false,
    name: 'pat-user',
    description: 'Pats an user from this server',
    options: [
      {
        name: 'target',
        description: 'The user to pat',
        required: true,
        type: ApplicationCommandOptionType.Mentionable,
      },

    ],
  
  
    callback: async (client, interaction) => {
  
      const userId = interaction.options.get('target').value;
      const channel = interaction.channel;
      const user = await interaction.guild.members.fetch(userId);
  
      if (!user) {
        await interaction.reply({ content: "That user doesn't exist in this server :(", ephemeral: true });
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
  
        const gifsArray = gifsData.patGifs;
  

        let randIndex = Math.floor(Math.random() *  gifsArray.length);
      
        const embed = new EmbedBuilder()
          .setColor(Math.floor(Math.random() * 16777214) + 1)
          .setDescription(`**${interaction.user}** gives ${user} some pats`)
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
  