const puppeteer = require('puppeteer');
//const scrollPageToBottom = require('puppeteer-autoscroll-down');
const fs = require('fs-extra');
const fsp = require('fs').promises;

const path = require('path');
const os = require('os');
const delayTime = 30;
// Import events module
const common = require('../../services/common');
const commonEmitter = common.commonEmitter;
const {sleep, getRandomIntInclusive} = require('../../services/utilityFunctions');

/***Exports***/

/**
 * Opens up a login prompt and saves the cookies to file if login is successful
 * @returns {Promise}
 */

async function loginToFacebook(){
    return new Promise (async (resolve, reject) => {
        try {
            const facebookURL = 'https://www.facebook.com/';
            const browserFetcher = puppeteer.createBrowserFetcher();
            const revisionInfo = await browserFetcher.download('901912');
            const browser = await puppeteer.launch({
                executablePath: revisionInfo.executablePath,
                headless: false,
                args: [`--window-size=1000,900`, `--window-position=0,0`],
                defaultViewport: {
                    width:1000,
                    height:900
                }
            });
            const context = browser.defaultBrowserContext();

            //Turns off FB popups
            context.overridePermissions(facebookURL, []);

            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

            //Login
            await page.goto(facebookURL, {waitUntil: 'networkidle2'});

            //Check if page is closed
            page.on('close',async ()=>{
                console.log("CLOSED");
                await browser.close();
                resolve(false);
            })

            //Check if page changed
            page.on('domcontentloaded',async ()=>{
                let pageTitle = await page.title()

                if(!pageTitle.includes("Facebook")){
                    console.log("Not Logged In");
                } else {
                    try {
                        await page.waitForXPath("//a[@aria-label='Home']", {visible: true});
                        console.log("Logged In");
                        const cookies = await page.cookies();
                        const lethubFBDir = path.resolve( os.homedir(), 'lethub', 'FB');
                        await fs.ensureDir(lethubFBDir);
                        const cookiePath = path.resolve( lethubFBDir, 'cookies.json');
                        await fsp.writeFile(cookiePath, JSON.stringify(cookies, null, 2));
                        await browser.close();
                        resolve(true);
                    } catch (error) {
                        console.log(error);
                        console.log("Not Logged In");
                    }

                }

            })


        } catch (error) {
            console.log(error);
            resolve(false);
        }
    })

}

/**
 * Scrapes active listings from user's Facebook Marketplace account
 * to be used to compare with selected listings to be posted to Facebook Marketplace
 * @returns {Object} array of scrapped active listings
 */

