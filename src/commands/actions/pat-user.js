const {
  ApplicationCommandOptionType,
  EmbedBuilder, AttachmentBuilder

} = require('discord.js');
const { petpetMaker } = require('../../modules/actions/gifEncode');

module.exports = {
  deleted: false,
  name: 'pat-user',
  description: 'Pats an user',
  options: [
    {
      name: 'target',
      description: 'The user',
      required: true,
      type: ApplicationCommandOptionType.User,
    },

  ],
  devOnly: true,



  callback: async (client, interaction) => {

    const userId = interaction.options.get('target').value;

    try {

      await interaction.deferReply({ ephemeral: false });
      const user = await interaction.guild.members.fetch(userId).catch(err => {
        console.log(`Error fetching user: ${err}`);
        return null;
      });

      if (!user) {
        return await interaction.editReply({ content: "That user doesn't exist", ephemeral: true });

      }


      const avatarUrl = user.user.displayAvatarURL({ size: 2048, extension: 'png' });

      const gifBuffer = await petpetMaker(avatarUrl, 10, 20, 200, true);
      let content;
      if (interaction.user.id === userId) {

        content = `**${interaction.user.displayName}** pats themselves`;
      } else if (client.user.id === userId) {

        content = `Aww, thank you so much (˶˃ ᵕ ˂˶) \n\n **${interaction.user.displayName}** *pats me*`;
      } else {

        content = `**${interaction.user.displayName}** gives **${user.displayName}** some pats `;
      }

      const attachment = new AttachmentBuilder(gifBuffer, { name: `pet${user.displayName}.gif` });
      const embed = new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 16777214) + 1)
        .setDescription(content)
        .setImage(`attachment://pet${user.displayName}.gif`)
        .setTimestamp();

      await interaction.editReply({ content: null, embeds: [embed], files: [attachment] });
    } catch (err) {

      console.log(`There was an error: ${err}`);
      await interaction.editReply({
        content: `Someone tell Mac, there's a problem with my system.`,
        ephemeral: true,
      });

    }

  },
};
