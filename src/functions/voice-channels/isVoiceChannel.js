

function isVoiceChannel(interaction) {

    try {

        const member = interaction.member.voice.channel;

        if (member === null) {

            interaction.reply({content:"You must be in a voice channel",ephemeral:true});
            return false;
        } else {
            return true;
        }
    } catch (err) {

        console.log(err);
    }
}

module.exports = { isVoiceChannel}