async function scrapListingsFromFacebook() {
    const browser = await setupBrowser();
    try {
        console.log("In scraping script");
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        await page.setViewport({ width: 1000, height: 800 });

        await getCookies(page);

        await page.goto("https://www.facebook.com/marketplace/you/selling", {waitUntil: 'networkidle2'});

        //Scroll to load everything
        await autoScrollDown(page);
        await autoScrollUp(page);
        //Check if empty
        let allListings = []
        try {
            await page.waitForXPath("//span[text()='Active'] | //span[text()='Rented']", {timeout: 2000});
            allListings = await page.$x("//span[text()='Active'] | //span[text()='Rented']");

        } catch (error) {
            console.log("No listings on FB");
            await browser.close();
            return [];
        }

        let scrappedPropertyInfoList = [];
        for(let listing of allListings){
            let propertyInfo = {};

            //select active listing
            await listing.click();

            //Open listing details
            const postedSpanElement = await page.waitForXPath("//span[contains(text(),'Posted')]", {visible: true});
            await postedSpanElement.click();

            //Get per month amount
            const perMonthElement = await page.waitForXPath("//span[contains(text(),' / Month')]", {visible: true})

            if(perMonthElement){
                const perMonthText = await page.evaluate(element => element.textContent, perMonthElement);
                //span[contains(text(),' / Month')]/parent::div/parent::div/parent::div/following-sibling::div[1]//span
                //Price
                if(perMonthText){
                    propertyInfo["price"] = perMonthText.split(" / ")[0].replace("$", "").replace(",", "");
                }

                //Unit Details//

                //House Type
                let rentalTypeList = ['House', 'Townhouse', 'Apartment', 'Condo', 'Room Only', 'Apartment/condo'];
                let rentalType = await getUnitDetailFromList(rentalTypeList, page);
                propertyInfo["rentalType"] = rentalType;

                //Laundry Type
                let laundryTypeList = ['In-unit laundry', 'Laundry in building', 'Laundry available'];
                let laundryType = await getUnitDetailFromList(laundryTypeList, page);

                if(laundryType === ''){
                    propertyInfo["laundry"] = 'None';
                } else {
                    propertyInfo["laundry"] = laundryType;
                }


                //Parking Type
                let parkingTypeList = ['Garage parking', 'Street parking', 'Off-street parking', 'Parking available', 'None'];
                let parkingType = await getUnitDetailFromList(parkingTypeList, page);

                if(parkingType === ''){
                    propertyInfo["parking"] = 'None';
                } else {
                    propertyInfo["parking"] = parkingType;
                }

                //AC Type
                let ACTypeList = ['Central AC', 'AC available', 'None'];
                let ACType = await getUnitDetailFromList(ACTypeList, page);

                if(ACType === ''){
                    propertyInfo["AC"] = 'None';
                } else {
                    propertyInfo["AC"] = ACType;
                }

                //Heating Type
                let heatingTypeList = ['Central heating', 'Electric heating', 'Gas heating', 'Radiator heating', 'Heating available', 'None'];
                let heatingType = await getUnitDetailFromList(heatingTypeList, page);

                if(heatingType === ''){
                    propertyInfo["heating"] = 'None';
                } else {
                    propertyInfo["heating"] = heatingType;
                }


                //Dog and cat
                let dogAndCatList = ['Cat friendly', 'Dog friendly', 'Dog and cat friendly'];
                let dogAndCat = await getUnitDetailFromList(dogAndCatList, page);

                //Both
                if(dogAndCat === 'Dog and cat friendly'){
                    propertyInfo["cat"] = true;
                    propertyInfo["dog"] = true;
                }
                //Just dog
                else if (dogAndCat === 'Dog friendly'){
                    propertyInfo["cat"] = false;
                    propertyInfo["dog"] = true;
                }
                //Just cat
                else if (dogAndCat === 'Cat friendly'){
                    propertyInfo["cat"] = true;
                    propertyInfo["dog"] = false;
                }
                //Neither
                else {
                    propertyInfo["cat"] = false;
                    propertyInfo["dog"] = false;
                }


                //Gets bed bath count
                let bedBath = await scrapeDynamicField("//span[contains(text(),'bath')]", page);
                let bedCount = bedBath.split(" · ")[0].split(" ")[0];
                let bathCount = bedBath.split(" · ")[1].split(" ")[0];
                propertyInfo["bed"] = bedCount;
                propertyInfo["bath"] = bathCount;


                //Square Meters or Square Feet
                let squareMeters = await scrapeDynamicField("//span[contains(text(),'square meters')]", page);
                if(squareMeters !== ""){
                    propertyInfo["squareSpace"] = squareMeters;
                    propertyInfo["squareUnit"] = "meters";
                }

                let squareFeet = await scrapeDynamicField("//span[contains(text(),'square feet')]", page);
                propertyInfo["squareSpace"] = squareFeet;
                if(squareMeters !== ""){
                    propertyInfo["squareSpace"] = squareFeet;
                    propertyInfo["squareUnit"] = "feet";
                }


                //Description
                try {

                    let descriptionText = await getDescriptionText(page);

                    //Parse unitId from description if there
                    if( descriptionText.split('###LHID###').length === 2){
                        let parsedUnitId = descriptionText.split('###LHID###')[1];
                        propertyInfo["unitId"] = parseInt(parsedUnitId);
                        propertyInfo["sync"] = true;

                    } else {
                        propertyInfo["sync"] = false;
                    }



                } catch (error) {
                    console.log("No Description or Description too short");
                }

                //Check if Rental Location is approximate
                let locationApprox;
                try {
                    await page.waitForXPath("//span[text()='Location is approximate']", {visible: true, timeout: 1000});
                    locationApprox = true;
                } catch (error) {
                    locationApprox = false;
                }

                if(locationApprox){
                    //Gets coordinates of listing
                    propertyInfo["address"] = "none";
                    propertyInfo["coordinates"] = await getCoordinatesFromMap(page);

                } else {
                   propertyInfo["address"] = await scrapeDynamicField("//span[contains(text(),' / Month')]/parent::div/parent::div/parent::div/following-sibling::div[1]/child::div/child::div[1]//span", page);
                }


                scrappedPropertyInfoList.push(propertyInfo);

                let exitEditButton = await page.waitForXPath("//div[@role='banner']//div[@aria-label='Close']", { visible: true });
                await exitEditButton.click();

                let exitListingButton = await page.waitForXPath("//div[@aria-label='Your Listing']//div[@aria-label='Close']", { visible: true });
                await exitListingButton.click();
            }
        }

        await browser.close();
        return scrappedPropertyInfoList;
    } catch (error) {
        console.log(error);
        console.log("ERROR IN scrapListingsFromFacebook");
        await browser.close();
        return null;
    }
}

/**
 * Takes an array of listings that needs to be posted to Facebook Marketplace, then posts them
 * @param {Object[]} listingsToPost
 *
 */
