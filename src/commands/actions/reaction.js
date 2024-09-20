const {
  ApplicationCommandOptionType,
  ChannelType,   PermissionFlagsBits
} = require('discord.js');

module.exports = {

  name: 'react-message',
  description: 'reacts to messages in discord server',
  options: [
    {
      name: 'emoji',
      description: 'The emoji to react',
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: 'message',
      description: 'message id',
      required: false,
      type: ApplicationCommandOptionType.String,

    }

  ],
  devOnly: true,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    const emoji = interaction.options.getString('emoji');
    const messageId = interaction.options.getString('message');
    const channel = interaction.channel;

    const emojiRegex = /<a?:\w+:\d+>/g;
    const isCustomEmoji = emojiRegex.test(emoji);

    let message;

    try{

      if (messageId) {
        message = await channel.messages.fetch(messageId);
      } else {
        const messages = await channel.messages.fetch({ limit: 1 });
        message = messages.first();
      }

      if (!message) {
        return interaction.reply({
          content: 'Could not find the message to react to!',
          ephemeral: true,
        });
      }

      if (isCustomEmoji) {
        const emojiId = emoji.match(/:\d+/)[0].slice(1);
        if (!interaction.guild.emojis.cache.get(emojiId)) {
          return interaction.reply({
            content: 'That emoji is not from this Discord server, sorry!',
            ephemeral: true,
          });
        }

        await message.react(emoji);

        interaction.reply({
          content: 'Reaction added successfully!',
          ephemeral: true,
        });0
      }else{
        return interaction.reply({
          content: 'You can only react with emojis',
          ephemeral: true,
        });
      }

    


    }catch(err){

      interaction.reply({
        content: `Someone tell Mac, there's a problem with my system.`,
        ephemeral: true,
      });

      console.log("There was an error in reaction ",err)
    }

   
  },
};
