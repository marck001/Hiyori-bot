const {
  ApplicationCommandOptionType,
  EmbedBuilder, AttachmentBuilder
} = require('discord.js');
const {generatePetGif } = require('../../modules/actions/gifEncode');

module.exports = {
  deleted: true,
  name: 'pat-me',
  description: 'so cute emoji test',
  devOnly: true,


  callback: async (client, interaction) => {


    try {

      await interaction.deferReply();


      const avatarUrl = user.user.displayAvatarURL({ size: 2048, extension: 'png' });

      const gifBuffer = await generatePetGif(avatarUrl,200);
      let content;

      if (interaction.user.id === userId) content = `**${interaction.user.displayName}** is cute`
      else if (client.user.id === userId) content = `Aww, thank you so much (˶˃ ᵕ ˂˶) \n\n **${interaction.user.displayName}** *pats me* `;
      else content = `**${interaction.user.displayName}**thinks **${user.displayName}** is cute`;

     const attachment = new AttachmentBuilder(gifBuffer, { name: `soCute${user.username}.gif` });
          const embed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 16777214) + 1)
            .setDescription(content)
            .setImage(`attachment://pet${user.username}.gif`)
            .setTimestamp();

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