async function pushToFacebook(listingsToPost){
    return new Promise (async (resolve, reject) => {
        const browser = await setupBrowser();
        try {
            console.log("In pushing script");

            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
            await page.setViewport({ width: 1920, height: 800 });

            await getCookies(page);

            await page.goto("https://www.facebook.com", {waitUntil: 'networkidle2'});
            let pushedListingIds = [];

            for(let i = 0; i < listingsToPost.length; i++){
                await page.goto("https://www.facebook.com/marketplace/create/rental", {waitUntil: 'networkidle2'});

                try {
                    await page.waitForXPath("//span[text()='Limit Reached']", {timeout: 1000});
                    // console.log(listingsToPost.slice(0,i));
                    // pushedListingIds = [];
                    // listingsToPost.slice(0,i).forEach(listing => {
                    //     pushedListingIds.push(listing["unitId"]);
                    // });
                    console.log("Limit Reached!");
                    //await browser.close();
                    break;

                } catch (error) {
                    console.log("Limit not reached");

                }
                await inputListingFields(listingsToPost[i], page);



                console.log("Trying to press Next");
                //Next Button
                try {
                    await pushButton("Next", page);
                    await page.waitForNavigation({waitUntil: 'networkidle2'});

                    console.log("press Next OK");

                } catch (error) {
                    console.log("No Next Button");
                }
                console.log("Past press Next");


                //wait for a random amount between 5000ms and 10000ms
                await page.waitForTimeout(getRandomIntInclusive(5000,10000));


                console.log("Pushing!");

                //Publish Button
                try {
                    await pushButton("Publish", page);
                    await page.waitForNavigation({waitUntil: 'networkidle2'});

                    console.log("press Publish OK");
                    //Add to list of actually pushed listings
                    pushedListingIds.push(listingsToPost[i]["unitId"]);

                } catch (error) {
                    console.log(`No Publish Button for unit ${listingsToPost[i]["unitId"]}`);
                }
                console.log("Past press Publish");


                //wait for a random amount between 10000ms and 15000ms
                console.log("Waiting 10-15 sec");
                await page.waitForTimeout(getRandomIntInclusive(10000,15000));
                console.log("Waiting 10-15 sec done");

            }
            //for (const listing of listingsToPost) {
                // await page.goto("https://www.facebook.com/marketplace/create/rental", {waitUntil: 'networkidle2'});

                // try {
                //     await page.waitForXPath("//span[text()='Limit Reached']", {timeout: 1000});
                // } catch (error) {

                //     console.log(error);
                // }
                // await inputListingFields(listing, page);



                // console.log("Trying to press Next");
                // //Next Button
                // try {
                //     await pushButton("Next", page);
                //     await page.waitForNavigation({waitUntil: 'networkidle2'});

                //     console.log("press Next OK");

                // } catch (error) {
                //     console.log("No Next Button");
                // }
                // console.log("Past press Next");


                // //wait for a random amount between 5000ms and 10000ms
                // await page.waitForTimeout(getRandomIntInclusive(5000,10000));


                // console.log("Pushing!");

                // //Publish Button
                // try {
                //     await pushButton("Publish", page);
                //     await page.waitForNavigation({waitUntil: 'networkidle2'});

                //     console.log("press Publish OK");

                // } catch (error) {
                //     console.log(`No Publish Button for unit ${listing["unitId"]}`);
                // }
                // console.log("Past press Publish");


                // //wait for a random amount between 10000ms and 15000ms
                // console.log("Waiting 10-15 sec");
                // await page.waitForTimeout(getRandomIntInclusive(10000,15000));
                // console.log("Waiting 10-15 sec done");

            //}

            await browser.close();
            resolve(pushedListingIds);
        } catch (error) {
            console.log("ERROR:::",error);
            await browser.close();
            resolve(null);
        }
    })

}

/**
 *
 * @param {Object[]} updateList The list of listings to update info on FB
 * @returns {Promise}
 */

