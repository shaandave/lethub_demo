const axios = require('axios').default;
const fetch = require('node-fetch');
const fs = require('fs-extra');
const os = require( 'os' );
const path = require('path');
const Store = require('electron-store');
const {scheduleHangWorkaround} = require('../tools/scheduleHangWorkaround');
const config = require('../config/config');
// Import events module
const common = require('./common');
const commonEmitter = common.commonEmitter;
const {lethubAPI} = require('./axios');

const { Notification } = require('electron');

const { promisify } = require('util');
const stat = promisify(fs.stat);


/**
 *
 * Converts degrees into radians
 */
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

/**
 *
 * Calculates the distance between to locations based on longitude and latitude in km
 * Calculated using the Great Cirlce Distance of the two points
 *
 * Reference: https://en.wikipedia.org/wiki/Great-circle_distance
 */

function getDistanceBetweenLocations(latitudeOfLocation1,longitudeOfLocation1,latitudeOfLocation2,longitudeOfLocation2) {
    let radiusOfEarth = 6371;

    //Convert the coordinates into radians
    latitudeOfLocation1 = degreesToRadians(latitudeOfLocation1);
    longitudeOfLocation1 = degreesToRadians(longitudeOfLocation1);
    latitudeOfLocation2 = degreesToRadians(latitudeOfLocation2);
    longitudeOfLocation2 = degreesToRadians(longitudeOfLocation2);

    return radiusOfEarth * Math.acos( ( Math.sin(latitudeOfLocation1) * Math.sin(latitudeOfLocation2) ) + ( Math.cos(latitudeOfLocation1) * Math.cos(latitudeOfLocation2) * Math.cos(longitudeOfLocation1 - longitudeOfLocation2) ) )
}

/**
 * Converts the given address into a set of coordinates
 *
 * @param {String} address The address to be converted to coordinates
 * @returns {Number[]} The converted coordinates
 */

async function addressToCoordinates(address) {

    const params = {
        address: address
    }

    scheduleHangWorkaround();


    return lethubAPI.get("/private/coordinates", {params});
}


/**
 *
 * Compares the similarity between the two listing's attributes
 * and give them a score of how closely they matched
 *
 * @param {Object} listingOne Listing to compare
 * @param {Object} listingTwo Listing to compare
 * @returns {Number} a score of how similar the listings matched with each other
 */

function compareTwoListings(listingOne, listingTwo) {
    try {
        listingProperties = [
            'coordinates',
            'bed',
            'bath',
            'rentalType',
            'price',
            //'description',
            'squareSpace',
            'squareUnit',
            // 'laundry',
            // 'parking',
            // 'AC',
            // 'heating',
            // 'cat',
            // 'dog'
        ];

        let matchCount = 0;
        let noMatch = false;
        for(property of listingProperties){

            switch (property) {
                case "coordinates":
                    let distanceInKm = getDistanceBetweenLocations(listingOne.coordinates[0], listingOne.coordinates[1], listingTwo.coordinates[0], listingTwo.coordinates[1]);
                    console.log("Distance: ", distanceInKm);

                    //If location is approx
                    if(listingOne["address"] === "none" || listingTwo["address"] === "none"){
                        if(distanceInKm < 1){
                            //match
                            matchCount++;
                        } else {
                            //no match
                            noMatch = true;
                            matchCount = 0;
                        }
                    } else {
                        //Under 10 meters
                        if (distanceInKm < 0.010){
                            matchCount++;
                        } else {
                            noMatch = true;
                            matchCount = 0;
                        }
                    }

                    break;

                //For bath, bed property
                case "bath":
                case "bed":
                case "price":
                    if(listingOne[property] !== listingTwo[property]){
                        console.log(`${property} didn't match so these are different properties`);
                        noMatch = true;
                        matchCount = 0;
                    } else {
                        matchCount++;
                    }
                    break;

                case "squareSpace":
                    if( (listingOne["squareSpace"] === listingTwo["squareSpace"]) && (listingOne["squareUnit"] === listingTwo["squareUnit"])){
                        matchCount++;
                    }
                    break;

                case "squareUnit":
                    break;

                default:
                    if(listingOne[property] === listingTwo[property]){
                        matchCount++;
                        console.log(`${property}: match`);

                    } else {
                        console.log(`${property}: didn't match`);
                    }
                    break;
            }

            if(noMatch){
                break;
            }

        }
        return matchCount;
    } catch (error) {
        console.log(error);
        return null;
    }

}

/**
 * Compares the lists of listings to filter out duplicates
 *
 * @param {Object[]} selectedListings
 * @param {Object[]} scrappedListings
 * @returns {Object[]} The list of non duplicate properties
 */

function filterDuplicateListings(selectedListings, scrappedListings){
    try {
        //Compare scrapped list with list to push
        let propertiesToPush = selectedListings.filter(selectedListing => {
            for (const scrappedListing of scrappedListings) {
              if(compareTwoListings(selectedListing, scrappedListing) > 4){
                //Match
                console.log("Match");

                return false;
              }
            }

            //No match
            console.log(`No match for ${selectedListing.location}, pushing property`);
            return true;
        })
        return propertiesToPush;
    } catch (error) {
        console.log(error);
    }
}

