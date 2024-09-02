const {
  ApplicationCommandOptionType,
  EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder
} = require('discord.js');

const Counter = require('../../schema/Counter');
const { chunkArray } = require('../../modules/streak/splitArray');

module.exports = {

  name: 'streak-stats',
  description: 'Displays a list of all streaks',
  options: [
    {
      name: 'page',
      description: `The selected page`,
      required: false,
      type: ApplicationCommandOptionType.Number,
    },

  ],
  deleted:false,

  callback: async (client, interaction) => {
    await interaction.deferReply();
    const page = interaction.options.getNumber('page')  || 1;;


    const counters = await Counter.find({ guildId: interaction.guild.id });

    if (counters.length === 0) {
      return interaction.editReply('No streak records found.');
    }

    const chunkedCounters = chunkArray(counters, 10);
    const currentChunk = chunkedCounters[page - 1] || [];


    for (let i = 0; i < chunkedCounters.length; i++) {

      const embed = new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 16777214) + 1)
        .setTitle(`----- List of commands--Page ${page}-----`)
        .setAuthor({ name: interaction.user.username })
        .setTimestamp()
        .setFooter({ text: 'Streaks', iconURL: 'https://static.wikia.nocookie.net/projectsekai/images/f/f6/Hatsune_Miku_-_25-ji%2C_Nightcord_de._April_Fools_Chibi.png/revision/latest?cb=20230922025244' });

        currentChunk.forEach((counter,index) => {
        embed.addFields({
          name: `${index+1}.`,
          value: `Streak: ${counter.streak} broken by  <@${counter.userId}>`,
          inline: true
        });
      });


    }
    const nextBtn = new ButtonBuilder()
      .setCustomId('next')
      .setLabel('Next')
      .setStyle(ButtonStyle.Danger);

    const previousBtn = new ButtonBuilder()
      .setCustomId('previous')
      .setLabel('Previous')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
      .addComponents(previousBtn, nextBtn);

    interaction.editReply({
      embeds: [embed],
      components: [row],


    });

  },
};