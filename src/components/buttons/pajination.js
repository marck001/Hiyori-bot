const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')



module.exports = async (interaction, pages, initPage=0, time = 60 * 1000) => {


    try {


        if (!interaction || !pages || pages.length === 0) throw new Error('[PAGINATION] Invalid args')

      
        if (pages.lenght === 1) {
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
            .addComponents([previousBtn, pageCount,nextBtn]);


        const msg = await interaction.editReply({ embeds: [pages[index]], components: [buttons], fetchReply: true })



        const collector = await msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time,
        });


        collector.on('collect', async i => {
            /*if (i.user.id !== interaction.user.id) return
            await i.reply({ content: `${interaction.user.username} cannot use them!`, ephemeral: true });*/

            await i.deferUpdate();

            switch (i.customId) {
                case 'previous':
                  if (index > 0) index--;
                  break;
                case 'next':
                  if (index < pages.length - 1) index++;
                  break;
              }
        
              pageCount.setLabel(`${index + 1}/${pages.length}`);
              previousBtn.setDisabled(index === 0);
              nextBtn.setDisabled(index === pages.length - 1);

            await msg.edit({ embeds: [pages[index]], components: [buttons] }).catch(err => { console.error(err)})

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