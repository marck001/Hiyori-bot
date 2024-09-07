

module.exports = async () => {


    const previousBtn = new ButtonBuilder()
        .setCustomId('previous')
        .setLabel(':x: ')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(index === 0);


        

        collector.on('collect', async i => {

            if(i.customId === 'previous'){

                const blob = await Blob.destroy({ where: { name: tagName } });
            }
  


        })


        return previousBtn
}