async function updateListings(updateList) {
    return new Promise (async (resolve, reject) => {
        const browser = await setupBrowser();
        try {
            // const facebookURL = 'https://www.facebook.com/';
            console.log("In updating script");
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
            await page.setViewport({ width: 1000, height: 800 });

            await getCookies(page);

            await page.goto("https://www.facebook.com/marketplace/you/selling", {waitUntil: 'networkidle2'});

            //Scroll to load everything
            await autoScrollDown(page);
            await autoScrollUp(page);

            let allListings = [];
            try {
                await page.waitForXPath("//span[text()='Active']", {timeout: 2000});
                allListings = await page.$x("//span[text()='Active']");

            } catch (error) {
                await browser.close();
                console.log("No listings to update");
                resolve(true);
            }


            console.log("In update");
            for(let listing of allListings){
                //select active listing
                await listing.click();

                //Open listing details
                const postedSpanElement = await page.waitForXPath("//span[contains(text(),'Posted')]", {visible: true});
                await postedSpanElement.click();

                let update = false;
                let unitIdUpdate;

                //Description
                try {

                    let descriptionText = await getDescriptionText(page);
                    //Parse unitId from description if there

                    if( descriptionText.split('###LHID###').length === 2){
                        let parsedUnitId = descriptionText.split('###LHID###')[1];
                        unitIdUpdate = parseInt(parsedUnitId);
                        update = true;

                    } else {
                        update = false;
                    }

                } catch (error) {
                    console.log(error);
                    console.log("No Description or Description too short");
                }


                if(update){
                    let matchFound = false;
                    for(const updateInfo of updateList) {
                        if(updateInfo["unitId"] === unitIdUpdate){
                            // console.log("updating listing");
                            try {

                                const editButton = await page.waitForXPath("//span[text()='Edit']",{visible:true});
                                console.log("Found edit button");
                                await editButton.click();

                                console.log("In Edit");
                            } catch (error) {
                                //No edit button, skip
                                console.log("No edit button");
                                continue;
                            }
                            console.log("Found unit to update");
                            matchFound = true;
                            //Remove Current Pictures
                            try {
                                await page.waitForXPath("//div[@aria-label='Remove']");
                                const removePictureButtons = await page.$x("//div[@aria-label='Remove']");

                                for (const removePictureButton of removePictureButtons) {
                                    await removePictureButton.click();
                                }
                            } catch (error) {
                                console.log(error);
                                console.log("remove picture failed");
                            }

                            await inputListingFields(updateInfo, page);

                            //Update Button
                            try {
                                console.log("Pressing Button");
                                await pushButton("Update", page);
                                await page.waitForNavigation();
                            } catch (error) {
                                console.log("No Update Button");
                            }

                            
                            console.log("CLOSING");
                            //Close
                            const exitListingButton = await page.waitForXPath("//div[@aria-label='Your Listing']//div[@aria-label='Close']",{visible:true});
                            await exitListingButton.click();
                            console.log("CLOSED");
                            break;
                            //Uncomment this for leave page
                            /*
                            // await page.waitForXPath("//div[@role='banner']//div[@aria-label='Close']");
                            // let [exitEdit1Button] = await page.$x("//div[@role='banner']//div[@aria-label='Close']");
                            // await exitEdit1Button.click();


                            // //Leave page
                            // try {
                            //     await pushButton("Leave Page", page);
                            // } catch (error) {
                            //     console.log("No Leave Page Button");
                            // }

                            // const exitEdit2Button = await page.waitForXPath("//div[@role='banner']//div[@aria-label='Close']");
                            // //let [exitEdit2Button] = await page.$x("//div[@role='banner']//div[@aria-label='Close']");
                            // await exitEdit2Button.click();
                            */
                        }

                    }

                    if(!matchFound){
                        //Close
                        const closeBanner = await page.waitForXPath("//div[@role='banner']//div[@aria-label='Close']",{visible:true});
                        await closeBanner.click();
                        //Close
                        const closeListing = await page.waitForXPath("//div[@aria-label='Your Listing']//div[@aria-label='Close']",{visible:true});
                        await closeListing.click();
                    }

                    
                } else {

                    console.log("ELSE");
                    //Close
                    const exitEdit2Button = await page.waitForXPath("//div[@role='banner']//div[@aria-label='Close']",{visible:true});
                    await exitEdit2Button.click();

                }

            }

            await browser.close();
            resolve(true);

        } catch (error) {
            console.log(error);
            console.log("Error in updateListings()");
            await browser.close();

            resolve(false);
        }
    })

}

/**
 *
 * Updates the availability of the given listings
 *
 * @param {Object[]} listings The list of listings to update the availability of
 * @returns {Promise}
 */

