const {
    ApplicationCommandOptionType,
    EmbedBuilder
  } = require('discord.js');
const fs = require('fs');
const path = require('path');


  module.exports = {
    deleted: true,
    name: 'goodnight',
    description: 'Wish a good night to someone',
    options: [
      {
        name: 'target',
        description: 'ping a user',
        required: true,
        type: ApplicationCommandOptionType.User,
      },

    ],
    devOnly: true,

  
  
    callback: async (client, interaction) => {
  
      const userId = interaction.options.get('target').value;
      const channel = interaction.channel;
  
      try {
    
        const user = await interaction.guild.members.fetch(userId).catch(err => {
          console.log(`Error fetching user: ${err}`);
          return null;
      });

      if (!user) {
        return await interaction.reply({ content: "That user doesn't exist in this server :(", ephemeral: true });
      
      }
     

      if (!interaction.guild) {
        return interaction.reply({
            content: 'This command can only be used with guild context.',
            ephemeral: true
        });
    }


    await interaction.deferReply();
       

        //this is temporary
        const gifsFilePath = path.join(__dirname, '../../../data/gifs.json');
        const gifsData = JSON.parse(fs.readFileSync(gifsFilePath, 'utf8'));
  
        const gifsArray = gifsData.sleep;
  

        let randIndex = Math.floor(Math.random() *  gifsArray.length);
      
        const embed = new EmbedBuilder()
          .setColor(Math.floor(Math.random() * 16777214) + 1)
          .setDescription(`eepy! **${interaction.user}** wishes ${user} a good night <a:goodnight:1291232658000580629> \n Have a good night! <:hiyoriHeart:1278430776563601523>`)
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
  