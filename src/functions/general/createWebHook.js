const { WebhookClient } = require('discord.js');


function createWebHooK(url) {
    return webhookClient = new WebhookClient({
        url: url
    });
}

module.exports = { createWebHooK};

