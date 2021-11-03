const cron = require('node-cron');
const {listToFacebook} = require('../services/facebook');
const {getSyncInfo} = require('../services/sync');
const {sleep} = require('../services/utilityFunctions');
const Store = require('electron-store');

// Import events module
const common = require('../services/common');
const commonEmitter = common.commonEmitter;

// Schedule tasks to be run on the server.
async function createSyncToFBCronJob() {

    try {
        //Get SYNC schedule from DB
        const store = new Store();
        let userId = store.get('userId');
        let syncInfo = await getSyncInfo(userId);
        
        /*List of possible inputs:
            1week,
            1day,
            12h
        */
        let now = new Date();

        let weekday = new Array(7);
        weekday[0] = "SUN";
        weekday[1] = "MON";
        weekday[2] = "TUE";
        weekday[3] = "WED";
        weekday[4] = "THU";
        weekday[5] = "FRI";
        weekday[6] = "SAT";

        let cronSchedule;
        
        let interval = syncInfo.syncInterval !== null ? syncInfo.syncInterval : "";

        // switch (interval) {

        //     case "12h":
        //         let hourPlus12 = hour + 12;
        //         if(hourPlus12 > 23){
        //             hourPlus12 = hour - 12;
        //         }

        //         cronSchedule = `00 ${hour},${hourPlus12} * * *`;
        //         break;

        //     case "1day":
        //         cronSchedule = `0 ${hour} * * *`;
        //         break;

        //     case "1week":
        //         cronSchedule = `0 ${hour} * * ${day}`;
        //         break;

        //     default:
        //         cronSchedule = `0 0 * * ${day}`;
        //         break;
        // }

        switch (interval) {

            case "12h":
                cronSchedule = `0 0,12 * * *`;
                break;

            case "1day":
                cronSchedule = `0 12 * * *`;
                break;

            case "1week":
                cronSchedule = `0 12 * * WED`;
                break;

            default:
                cronSchedule = `0 0 * * WED`;
                break;
        }
        
        console.log(`Got Schedule of ${cronSchedule} with units ${syncInfo.syncedUnits} to sync`);

        let syncToFB = cron.schedule(cronSchedule, async function() {
            console.log(`running a task with the cron schedule of ${cronSchedule} with units of ${syncInfo.syncedUnits}`);
            commonEmitter.emit('syncCronJob', "syncStart");
            let units = syncInfo.syncedUnits !== null ? syncInfo.syncedUnits : [];
            
            await listToFacebook(units);
            //simulate sync
            // console.log('simulating cron sync...');
            // await sleep(15000);
            // console.log('simulating cron sync done');

            commonEmitter.emit('syncCronJob', "syncEnd");

        }, {
            scheduled: false
        });

        return syncToFB
    } catch (error) {
        console.log("Error in createSyncToFBCronJob()", error);
        return null;
    }
    
}


module.exports = {createSyncToFBCronJob}