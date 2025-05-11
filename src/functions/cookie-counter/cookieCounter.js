
const fs = require('fs');
const path = require('path');
const { ClientUser } = require('discord.js');

function cookieCounterJsonPath() {
    return path.join(__dirname, `../../../data/cookieCounter.json`);
}

function loadCookieCounterJson()
{   
    const filePath = cookieCounterJsonPath();
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveCookieCounterJson(cookies) {
    const filePath = cookieCounterJsonPath();
    fs.writeFileSync(filePath, JSON.stringify(cookies, null, 2));
}

function incrementCookieCounter(cookies, fromUserId, targetUserId, amount = 1) {
    
    if (!cookies[targetUserId]) {
        cookies[targetUserId] = {from: {}, total: 0 };
    }

    cookies[targetUserId].total += Math.abs(amount);
    cookies[targetUserId].from[fromUserId] = (cookies[targetUserId].from[fromUserId] || 0) + Math.abs(amount);
}

function getUserTotalCookies(cookies, userId) {
    return cookies[userId]?.total || 0;
}

function getUserTotalCookiesFrom(cookies, targetUserId, fromUserId) {
    return cookies[targetUserId]?.from[fromUserId] || 0;
}

function addPluralSuffix(count, word) {
    return count <= 1 ? word : `${word}s`;
}

/**
 * 
 * @param {object} cookies 
 * @param {ClientUser} fromUser
 * @param {ClientUser} targetUser 
 * @param {ClientUser} appUser 
 * @returns {String}
 */
function responseMessage(cookies, fromUser, targetUser, appUser) {

    const userTotalCookiesFromTargetUser = getUserTotalCookiesFrom(cookies, targetUser.id, fromUser.id);
    const userOverallTotalCookies = getUserTotalCookies(cookies, targetUser.id);

    let targetName = targetUser.displayName;

    if (targetUser.id === appUser.id) {
        targetName = 'me';
    }

    if (targetUser.id === fromUser.id) {
        targetName = 'yourself';
    }

    let descriptionName = `${targetUser.displayName} has`;

    if (targetUser.id === appUser.id) {
        descriptionName = "I've";
    }

    if (targetUser.id === fromUser.id) {
        descriptionName = "You've";
    }

    return [
        `You've given ${targetName} ${userTotalCookiesFromTargetUser} ${addPluralSuffix(userTotalCookiesFromTargetUser, 'cookie')}! | `,
        `${descriptionName} received ${userOverallTotalCookies} ${addPluralSuffix(userOverallTotalCookies, 'cookie')} total!`
    ].join('');
}

module.exports = {
    cookieCounterJsonPath,
    loadCookieCounterJson,
    saveCookieCounterJson,
    incrementCookieCounter,
    getUserTotalCookies,
    responseMessage,
}