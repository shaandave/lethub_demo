import {expect} from 'chai';
import { SpectronClient } from 'spectron';

import commonSetup from './common-setup';


describe('angular-electron App', function() {

  commonSetup.apply(this);

  let client: SpectronClient;

  beforeEach(function() {
    client = this.app.client;
  });

  it('creates initial windows', async function() {
    const count = await client.getWindowCount();
    expect(count).to.equal(1);
  });

  it('Login', async function() {

    let status = await loginTest(process.env.TEST_EMAIL, process.env.TEST_PASSWORD, client);
    
    expect(status).to.equal(true);
  });

  // it('should display message saying App works !', async function() {
  //   const elem = await client.$('app-home h1');
  //   const text = await elem.getText();
  //   expect(text).to.equal('App works !');
  // });

});

describe('Test 1', () => {
  commonSetup.apply(this);

  let client: SpectronClient;

  beforeEach(async function() {
    client = this.app.client;
    await loginTest(process.env.TEST_EMAIL, process.env.TEST_PASSWORD, client);
  });

  it('Navigates to on-market tab', async () => {
    console.log(process.env.LETHUB_API_BASE_URL);
    
    const onMarket = await client.$("span=On-market Units");
    await onMarket.click();

    //units-vacant__title
    const syncTitle = await client.$("h3.units-vacant__title");
    let syncTitleDisplayed = await syncTitle.isDisplayed();
    
    expect(syncTitleDisplayed).to.equal(true);

    // let test = await addressToCoordinates("930 Yates");
    // console.log(test);
    
  });

  it('Succesfully pushes listings to FB', async() => {
    const onMarket = await client.$("span=On-market Units");
    await onMarket.click();

    const signOutFB = await client.$("button=Sign Out - Facebook");

    let signOutFBStatus = await signOutFB.isExisting();
    const syncFB = await client.$("button=Sync to Facebook");
    
    if(signOutFBStatus){
      await syncFB.click();
    } else {
      const signInFB = await client.$("button=Sign In - Facebook");
      await signInFB.click();
      //await syncFB.click();

    }
    //await signOutFB.click();

    
  });

});

// Functions
async function loginTest(email:String, password: String, client: SpectronClient) {
  
  //Get input elements
  const emailEl = await client.$('input[name="email"]');
  const passwordEl = await client.$('input[name="password"]');

  await emailEl.setValue(email);
  await passwordEl.setValue(password);

  const loginButton = await client.$("#signin");
  await loginButton.click();
  const usernameHeader = await client.$(".header__user-name");
  const usernameHeaderStatus = await usernameHeader.isExisting();

  return usernameHeaderStatus;
}
