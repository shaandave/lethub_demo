const axios = require('axios').default;
const {scheduleHangWorkaround} = require('../tools/scheduleHangWorkaround');
const Store = require('electron-store');
const {lethubAPI} = require('./axios');


/**
 * Gets the sync info for a specified user
 * 
 * @param {Number} userId The user id of the user to get the sync info for
 * @returns {Object} The sync info for the user
 */
async function getSyncInfo(userId) {
    scheduleHangWorkaround();

    const params = {
        id: userId
    }
    
    return lethubAPI.get("/private/facebook/getSyncSettingsByUserId", {params});
}

/**
 * Gets the sync status of the currently logged in user
 * 
 * @returns {Boolean} The sync status of the user
 */
async function getSyncStatus() {
    try {
        const store = new Store();
        let userId = store.get('userId');
        let syncInfo = await getSyncInfo(userId);
        return syncInfo.sync !== null ? syncInfo.sync : false;
    } catch (error) {
        console.log(error);
        return false;
    }
    
}

module.exports = {getSyncInfo, getSyncStatus}