async function updateAvailability(listings) {
    return new Promise (async (resolve, reject) => {
        const browser = await setupBrowser();
        try {
            console.log("In update availability script");

            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
            await page.setViewport({ width: 1000, height: 800 });

            await getCookies(page);

            await page.goto("https://www.facebook.com/marketplace/you/selling", {waitUntil: 'networkidle2'});

            //Scroll to load everything
            await autoScrollDown(page);

            await autoScrollUp(page);
            let allListings = [];
            try {
                await page.waitForXPath("//span[text()='Active'] | //span[text()='Rented']", {timeout: 2000});
                allListings = await page.$x("//span[text()='Active'] | //span[text()='Rented']");
            } catch (error) {
                await browser.close();
                console.log("No listings to updateAvailability");
                resolve(true);
            }
            for (const activeOrRented of allListings) {

                //select active listing
                await activeOrRented.click();

                //Open listing details
                const postedSpanElement = await page.waitForXPath("//span[contains(text(),'Posted')]", {visible: true});
                await postedSpanElement.click();


                //Description
                let unitIdUpdate = null;
                try {

                    let descriptionText = await getDescriptionText(page);
                    //Parse unitId from description if there

                    if( descriptionText.split('###LHID###').length === 2){
                        let parsedUnitId = descriptionText.split('###LHID###')[1];

                        unitIdUpdate = parseInt(parsedUnitId);

                    }

                    //Close View
                    const closeListingViewer = await page.waitForXPath("//div[@aria-label='Marketplace Listing Viewer']//div[@aria-label='Close']", {visible: true, timeout: 5000});
                    await closeListingViewer.click()

                } catch (error) {
                    console.log(error);
                    console.log("No Description or Description too short");
                }
                console.log("The unit ID for update avail: ", unitIdUpdate);
                if(unitIdUpdate){
                    console.log("Listing in update avail",listings);
                    for(listing of listings){
                        console.log("Check if equal: ",unitIdUpdate === listing["unitId"]);
                        if(unitIdUpdate === listing["unitId"]){
                            if(listing["status"] === "Vacant" ){
                                try {
                                    //Mark as Available
                                    const markAsAvailable = await page.waitForXPath("//a[@aria-label='View Listing']/parent::div/parent::div/preceding-sibling::div/div[@aria-label='Mark as Available']", {visible: true, timeout: 2000});
                                    await markAsAvailable.click();
                                    console.log("Clicked Mark as Available!");
                                } catch (error) {
                                    console.log("No Mark as Available Option!");

                                }
                            } else {
                                try {
                                    //Mark as Rented
                                    const markAsRented = await page.waitForXPath("//div[@aria-label='Mark as Pending']/parent::div/parent::div/preceding-sibling::div/div[@aria-label='Mark as Rented']", {visible: true, timeout: 2000});
                                    await markAsRented.click();
                                    console.log("Clicked Mark as Rented!");
                                } catch (error) {
                                    console.log("No Mark as Rented Option!");
                                }
                            }


                        }

                        

                    }
                    const closeListingUpdate = await page.waitForXPath("//div[@aria-label='Your Listing']//div[@aria-label='Close']", {visible: true});
                    await closeListingUpdate.click();
                } else {
                    console.log("NO UPDATE AVAIL");
                    const closeListingNoUpdate = await page.waitForXPath("//div[@aria-label='Your Listing']//div[@aria-label='Close']", {visible: true});
                    await closeListingNoUpdate.click();
                }
                
            }
            await browser.close();
            resolve(true);
        } catch (error) {
            console.log(error);
            console.log("Error in updateAvailability()");
            await browser.close();
            resolve(false);
        }
    })

}

/**
 * Checks if any of the listings are flagged
 *
 * @param {Object[]} listings The listings to check for flags
 * @returns {Number[]} The list of unitIds that are flagged
 */

async function checkForFlags(listings) {
    return new Promise (async (resolve, reject) => {
        const browser = await setupBrowser();
        try {
            console.log("In checkForFlags script");

            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
            await page.setViewport({ width: 1000, height: 800 });

            await getCookies(page);

            await page.goto("https://www.facebook.com/marketplace/you/selling", {waitUntil: 'networkidle2'});

            //Scroll to load everything
            await autoScrollDown(page);
            await autoScrollUp(page);

            let allFlags=[];
            try {
                await page.waitForXPath("//div[text()='Please take action on this listing.']", {timeout: 2000});
                allFlags = await page.$x("//div[text()='Please take action on this listing.']");
            } catch (error) {
                //No flags
                await browser.close();
                resolve([]);
            }

            let listOfFlaggedUnits = [];
            console.log("flag length", allFlags.length);
            for (const flag of allFlags) {
                //select active listing
                console.log("Clicking flag");
                await flag.click();

                //Open listing details
                const postedSpanElement = await page.waitForXPath("//span[contains(text(),'Posted')]", {visible: true});
                await postedSpanElement.click();


                //Description
                let parsedUnitId;
                try {

                    let descriptionText = await getDescriptionText(page);
                    //Parse unitId from description if there

                    if( descriptionText.split('###LHID###').length === 2){
                        parsedUnitId = descriptionText.split('###LHID###')[1];
                        parsedUnitId = parseInt(parsedUnitId);
                    }

                    //Close View
                    const closeListingViewer = await page.waitForXPath("//div[@aria-label='Marketplace Listing Viewer']//div[@aria-label='Close']", {visible: true});
                    await closeListingViewer.click();
                    await page.waitForTimeout(1000);
                    console.log("Test");

                    await page.waitForXPath("//div[@aria-label='Your Listing']//div[@aria-label='Close']", {visible: true});
                    const [closeListing] = await page.$x("//div[@aria-label='Your Listing']//div[@aria-label='Close']");
                    await closeListing.click();
                    console.log("Test2");

                } catch (error) {
                    console.log(error);
                    console.log("No Description or Description too short");
                }

                if(parsedUnitId){

                    for(listing of listings){

                        if(parsedUnitId === listing["unitId"]){
                            listOfFlaggedUnits.push(parsedUnitId);
                        }

                    }

                } else {
                    console.log("No id Found");

                }
            }
            console.log("FOUND FLAGGED UNITS", listOfFlaggedUnits);
            await browser.close();
            resolve(listOfFlaggedUnits);
        } catch (error) {
            console.log(error);
            console.log("Error in flagged units");
            await browser.close();
            resolve(false);
        }


    })

}


/***Internal Functions***/

/**
 * Scrolls down the page until it can't scroll further
 *
 * @param {Object} page The page object
 */

async function autoScrollDown(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            let distance = 100;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 400);
        });
    });
}

/**
 * Scrolls up the page until it can't scroll further
 *
 * @param {Object} page The page object
 */

 async function autoScrollUp(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            window.scrollBy(0, -document.body.scrollHeight);
            resolve();
        });
    });
}