/**
 * Gets the coordinates for the list of properties provided
 *
 * @param {Object[]} listOfProperties List of properties to get coordinates for
 * @returns {Object{}} list of properties with coordinates
 */

async function getCoordinatesForProperties(listOfProperties) {
    return new Promise (async (resolve, reject) => {
        try {

            for (const property of listOfProperties) {
                if(property["address"] !== "none" && property["address"] !== undefined){
                    let coordinates = await addressToCoordinates(property["address"]);
                    property["coordinates"] = [coordinates.lat,coordinates.lng];
                }
            }
        } catch (error) {
            console.log(error);
        }

        resolve (listOfProperties);
    });

}

/**
 * Gets the featured picture if it exists
 *
 * @param {Number} unitId The unit id of the unit to download picture of
 * @returns {Promise}
 */

async function downloadFeaturedPicture(unitId) {
    return new Promise (async (resolve, reject) => {
        const requestURL = `${config.LETHUB_API_BASE_URL}/public/file/get/featuredimage/unit?id=${unitId}`

        scheduleHangWorkaround();

        axios.get(requestURL)
        .then(async(response) =>{
            //console.log("<----TESTING---->", response.data.url);
            console.log(response.data);
            if(response.data.res){
                await downloadPicture(response.data.url, 0, unitId);
            }
            resolve();
        })
        .catch((error) =>{
            console.log("Error in download picture", error);
        })
    })
}

/**
 * Downloads and saves pictures of given unit
 *
 * @param {Number} unitId
 * @returns {Promise}
 */

async function downloadPictures(unitId) {
    return new Promise (async (resolve, reject) => {
        let entintyName = 'unit';
        let entityId = unitId;

        //request
        const requestURL = `${config.LETHUB_API_BASE_URL}/public/file/list?entityName=${entintyName}&entityId=${entityId}`;

        //Get image url
        //Make Directory to store pictures
        const lethubUnitPicturesDir = path.resolve( os.homedir(), 'lethub', 'unitPictures',`${entintyName}_${entityId}`);
        await fs.ensureDir(lethubUnitPicturesDir);

        //Download feature picture
        await downloadFeaturedPicture(entityId);

        scheduleHangWorkaround();

        axios.get(requestURL)
        .then(async (response) => {
            try {

                //download rest of pictures
                for (const [index, file] of response.data.files.entries()) {
                    await downloadPicture(file.url, index+1, entityId);
                }

            } catch (error) {
                reject(false);
            }

            resolve(true);
        })
        .catch((error) => {
            console.log("test",error);
            reject(false);
        })
    })

}

/**
 * Downloads the base pictures of a given unit, except the featured picture
 *
 * @param {String} url The url to download the unit picture from
 * @param {Number | String} index The index of the file
 * @param {Number | String} entityId The unit Id
 * @returns
 */
async function downloadPicture(url, index, entityId) {
    return new Promise (async (resolve, reject) => {
        const response = await fetch(url);
        const buffer = await response.buffer();
        const imagePath = path.resolve( os.homedir(), 'lethub', 'unitPictures',`unit_${entityId}`, `${entityId}_${index}.jpg`);
        //await fs.ensureDir(lethubUnitPicturesDir);
        fs.writeFile(imagePath, buffer, () => {
            console.log('finished downloading!');
            return resolve();
        });
    })

}


//Sleeps for a given amount of time
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 *
 * Generates a random number between min and max inclusive
 *
 * @param {Number} min The minimum number to generate
 * @param {Number} max The maximum number to generate
 * @returns {Number} random number between min and max
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

/**
 * Check if a file exists at the given path
 *
 * @param {String} path The file path of the file to check if it exists
 * @returns {Boolean} returns true if file exists, else returns false
 */

async function checkIfFileExists(path) {

    // try {
    //     const stats = await stat(path);
    //     return true;
    // } catch (error) {
    //     if(error.code === 'ENOENT'){
    //         return false;
    //     } else {
    //         console.log("Error with checkIfFileExists()");
    //         return false;
    //     }
    // }

    const exists = await fs.pathExists(path);
    return exists;

}

/**
 * Shows an OS notification with the given title and body
 *
 * @param {String} notificationTitle The title of the notification
 * @param {String} notificationBody The body of the notification
 */

function showNotification (notificationTitle, notificationBody) {
    new Notification({ title: notificationTitle, body: notificationBody }).show();
}

module.exports = {
    getDistanceBetweenLocations,
    downloadPictures,
    filterDuplicateListings,
    addressToCoordinates,
    getCoordinatesForProperties,
    compareTwoListings,
    degreesToRadians,
    scheduleHangWorkaround,
    sleep,
    getRandomIntInclusive,
    checkIfFileExists,
    showNotification
}
