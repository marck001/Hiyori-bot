const {
  ChatInputCommandInteraction,
  Client,
  ApplicationCommandOptionType,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");

const { eatingCookieMaker } = require("../../modules/actions/gifEncode");

const cookieCounter = require("../../functions/cookie-counter/cookieCounter");

module.exports = {
  deleted: false,
  name: "cookie",
  description: "Give a cookie",
  options: [
    {
      name: "user",
      description: "The user you want to give a cookie (defaut: me)",
      required: false,
      type: ApplicationCommandOptionType.User,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  callback: async (client, interaction) => {
    const targetUser = interaction.options.getUser("user") || client.user;

    const cookies = cookieCounter.loadCookieCounterJson();
    cookieCounter.incrementCookieCounter(
      cookies,
      interaction.user.id,
      targetUser.id
    );

    cookieCounter.saveCookieCounterJson(cookies);

    const cookieResponse = cookieCounter.responseMessage(
      cookies,
      interaction.user,
      targetUser,
      client.user
    );

    const prepareSuprise = Math.floor(Math.random() * 10) < 5 || true;
    
    await interaction.reply({ content: cookieResponse, ephemeral: false });

    if (prepareSuprise === false) return;

    const avatarUrl = targetUser.displayAvatarURL({
      size: 2048,
      extension: "png",
    });

    const gifBuffer = await eatingCookieMaker(avatarUrl, 40, 10, 100, true);

    const attachment = new AttachmentBuilder(gifBuffer, {
      name: `cookies.gif`,
    });

    await interaction.followUp({
      content: '**SURPRISE INCOMING!**',
      files: [attachment],
      embeds: [],
    });

  },
};