/**
 * Gets the description of listings
 *
 * @param {Object} page The page object
 * @returns {String} The text value of the description
 */

async function getDescriptionText(page) {
    try {
        const seeMoreButton = await page.waitForXPath("//span[text()='See More'] | //span[text()='See more']", {visible: true, timeout: 2000 });
        await seeMoreButton.click();

        const description = await page.waitForXPath("//span[text()='See Less']/parent::div/parent::span | //span[text()='See less']/parent::div/parent::span", {visible: true} );
        let descriptionText = await page.evaluate(element => element.textContent, description);

        //Remove See Less text from description
        if(descriptionText.includes(" See Less")){
            descriptionText = descriptionText.replace(" See Less","");
        } else if(descriptionText.includes(" See less")){
            descriptionText = descriptionText.replace(" See less","");
        }

        return descriptionText;
    } catch (error) {
        console.log(error);
        return "";
    }

}

/**
 *
 * Gets coordinates from the listing map
 *
 * @param {Object} page The page object
 * @returns {String[]} The coordinates gathered from the map
 */
async function getCoordinatesFromMap(page) {
    try {
        const addressMap = await page.waitForXPath("//div[contains(@style,'background-image: url')]", {visible: true});

        //Parsing coordinates from map url
        let addressMapStyle = await page.evaluate(element => element.getAttribute("style"), addressMap);
        let mapURLparams = addressMapStyle.split(" ")[1].split("&");
        let coordinates = ['',''];
        for (const param of mapURLparams) {
            if(param.includes("center=")){
                coordinates = param.split("center=")[1].split("%2C");
                break;
            }
        }
        return coordinates;
    } catch (error) {

        console.log(error);
        return ['',''];
    }
}

/**
 * Gets the cookies file and sets it as the page cookies
 *
 * @param {Object} page page object
 */

async function getCookies(page) {
    const lethubFBDir = path.resolve( os.homedir(), 'lethub', 'FB');
    await fs.ensureDir(lethubFBDir);
    const cookiePath = path.resolve( lethubFBDir, 'cookies.json');
    const cookiesString = await fsp.readFile(cookiePath, () =>{
        console.log("reading cookies");
    });
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
}

/**
 * Inputs listing info into input fields for Facebook Marketplace
 *
 * @param {Object} listing listing info to input
 * @param {Object} page page object
 * @returns {Promise}
 */

