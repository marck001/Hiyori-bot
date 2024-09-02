const {
  ApplicationCommandOptionType,
  EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder
} = require('discord.js');

const Counter = require('../../schema/Counter');
const { chunkArray } = require('../../modules/streak/splitArray');

module.exports = {

  name: 'streak-test',
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
    const page = interaction.options.getNumber('page');


    await interaction.deferReply();


    const counters = await Counter.find({ guildId: message.guild.id });

    if (counters.length === 0) {
      return interaction.reply('No streak records found.');
    }

    const chunkedCounters = chunkArray(counters, 10);


    for (let i = 0; i < chunkedCounters.length; i++) {

      const embed = new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 16777214) + 1)
        .setTitle(`----- List of commands -----`)
        .setAuthor({ name: interaction.author.name })
        .setTimestamp()
        .setFooter({ text: 'Streaks', iconURL: 'https://static.wikia.nocookie.net/projectsekai/images/f/f6/Hatsune_Miku_-_25-ji%2C_Nightcord_de._April_Fools_Chibi.png/revision/latest?cb=20230922025244' });

      chunkedCounters[i].forEach(counter => {
        embed.addFields({
          name: `${i+1}.`,
          value: `Streak: ${counter.streak} broken by ${counter.userId}`,
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

    interaction.reply({
      embeds: [embed],
      components: [row],


    });

  },
};