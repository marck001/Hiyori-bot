const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')
const Blob = require('../../models/Blob');
const { adminId } = require('../../../config.json');
module.exports = async (interaction, pages, components, initPage = 0, time = 60 * 1000) => {


    if (!interaction || !pages || pages.length === 0)
        throw new Error("[PAGINATION] Invalid arguments");

    const ADMIN_ROLE_ID = adminId; 

    let index = initPage;

    const createNavigationButtons = (index) => {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("previous")
                .setLabel("⬅️")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(index === 0),
            new ButtonBuilder()
                .setCustomId("pagecount")
                .setLabel(`${index + 1}/${pages.length}`)
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId("next")
                .setLabel("➡️")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(index === pages.length - 1)
        );
    };

    const buttons = createNavigationButtons(index);

    const msg = await interaction.editReply({
        embeds: [pages[index]],
        components: [buttons, components[index]],
        fetchReply: true,
    });

    const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time,
    });

    collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) {
            return i.reply({
                content: "You cannot interact with these buttons.",
                ephemeral: true,
            });
        }

        await i.deferUpdate();

        if (i.customId === "previous" && index > 0) index--;
        if (i.customId === "next" && index < pages.length - 1) index++;

        if (i.customId.startsWith("remove_")) {
            const blobId = i.customId.split("_")[1];
            const blob = await Blob.findOne({ where: { id: blobId } });

            if (!blob) {
                return await interaction.editReply({
                    content: `File with **ID ${blobId}** does not exist.`,
                    components: [],
                });
            }

            const isOwner = blob.userId === i.user.id;
            const isAdmin = interaction.member.roles.cache.has(ADMIN_ROLE_ID);

            if (!isOwner && !isAdmin) {
                return await i.followUp({
                    content: "You do not have permission to delete this file. If you're a member you can only delete your own files :)",
                    ephemeral: true,
                });
            }

            const confirmButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`confirm_remove_${blobId}`)
                    .setLabel("Confirm")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`cancel_remove_${blobId}`)
                    .setLabel("Cancel")
                    .setStyle(ButtonStyle.Secondary)
            );

            return await interaction.editReply({
                content: `Are you sure you want to delete the file with **ID ${blobId}**?`,
                components: [confirmButtons],
            });
        }

        if (i.customId.startsWith("confirm_remove_")) {
            const blobId = i.customId.split("_")[2];
            const blob = await Blob.findOne({ where: { id: blobId } });

            if (!blob) {
                return await interaction.editReply({
                    content: `File with **ID ${blobId}** does not exist.`,
                    components: [],
                });
            }

            const isOwner = blob.userId === i.user.id;
            const isAdmin = interaction.member.roles.cache.has(ADMIN_ROLE_ID);

            if (!isOwner && !isAdmin) {
                return await i.followUp({
                    content: "You do not have permission to delete this file. If you're a member you can only delete your own files :)",
                    ephemeral: true,
                });
            }

            await Blob.destroy({ where: { id: blobId } });

            pages.splice(index, 1);
            components.splice(index, 1);

            if (pages.length === 0) {
                return interaction.editReply({
                    content: `All files have been removed.`,
                    embeds: [],
                    components: [],
                });
            }

            if (index >= pages.length) index = pages.length - 1;

            return interaction.editReply({
                content: `File with **ID ${blobId}** has been deleted successfully.`,
                embeds: [pages[index]],
                components: [createNavigationButtons(index), components[index]],
            });
        }

        if (i.customId.startsWith("cancel_remove_")) {
            return interaction.editReply({
                content: `**Deletion canceled.**`,
                embeds: [pages[index]],
                components: [createNavigationButtons(index), components[index]],
            });
        }

        const newButtons = createNavigationButtons(index);
        await msg.edit({
            embeds: [pages[index]],
            components: [newButtons, components[index]],
        });
        collector.resetTimer();
    });

    collector.on("end", async () => {
        try {
            await msg.edit({ components: [] }).catch(() => { });
        } catch (error) {
            console.error("Error clearing components:", error);
        }
    });
}