async function inputListingFields(listing, page) {
    return new Promise (async (resolve, reject) => {
        //Photos
        try {
            const firstAddPhotosXpath = "//span[text()='Add Photos']  | //span[text()='Add photos']";
            const firstAddPhotoButton = await page.$x(firstAddPhotosXpath);


            let photoList = listing["pictureArray"];
            //Upload first photo
            let [fileChooser] = await Promise.all([
                page.waitForFileChooser(),
                firstAddPhotoButton[0].click()
            ]);
            await fileChooser.accept([photoList[0]]);

            photoList.shift();

            //Upload rest of the photos
            const restAddPhotosXpath = "//span[text()='Add Photo'] | //span[text()='Add photo']";
            await page.waitForXPath(restAddPhotosXpath);
            const restAddPhotoButton = await page.$x(restAddPhotosXpath);
            for(const photo of photoList){
                setTimeout(()=>{}, 1000);
                [fileChooser] = await Promise.all([
                    page.waitForFileChooser(),
                    restAddPhotoButton[0].click()
                ]);
                await fileChooser.accept([photo]);
            }
        } catch (error) {
            console.log(error);
        }

        //Hard code Rent or Sale option
        try {
            await selectDropDownOption("Home for Sale or Rent", "Rent", page);
        } catch (error) {
            console.log(error);
        }

        //Text Fields and Dropdowns
        for (const attribute in listing) {

            //wait for a random amount between 500ms and 1000ms
            await page.waitForTimeout(getRandomIntInclusive(500,1000));

            let inputType = "";
            let inputLabel = "";
            switch (attribute) {

                case "rentalType":
                    inputType = "dropdown"
                    inputLabel = "Rental type"
                    break;

                case "laundry":
                    inputType = "dropdown"
                    inputLabel = "Laundry type"
                    break;

                case "parking":
                    inputType = "dropdown"
                    inputLabel = "Parking type"
                    break;

                case "AC":
                    inputType = "dropdown"
                    inputLabel = "Air conditioning type"
                    break;

                case "heating":
                    inputType = "dropdown"
                    inputLabel = "Heating type"
                    break;

                case "bed":
                    inputType = "textField"
                    inputLabel = "Number of bedrooms"
                    break;

                case "bath":
                    inputType = "textField"
                    inputLabel = "Number of bathrooms"
                    break;

                case "price":
                    inputType = "textField"
                    inputLabel = "Price per month"
                    break;

                case "squareSpace":
                    inputType = "textField"
                    if(listing["squareUnit"] === "feet"){
                        inputLabel = "Property square feet"
                    } else {
                        inputLabel = "Property square meters"
                    }
                    break;

                default:
                    break;
            }

            if(inputType === "dropdown"){
                try {
                    await selectDropDownOption(inputLabel, listing[attribute], page);
                } catch (error) {
                    console.log(error);
                }

            }

            if(inputType === "textField"){
                try {
                    await fillTextField(inputLabel, listing[attribute], page);
                } catch (error) {
                    console.log(error);
                }
            }
        }

        //Rental Description
        try {

            await page.waitForXPath("//label[@aria-label='Rental description']//textarea");
            const [rentalDescription] = await page.$x("//label[@aria-label='Rental description']//textarea");

            //Make sure text field is empty

            const currentValue = await page.evaluate(inputField => inputField.value, rentalDescription);
            if(currentValue){
                await rentalDescription.click();
                await emulateSelectAll(page);
                await page.keyboard.press('Backspace');
            }

            if(rentalDescription){
                //Type instantly
                await rentalDescription.click();
                await page.keyboard.sendCharacter(listing["description"]);

                //Slow type
                //await rentalDescription.type(listing["description"]);
                //await rentalDescription.type(listing["description"], {delay: delayTime});
            }
        } catch (error) {
            console.log(error);
        }

        //Rental address
        try {
            
            // await page.waitForXPath("//span[text()='Rental address']/following-sibling::input");
            // const [rentalAddressOption] = await page.$x("//span[text()='Rental address']/following-sibling::input");

            await page.waitForXPath("//label[@aria-label='Rental address']//input");
            const [rentalAddressOption] = await page.$x("//label[@aria-label='Rental address']//input");
            if(rentalAddressOption){
                await rentalAddressOption.type(`${listing["address"]}`, {delay: delayTime});
            }
            try {
                await page.waitForXPath(`//span[contains(., '${listing["address"]}')]`, { timeout: 1000 });
                const [addressSelect] = await page.$x(`//span[contains(., '${listing["address"]}')]`);
                if(addressSelect){
                    await addressSelect.click();
                }
            } catch (error) {
                await page.waitForXPath("//li[@role='option']");
                const [firstAddressOption] = await page.$x("//li[@role='option']");
                if(firstAddressOption){
                    await firstAddressOption.click();
                }
            }

        } catch (error) {
            console.log(error);
        }

        //cat
        if(listing["cat"] !== null){
            await selectSlider('Cat friendly', listing["cat"] ,page);
        }

        //dog
        if(listing["dog"] !== null){
            await selectSlider('Dog friendly',listing["dog"], page);
        }

        resolve();
    });

}

/**
 *
 * Toggles the selected slider
 *
 * @param {String} sliderLabel The label of the slider to toggle
 * @param {Object} page page object
 *
 */

async function selectSlider(sliderLabel, state ,page) {
    try {
        if(state){
            await page.waitForXPath(`//input[@role='switch'][@aria-label='${sliderLabel}']`);
            const [slider] = await page.$x(`//input[@role='switch'][@aria-label='${sliderLabel}']`);

            let currentSliderState = await slider.evaluate(el => el.getAttribute('aria-checked'));
            if(state.toString() !== currentSliderState){
                if(slider){
                    await slider.click();
                }
            }
        }

    } catch (error) {
        console.log(error);
    }
}


/**
 *
 * Clicks on the button with the same text value as the buttonText parameter
 *
 * @param {String} buttonText The text value inside button
 * @param {Object} page page object
 *
 */

async function pushButton(buttonText, page) {
    return new Promise (async (resolve, reject) => {
        try {
            await page.waitForXPath(`//span[text()='${buttonText}']`, { timeout: 1000 });
            const [button] = await page.$x(`//span[text()='${buttonText}']`);
            if (button) {
                await button.click();
            }
            resolve();
        } catch (error) {
            reject();
        }

    })

}


/**
 * Takes an array of possible options that the page could have and checks for each option value
 * If a match is found, the match is returned
 *
 * @param {String[]} typeList The list of possible options
 * @param {Object} page page object
 * @returns {String} The matched option
 */

async function getUnitDetailFromList(typeList, page) {
    let type = '';

    for (const typeListItem of typeList) {
        try {
            await page.waitForXPath(`//span[text()='${typeListItem}']`, { timeout: 50 })
            type = typeListItem;
            break;
        } catch (error) {

        }
    }
    return type;
}


/**
 * Selects a dropdown option from a dropdown
 *
 * @param {String} dropdown The text value of the label of the dropdown
 * @param {String} option The text value of the option
 * @param {Object} page page object
 */

