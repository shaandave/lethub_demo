const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const {downloadPictures, filterDuplicateListings, getCoordinatesForProperties} = require('./utilityFunctions');
const {
    pushToFacebook,
    scrapListingsFromFacebook,
    updateListings,
    loginToFacebook,
    updateAvailability,
    checkForFlags
} = require('../pupeteer/facebook/facebookScripts');
const {getUnit, updateFlaggedUnits, updateSyncedUnits} = require('./unit');
const Store = require('electron-store');
const common = require('./common');
const commonEmitter = common.commonEmitter;

//Init storage
const store = new Store();

/**
 * Logs in to facebook by opening a pupeteer window to save cookies to file
 * @returns true if login was successful, false if not
 */
async function login(){
    return new Promise (async (resolve, reject) => {
        let loggedin = await loginToFacebook();
        resolve(loggedin);
    })
}

/**
 * Logs out of facebook by deleting the cookies file
 * @returns true if logout was successful, false if not
 */

async function logout() {
    return new Promise (async (resolve, reject) => {
        try {

            const lethubFBDir = path.resolve( os.homedir(), 'lethub', 'FB');
            await fs.ensureDir(lethubFBDir);
            const cookiePath = path.resolve( lethubFBDir, 'cookies.json');
            //let filePath = path.join(__dirname, `/cookies.json`);

            //file removed
            fs.removeSync(cookiePath);
            console.log("Deleted");

            resolve(true);
        } catch(err) {
            console.error(err);
            resolve(false);
        }
    })

}

/**
 * Syncs the specified units with Facebook marketplace
 *
 * @param {Number[]} unitIdList The list of units to sync with facebook
 * @returns Promise
 */
