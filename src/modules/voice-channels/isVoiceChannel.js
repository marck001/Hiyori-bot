

function isVoiceChannel(interaction) {

    try {

        const member = interaction.member.voice.channel;

        if (member === null) {

            interaction.reply("You need to join voice channel");
            return false;
        } else {
            return true;
        }
    } catch (err) {

        console.log(err);
    }
}

module.exports = { isVoiceChannel}