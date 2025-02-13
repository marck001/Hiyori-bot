const {
    ApplicationCommandOptionType,
    EmbedBuilder,   PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder
  } = require('discord.js');
  
  const Blob = require('../../models/Blob'); 
  const { hasRole} = require('../../functions/general/hasRole')

  const  pagination = require('../../components/buttons/deleteBtn-pajination')
  module.exports = {
    name: 'check-saved-files',
    description: 'Displays a list of all stored files',
    options: [
      {
        name: 'page',
        description: 'The selected page',
        required: false,
        type: ApplicationCommandOptionType.Number,
      },
      {
        name: 'user',
        description: 'Check images uploaded by a user',
        required: false,
        type: ApplicationCommandOptionType.User,
      },
    ],
    deleted: false,
    devOnly: false,
  
    callback: async (client, interaction) => {
     
      if(!hasRole(interaction)) return;
      
      await interaction.deferReply({ ephemeral: false });

      const page = interaction.options.getNumber('page') || 1;
      const user = interaction.options.get("user")?.value;
  
      try {

        const blobs = await Blob.findAll({
          where: user
            ? { guildId: interaction.guild.id, userId: user }
            : { guildId: interaction.guild.id },
          order: [["id", "DESC"]],
        });
  
       
        if (blobs.length === 0) {
          return interaction.editReply(`It appears that there's nothing stored.`);
        }
     
        const embeds = blobs.map((blob, index) => {
          return new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 16777214) + 1)
            .setTitle(`-------- List of saved files --------`)
            .setAuthor({ name: `Page ${index + 1}` })
            .addFields(
              { name: "File name:", value: blob.name, inline: true },
              {
                name: "Created at: ",
                value: blob.createdAt.toISOString().split("T")[0],
                inline: true,
              },
              {
                name: "Uploaded by: ",
                value: `<@${blob.userId}>`,
                inline: false,
              },
              { name: "Id: ", value: `${blob.id}`, inline: true }
            )
            .setImage(blob.url)
            .setTimestamp()
            .setFooter({
              text: "Preview",
              iconURL:
                "https://static.wikia.nocookie.net/projectsekai/images/f/f6/Hatsune_Miku_-_25-ji%2C_Nightcord_de._April_Fools_Chibi.png/revision/latest?cb=20230922025244",
            });
        });
  
        const components = blobs.map((blob) => {
          const removeButton = new ButtonBuilder()
            .setCustomId(`remove_${blob.id}`)
            .setLabel("Remove")
            .setStyle(ButtonStyle.Danger);
  
          return new ActionRowBuilder().addComponents(removeButton);
        });
      

      const currentPage = page > embeds.length ? embeds.length : page;


        await pagination(interaction,embeds,components, currentPage - 1)
  
  
      } catch (error) {
        console.error(' Error fetching streaks:', error);
        interaction.editReply('An error occurred while fetching streaks.');
      }
    },
  };
  