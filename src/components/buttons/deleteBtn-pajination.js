const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')
const Blob = require('../../models/Blob');

module.exports = async (interaction, pages, components, initPage=0, time = 60 * 1000) => {


    try {
        
        if (!interaction || !pages || pages.length === 0) throw new Error('[PAGINATION] Invalid args')

            await interaction.deferReply();

      
        if (pages.length === 1) {
            return await interaction.editReply({ embeds: pages, components: [], fetchReply: true })
        }

        let index = initPage;

        const previousBtn = new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('⬅️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(index === 0);

        const pageCount = new ButtonBuilder()
            .setCustomId('pagecount')
            .setLabel(`${index + 1}/${pages.length}`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const nextBtn = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('➡️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(index === pages.length - 1);

        const buttons = new ActionRowBuilder()
            .addComponents(previousBtn, pageCount,nextBtn);



      
        


        const msg = await interaction.editReply({ embeds: [pages[index]], components: [buttons,components[index]], fetchReply: true })



        const collector = await msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time,
        });


        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return await i.reply({ content: `${interaction.user.username} cannot use them!`, ephemeral: true });

            await i.deferUpdate();

            switch (i.customId) {
                case 'previous':
                  if (index > 0) index--;
                  break;
                case 'next':
                  if (index < pages.length - 1) index++;
                  break;

              }

              if(i.customId.startsWith('remove_')){
                const parts = i.customId.split('_');
                const blobId = parts[1]; 
                const string = parts[2];


                const cancelBtn = new ButtonBuilder()
                .setCustomId(`remove_${blobId}_cancel`)
                .setLabel('cancel')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);
    
            const confirmBtn = new ButtonBuilder()
                .setCustomId(`remove_${blobId}_confirm`)
                .setLabel('confirm')
                .setStyle(ButtonStyle.Success)
                .setDisabled(false);
    
            const helperButtons = new ActionRowBuilder()
                .addComponents(cancelBtn, confirmBtn);

                console.log(string)
                if (!blobId) {
                    console.error("Invalid blob ID");
                    return;
                }

                console.log(blobId)

                console.log("p ",i.customId)
                if (string === `confirm`) {
                    await Blob.destroy({ where: { id: blobId } });
                    await interaction.editReply({
                        content: `**File with ID (${blobId}) removed successfully!**`,
                        components: [],
                        ephemeral: true
                    });
                    collector.stop();
                    return;
                } else if (string === `cancel`) {
                    await interaction.editReply({
                        content: `**Cancelled**`,
                        components: [],
                        ephemeral: true
                    });
                    collector.stop();
                    return;
                } else {
                    await i.followUp({
                        content: `**Are you sure you want to delete the URL source with ID ${blobId}?**`,
                        components: [helperButtons],
                        ephemeral: true
                    });
                }

                 // await i.deferUpdate();

               
              }
        
              pageCount.setLabel(`${index + 1}/${pages.length}`);
              previousBtn.setDisabled(index === 0);
              nextBtn.setDisabled(index === pages.length - 1);

            await msg.edit({ embeds: [pages[index]], components: [buttons,components[index]] }).catch(err => { console.error(err)})

            collector.resetTimer();

        });

        collector.on("end", async () => {
            await msg.edit({ embeds: [pages[index]], components: [] }).catch(err => { console.error(err)})
        })

        return msg;


    } catch (err) {

        console.log(' Component error', err)
    }
}

