const { devs } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const { Collection } = require('discord.js');


module.exports = async (client, interaction) => {


  //console.log('Interaction detected:', interaction.type);
  if (interaction.isAutocomplete()) {

    const localCommands = getLocalCommands();
    const commandObject = localCommands.find(cmd => cmd.name === interaction.commandName);

    if (!commandObject || typeof commandObject.autocomplete !== 'function') return;

    try {
      await commandObject.autocomplete(interaction);
    } catch (error) {
      console.error(`Error in autocomplete for command ${commandObject.name}:`, error);
      await interaction.respond([]);
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();
  const commandObject = localCommands.find(cmd => cmd.name === interaction.commandName);

  if (!commandObject) return;
  console.log(`${getCurrentDateTime()} Command executed: ${commandObject.name} by ${interaction.user.displayName}`);

  try {

    if (!commandObject.name) {
      return interaction.reply({ content: `There is no command with name \`${commandObject.name}\`!`, ephemeral: true });
    }

    if (!client.cooldowns) {
      client.cooldowns = new Collection();
    }
    const { cooldowns } = client;

    if (!cooldowns.has(interaction.commandName)) {
      cooldowns.set(interaction.commandName, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(interaction.commandName);
    const defaultCooldownDuration = 5;
    const cooldownAmount = (commandObject.cooldown ?? defaultCooldownDuration) * 1_000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1_000);
        return interaction.reply({ content: `Please wait, you are on a cooldown for \`${commandObject.name}\`. You can use it again in ${defaultCooldownDuration}s <t:${expiredTimestamp}:R>.`, ephemeral: true });
      }

    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    if (commandObject.inGuild) {
      if (!interaction.inGuild()) {
        interaction.reply({
          content: 'This command can only be used in a server!',
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: 'Only developers or mods are allowed to run this command.',
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: 'Not enough permissions, sorry.',
            ephemeral: true,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I don't have enough permissions.",
            ephemeral: true,
          });
          return;
        }
      }
    }
    /* handleCooldown(client, interaction, client.cooldowns, commandObject);*/

    await commandObject.callback(client, interaction);

  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
    interaction.reply({
      content: "Someone tell Mac, there's a problem with my system.",
    });
  }
};

function getCurrentDateTime() {
  const now = new Date();
  
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `[ ${month}-${day}-${year} - ${hours}:${minutes}:${seconds} ]`;
}