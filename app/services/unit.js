const axios = require('axios');
const {scheduleHangWorkaround} = require('../tools/scheduleHangWorkaround');
const Store = require('electron-store');
const {lethubAPI} = require('./axios');
const config = require('../config/config');
const common = require('./common');
const commonEmitter = common.commonEmitter;

/**
 * Gets the unit info for the specified unit
 * 
 * @param {Number} unitId The unitId of the unit to get info for
 * @returns {Promise} The unit info object
 */
async function getUnit(unitId) {

    const params = {
        id: unitId
    }

    scheduleHangWorkaround();

    return lethubAPI.get("/public/unit/show", {params});
}

/**
 * Updates the flagged units column in DB
 * 
 * @param {Number[]} flaggedUnits The list of flagged units to update the status of
 * @returns {Promise}
 */

async function updateFlaggedUnits(flaggedUnits) {
    scheduleHangWorkaround();
    console.log("Updating flagged units...");
    const store = new Store();
    let userId = parseInt(store.get('userId'));
    return lethubAPI.put("/private/facebook/updateFlaggedUnits", {
        flaggedUnits: flaggedUnits,
        userId: userId
    });
    
}

async function updateSyncedUnits(syncedUnitsId) {
    scheduleHangWorkaround();
    console.log("Updating synced units...", syncedUnitsId);
    const store = new Store();
    let userId = parseInt(store.get('userId'));
    return lethubAPI.put("/private/facebook/updateSyncedUnits", {
        syncedUnits: syncedUnitsId,
        userId: userId
    });
}

module.exports = {getUnit, updateFlaggedUnits, updateSyncedUnits}