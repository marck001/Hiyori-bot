const {

    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    PermissionFlagsBits
} = require('discord.js');
const messaEmbed = require('../embeds/messageEmbed')
module.exports = async (interaction, embed, attachment, gifBuffer, time = 100 * 1000) => {


    try {

        const isInGuild = interaction.inGuild();

        const hasEmojiPerms = isInGuild &&
            interaction.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions);

        const actionRow = new ActionRowBuilder();

        if (hasEmojiPerms) {
            actionRow.addComponents(
                new ButtonBuilder()
                    .setCustomId('upload_emoji')
                    .setLabel('Upload as Emoji')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('⬆️')
            );
        }

        const reply = await interaction.editReply({
            content: null,
            embeds: [embed],
            files: [attachment],
            components: hasEmojiPerms ? [actionRow] : []
        }).catch(error => {
            if (error.code === 10008) {
                console.log('Message was deleted before could be edited');
                return null;
            }
            throw error;
        });

        if (!reply) return;

        if (hasEmojiPerms) {
            const collector = reply.createMessageComponentCollector({
                filter: async (i) => {
                    if (i.user.id !== interaction.user.id) {
                        await i.reply({
                            content: "You cannot interact with this button.",
                            ephemeral: true,
                        });
                        return false;
                    }
                    return true;
                },
                time: time
            });

            collector.on('collect', async i => {
                try {
                    const modal = new ModalBuilder()
                        .setCustomId('emoji_upload_modal')
                        .setTitle('Upload Emoji');

                    const emojiNameInput = new TextInputBuilder()
                        .setCustomId('emoji_name')
                        .setLabel('Emoji Name (letters, numbers, _ only)')
                        .setStyle(TextInputStyle.Short)
                        .setMinLength(2)
                        .setMaxLength(32)
                        .setRequired(true);

                    const firstActionRow = new ActionRowBuilder().addComponents(emojiNameInput);
                    modal.addComponents(firstActionRow);

                    await i.showModal(modal).catch(error => {
                        if (error.code === 10008) {
                            console.log('Message was deleted before showing modal');
                            return;
                        }
                        throw error;
                    });

                    const modalInteraction = await i.awaitModalSubmit({
                        time: time,
                        filter: m => m.user.id === i.user.id,
                    }).catch(() => null);

                    if (!modalInteraction) return;

                    const emojiName = modalInteraction.fields.getTextInputValue('emoji_name');

                    if (!/^[a-zA-Z0-9_]+$/.test(emojiName)) {
                        return modalInteraction.reply({
                            content: 'Invalid emoji name! Only letters, numbers, and underscores are allowed.',
                            ephemeral: true
                        });
                    }

                    try {
                        const createdEmoji = await interaction.guild.emojis.create({
                            attachment: gifBuffer,
                            name: emojiName
                        });

                        await modalInteraction.reply({
                            content: `Successfully created emoji: ${createdEmoji}`,
                            ephemeral: true
                        });
                    } catch (emojiError) {
                        console.error('Error creating emoji:', emojiError);
                        await modalInteraction.reply({
                            content: 'Failed to create emoji. The file might be too large or the server has reached its emoji limit.',
                            ephemeral: true
                        });
                    }
                } catch (error) {
                    if (error.code === 10008) return;
                    console.error('Error in button interaction:', error);
                    if (!i.replied && !i.deferred) {
                        await i.reply({
                            content: 'An error occurred while processing your request.',
                            ephemeral: true
                        }).catch(console.error);
                    }
                }
            });

            collector.on('end', (collected, reason) => {
                try {
                    if (!reply.editable) return;

                    interaction.editReply({
                        components: []
                    }).catch(console.error);
                    const messageEmbed = messaEmbed('The emoji upload button has expired.');

                    if (reason === 'time') {
                        interaction.followUp({
                            content: null,
                            embeds: [messageEmbed],
                            ephemeral: true
                        }).catch(console.error);
                    }
                } catch (error) {
                    if (error.code === 10008) return;
                    console.error('Error ending collector:', error);
                }
            });
        }
    } catch (error) {
        if (error.code === 10008) return; 
        console.error('Error in emoji component:', error);

    }


}