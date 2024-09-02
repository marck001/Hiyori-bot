const { Schema, model } = require('mongoose');


const counterSchema = new Schema({

    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    stickerName:{
        type: String,
        required: true,
    },
    streak: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        required: false,
    },
})

module.exports = model('Counter', counterSchema);