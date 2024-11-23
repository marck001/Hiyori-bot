const { allowedRoles } = require('../../../config.json');


function hasRole(interaction) {

    const checkRole = interaction.member.roles.cache.some(role => allowedRoles.includes(role.id));

    if(!checkRole) {
        interaction.reply("You need special role for using this command.");
        return false
    }else{
        return true
    }

}


module.exports = { hasRole }