const { allowedRoles } = require('../../../config.json');
const {
       PermissionsBitField
  } = require('discord.js');

function hasRole(interaction) {

    const checkRole = interaction.member.roles.cache.some(role => allowedRoles.includes(role.id));

    if(!checkRole && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        interaction.reply({content:"You need special role or being admin for using this command.", ephemeral:true});
        return false
    }else{
        return true
    }

}


module.exports = { hasRole }