async function selectDropDownOption(dropdown, option, page) {

    try {
        //Click Dropdown
        // await page.waitForXPath(`//span[text()='${dropdown}']`);
        // const [dropDownToClick] = await page.$x(`//span[text()='${dropdown}']`);
        
        await page.waitForXPath(`//label[@aria-label="${dropdown}"]`);
        const [dropDownToClick] = await page.$x(`//label[@aria-label="${dropdown}"]`);
        
        if(dropDownToClick){
            await dropDownToClick.click();
        }

        //Click Option
        await page.waitForXPath(`//div[@role='menu']//span[text()='${option}']`);
        const [optionToClick] = await page.$x(`//div[@role='menu']//span[text()='${option}']`);
        if (optionToClick) {
            await optionToClick.click();
        }
    } catch (error) {

        console.log(error);
    }

}


/**
 * Finds the text field with the label with the same value as textField
 * and inputs the textValue with a delay of delayTime
 *
 * @param {String} textField Text value of the label of the text input field
 * @param {String} textValue Text value to be filled into input field
 * @param {Object} page page object
 */

async function fillTextField(textField, textValue, page) {
    try {
        //await page.waitForXPath(`//span[text()='${textField}']/following-sibling::input`);
        await page.waitForXPath(`//label[@aria-label="${textField}"]//input`);
        
        //const [textFieldInput] = await page.$x(`//span[text()='${textField}']/following-sibling::input`);
        const [textFieldInput] = await page.$x(`//label[@aria-label="${textField}"]//input`);

        //Make sure text field is empty
        const currentValue = await page.evaluate(inputField => inputField.value, textFieldInput);
        if(currentValue){
            await textFieldInput.click();
            for (let index = 0; index < currentValue.length; index++) {
                await page.keyboard.press('Backspace');
            }
        }

        //Input value
        if(textFieldInput){
            await textFieldInput.type(textValue, {delay: delayTime});
        }
    } catch (error) {
        console.log(error);
    }

}


/**
 * Scrapes fields with dynamic values that don't have a set template
 *
 * @param {String} fieldXpath Xpath of the field to be scrapped
 * @param {Object} page page object
 * @returns The scrapped value
 */

async function scrapeDynamicField(fieldXpath, page) {

    try {
        await page.waitForXPath(fieldXpath, { timeout: 50 });
        const [element] = await page.$x(fieldXpath);
        const elementText = await page.evaluate(element => element.textContent, element);
        return elementText;
    } catch (error) {
        return "";
    }
}


/**
 * Sets up the browser with the correct settings
 *
 * @returns The setup browser
 */

async function setupBrowser() {
    try {
        const facebookURL = 'https://www.facebook.com/';
        const browserFetcher = puppeteer.createBrowserFetcher();
        const revisionInfo = await browserFetcher.download('901912');
        const browser = await puppeteer.launch({
            executablePath: revisionInfo.executablePath,
            headless: true
        });
        const context = browser.defaultBrowserContext();

        //Turns off FB popups
        context.overridePermissions(facebookURL, []);

        return browser;
    } catch (error) {
        console.log(error);
    }

}

/**
 *
 * Emulates the select all function (Control + A) for both Mac and Windows
 */

async function emulateSelectAll(page) {
	await page.evaluate( () => {
		const isMac = /Mac|iPod|iPhone|iPad/.test( window.navigator.platform );

		document.activeElement.dispatchEvent(
			new KeyboardEvent( 'keydown', {
				bubbles: true,
				cancelable: true,
				key: isMac ? 'Meta' : 'Control',
				code: isMac ? 'MetaLeft' : 'ControlLeft',
				location: window.KeyboardEvent.DOM_KEY_LOCATION_LEFT,
				getModifierState: ( keyArg ) => keyArg === ( isMac ? 'Meta' : 'Control' ),
				ctrlKey: ! isMac,
				metaKey: isMac,
				charCode: 0,
				keyCode: isMac ? 93 : 17,
				which: isMac ? 93 : 17,
			} )
		);

		const preventableEvent = new KeyboardEvent( 'keydown', {
			bubbles: true,
			cancelable: true,
			key: 'a',
			code: 'KeyA',
			location: window.KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
			getModifierState: ( keyArg ) => keyArg === ( isMac ? 'Meta' : 'Control' ),
			ctrlKey: ! isMac,
			metaKey: isMac,
			charCode: 0,
			keyCode: 65,
			which: 65,
		} );

		const wasPrevented = (
			! document.activeElement.dispatchEvent( preventableEvent ) ||
			preventableEvent.defaultPrevented
		);

		if ( ! wasPrevented ) {
			document.execCommand( 'selectall', false, null );
		}

		document.activeElement.dispatchEvent(
			new KeyboardEvent( 'keyup', {
				bubbles: true,
				cancelable: true,
				key: isMac ? 'Meta' : 'Control',
				code: isMac ? 'MetaLeft' : 'ControlLeft',
				location: window.KeyboardEvent.DOM_KEY_LOCATION_LEFT,
				getModifierState: () => false,
				charCode: 0,
				keyCode: isMac ? 93 : 17,
				which: isMac ? 93 : 17,
			} ),
		);
	} );
}

module.exports = {
    pushToFacebook,
    scrapListingsFromFacebook,
    updateListings,
    loginToFacebook,
    updateAvailability,
    checkForFlags
};
