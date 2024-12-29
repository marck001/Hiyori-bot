require('dotenv').config();

const {
    ApplicationCommandOptionType,
    PermissionFlagsBits, ChannelType,
} = require('discord.js');

module.exports = {

    name: 'toggle',
    description: 'mysterious command',
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    devOnly: true,
    deleted: true,

    callback: async (client, interaction) => {

        try {
  
            interaction.client.deleteMessages = !interaction.client.deleteMessages;

          await  interaction.reply({ content: `Message deletion is now ${interaction.client.deleteMessages ? 'enabled' : 'disabled'}.`, ephemeral: true });


            const targetUser = await client.users.fetch(process.env.BOT_XD);


        if( interaction.client.deleteMessages){

            targetUser.send(`I'm in control over you now <a:hiyori:1278430751419011213>`);
        }
       
       
      


        }catch(err){
            console.error('Error :', err);
           // interaction.reply('Error while toggling XD.');
        }


    },
};