async function listToFacebook(unitIdList) {
    return new Promise (async (resolve, reject) => {
        //starting sync
        commonEmitter.emit('syncStatus', "start");
        try {
            //Get Unit info

            //GET MORE INFO FROM UNIT INFO **TODO**
            let unitInfoList = [];
            for (const unitId of unitIdList) {
                let unitInfo = {}
                let rawUnitInfo = await getUnit(unitId);

                //console.log("RAW", rawUnitInfo);
                rawUnitInfo = rawUnitInfo.unit;

                unitInfo["unitId"] = rawUnitInfo["id"];
                unitInfo["bed"] = rawUnitInfo["bed"];
                unitInfo["bath"] = rawUnitInfo["bath"];
                unitInfo["address"] = rawUnitInfo["address"];

                //Remove HTML Tags
                rawUnitInfo["description"] = rawUnitInfo["description"] !== null ? rawUnitInfo["description"].replace(/<[^>]+>/g, '') : "";
                unitInfo["description"] = rawUnitInfo["description"] !== null ? rawUnitInfo["description"].replace(/&nbsp;/g,'\n') : "";
                unitInfo["price"] = rawUnitInfo["rent"];
                unitInfo["squareSpace"] = rawUnitInfo["sqFt"];
                unitInfo["squareUnit"] = "feet";
                unitInfo["status"] = rawUnitInfo["status"];
                switch (rawUnitInfo["type"]) {

                    case "Single-Family-House":
                        unitInfo["rentalType"] = "House";
                        break;

                    case "Multi-Family-House":
                        unitInfo["rentalType"] = "House";
                        break;

                    case "Condo":
                        unitInfo["rentalType"] = "Apartment";
                        break;

                    case "Townhouse":
                        unitInfo["rentalType"] = "Townhouse";
                        break;

                    case "Apartment":
                        unitInfo["rentalType"] = "Apartment";
                        break;

                    case "Commercial":
                        unitInfo["rentalType"] = "House";
                        break;

                    default:
                        unitInfo["rentalType"] = "House";
                        break;
                }

                console.log("unit info", unitInfo);
                unitInfoList.push(unitInfo);
            }

            commonEmitter.emit('syncStatus', "downloadPictures");

            //Download Pictures
            for (const unitInfo of unitInfoList) {

                //Download the pictures from Lethub API and save them to directory "./lethub/unitPictures/unit_{unit_id}"
                await downloadPictures(unitInfo["unitId"]);
                let fileArray = [];
                const lethubUnitPicturesDir = path.resolve( os.homedir(), 'lethub', 'unitPictures',`unit_${unitInfo["unitId"]}`);
                await fs.ensureDir(lethubUnitPicturesDir);
                fs.readdirSync(lethubUnitPicturesDir).forEach(file => {
                  fileArray.push(file);
                });

                //Sort files to be in order
                fileArray.sort(function(a, b){
                    let FileNumeberA = parseInt(a.split("_")[1]);
                    let FileNumeberB = parseInt(b.split("_")[1]);

                    return FileNumeberA - FileNumeberB;
                })

                //Add the full path to the file names
                let picturePathArray = fileArray.map(file => path.resolve( os.homedir(), 'lethub', 'unitPictures',`unit_${unitInfo["unitId"]}`,`${file}`));

                unitInfo["pictureArray"] = picturePathArray;
            }

            commonEmitter.emit('syncStatus', "scrapeFB");

            // Get coordinates for each property to be
            // used to compare distance between two properties

            let selectedProperties = await getCoordinatesForProperties(unitInfoList);
            console.log("Check 1: ",selectedProperties);

            //Scrape Listings from user's Facebook

            let scrappedListings = await scrapListingsFromFacebook();
            if(scrappedListings === null){
                throw 'Error in scrapped Listings'
            }
            scrappedListings = await getCoordinatesForProperties(scrappedListings);
            console.log("Check 2: ", scrappedListings);


            //Split into listings to push and listings to sync

            let listingsToPush = []
            let listingsToSync = selectedProperties.filter(selected => {
                for (const scrapped of scrappedListings) {
                    if(scrapped["sync"] && scrapped["unitId"] === selected["unitId"]){

                        //Add Ids
                        selected["description"] = `${selected["description"]}\n\n ###LHID###${selected["unitId"]}`
                        return true;
                    }
                }

                //Add Ids
                selected["description"] = `${selected["description"]}\n\n ###LHID###${selected["unitId"]}`
                listingsToPush.push(selected);
                return false;
            });


            commonEmitter.emit('syncStatus', "syncUnitInfo");
            //mark as rented or active

            console.log("Updating");
            let updateAvailabilityStatus = await updateAvailability(listingsToSync);

            if(!updateAvailabilityStatus){
                throw "Error in updateAvailability";
            }
            //Update listing info

            let updateListingsStatus = await updateListings(listingsToSync);
            console.log("Testing status",updateListingsStatus);
            if(!updateListingsStatus){
                console.log("In error handle");
                throw "Error in updateListings";
            }
            console.log("Update Done");

            //Remove matching listings from list

            listingsToPush = await filterDuplicateListings(listingsToPush,scrappedListings)
            console.log("Check 3: ", listingsToPush);

            let unitsWithFlags = await checkForFlags(listingsToSync);
            if(unitsWithFlags === false){
                throw "Error with check for flags"
            }
            await updateFlaggedUnits(unitsWithFlags);

            commonEmitter.emit('syncStatus', "pushToFB");
            //Push list to facebook
            if(listingsToPush.length > 0){
               let fullyPushed = await pushToFacebook(listingsToPush);
               //update synced units
               if(fullyPushed !== null){
                   let updatedUnitIds = [];
                   listingsToSync.forEach(listing => {
                        updatedUnitIds.push(listing["unitId"])
                   });
                   console.log("<--------fullyPushed-------->", fullyPushed);
                   console.log("<--------updatedUnitIds-------->", updatedUnitIds);
                   console.log("<--------TEST-------->", [...fullyPushed, ...updatedUnitIds]);
                   await updateSyncedUnits([...fullyPushed, ...updatedUnitIds]);
               } else {
                   throw "Error with pushing to Facebook"
               }
            }

            commonEmitter.emit('syncStatus', "completed");

            resolve();

        } catch (error) {
            console.log("ERRORRRRR", error);
            commonEmitter.emit('syncStatus', `error: ${error}`);
            reject();
        }

    })

}

module.exports = {listToFacebook, login, logout}

