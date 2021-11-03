import { app, BrowserWindow, screen, ipcMain } from 'electron';

import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';
import { autoUpdater } from 'electron-updater';

import * as url from 'url';
require('dotenv').config();
const Store = require('electron-store');

import {listToFacebook, login, logout} from './services/facebook';
import {checkIfFileExists, showNotification} from './services/utilityFunctions';
import {createSyncToFBCronJob} from './jobs/syncFBListings';
import {getSyncStatus} from './services/sync';


const config = require('./config/config');

const common = require('./services/common');
const commonEmitter = common.commonEmitter;


// Initialize remote module
require('@electron/remote/main').initialize();

//Global Variables
let cronSyncProgressStatus = false;
let FBLoginStatus = false;
let syncToFBCronJobCreated = false;

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    icon: path.join(__dirname, '/icon/Sign_color1.png'),
    //autoHideMenuBar: true,
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
      enableRemoteModule: true, // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
      webSecurity: false
    },
  });

  //open a url in the browser
  win.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });
  win.webContents.openDevTools();
  if (serve) {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}
ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  win.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update_downloaded');
});
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', async () => {
    setTimeout(createWindow, 400);

    //Check for updates and notify user
    autoUpdater.checkForUpdatesAndNotify();

    let store = new Store();
    //Turn off logs on prod
    console.log(config.ENV);
    console.log(config.DOWNLOAD_PICTURES_BASE_FILE_PATH);
    console.log(config.LETHUB_API_BASE_URL);
    console.log(config.LETHUB_FB_LOG_SLACK_WEBHOOK);

    if (config.ENV === 'PROD') {
      console.log = function () { };
    }
    
    //Check if the user is logged in
    if(store.get("token") && store.get("refreshToken")){
      

      //Start auto sync cron Job
      const cookiesPath = path.resolve( os.homedir(), 'lethub', 'FB', 'cookies.json');
      FBLoginStatus = await checkIfFileExists(cookiesPath);
      let syncStatus = await getSyncStatus();
      
      if(FBLoginStatus && syncStatus && store.get("userId")){
        console.log("starting cron");

        syncToFBCronJob = await createSyncToFBCronJob();
        if(syncToFBCronJob){
          syncToFBCronJobCreated = true;
          syncToFBCronJob.start();
        }

        console.log("Status of sync JOB", syncToFBCronJobCreated);
      }
    }
    
    

    //Create lethub folder
    const lethubDir = path.resolve( os.homedir(), 'lethub');
    await fs.ensureDir(lethubDir);

    //Create lethub logs folder
    const lethubLogsDir = path.resolve( os.homedir(), 'lethub', 'logs');
    await fs.ensureDir(lethubLogsDir);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  //Init storage
  const store = new Store();

  //Init cron job
  let syncToFBCronJob;

  //sync cron job progress status
  commonEmitter.on('syncCronJob', function (data) {
    switch (data) {
      case "syncStart":
        cronSyncProgressStatus = true;
        showNotification("LetHub","Auto-sync to Facebook started");
        break;

      case "syncEnd":
        cronSyncProgressStatus = false;
        showNotification("LetHub","Auto-sync to Facebook completed");
        break;

      default:
        cronSyncProgressStatus = false;
        showNotification("LetHub","Error in syncing to Facebook");
        break;
    }

    win.webContents.send('checkIfSyncingReply', cronSyncProgressStatus);
  });

  //Send refreshed tokens to FE
  commonEmitter.on('refreshToken', function (data) {
    console.log("event recived");
    win.webContents.send('refreshTokenBE', data);
  });

  //Send sync status progress
  commonEmitter.on('syncStatus', function (data) {
    console.log(`sync status recived ${data}`);
    win.webContents.send('syncStatus', data);
  });

  //Get refreshed token from FE
  ipcMain.on('tokenRefreshed', async (event, args) => {
    let tokenData = args[0];

    store.set('token', tokenData.token);
    store.set('refreshToken', tokenData.refreshToken);
  })

  //Save Auth Tokens to local storage and start cron job
  // on login
  ipcMain.on('login', async (event, arg) => {
    try {
      let userInfo =  arg[0];
      console.log("Got User info", userInfo);

      store.set('token', userInfo.token);
      store.set('refreshToken', userInfo.refreshToken);
      store.set('userId', userInfo.userId);


      //Start auto sync cron Job
      const cookiesPath = path.resolve( os.homedir(), 'lethub', 'FB', 'cookies.json');
      FBLoginStatus = await checkIfFileExists(cookiesPath);
      let syncStatus = await getSyncStatus();
      
      if(FBLoginStatus && syncStatus && store.get("userId")){
        console.log("starting cron");

        syncToFBCronJob = await createSyncToFBCronJob();
        if(syncToFBCronJob){
          syncToFBCronJobCreated = true;
          syncToFBCronJob.start();
        }

        console.log("Status of sync JOB", syncToFBCronJobCreated);
      }

    } catch (error) {
      console.log(error);

    }
  })

  //On logout, destroy cron job
  ipcMain.on('logout', async (event, arg) =>{
    try {

      //Stop CronJob
      if(syncToFBCronJobCreated){
        console.log("destroying cron");
        syncToFBCronJob.destroy();
        syncToFBCronJobCreated = false;
      }

      //clear store
      store.clear();

    } catch (error) {
      console.log(error);

    }
  })

  //FB logout
  ipcMain.on('logoutOfFacebook', async (event, arg) => {
    try {
      console.log("Facebook Logout started");

      let loggedOut = await logout();
      FBLoginStatus = !loggedOut;

      //Destroy cron job if logged out of FB
      if(loggedOut){
        if(syncToFBCronJobCreated){
          console.log("destroying cron");
          syncToFBCronJob.destroy();
          syncToFBCronJobCreated = false;
        }

        event.sender.send('logoutOfFacebookReply','success');
      }
      console.log("Facebook Logout done");
    } catch (error) {
      console.log(error);
      event.sender.send('logoutOfFacebookReply', 'failure');

    }

  })


  //FB login
  ipcMain.on('loginToFacebook', async (event, arg) => {
    try {
      console.log("Facebook Login started");

      FBLoginStatus = await login();
      if(FBLoginStatus){
        event.sender.send('loginToFacebookReply','success');
      }
      console.log("Facebook Login done");
    } catch (error) {
      console.log(error);
      event.sender.send('loginToFacebookReply', 'failure');

    }

  })


  //Check if signed into FB
  ipcMain.on('isFBSignedIn', async (event, arg) => {
    try {

      const cookiesPath = path.resolve( os.homedir(), 'lethub', 'FB', 'cookies.json');
      FBLoginStatus = await checkIfFileExists(cookiesPath);

      if(FBLoginStatus){
        console.log("Sending FB Login Success Msg");

        event.sender.send('isFBSignedInReply','success');
      } else {
        event.sender.send('isFBSignedInReply', 'failure');

      }
    } catch (error) {
      event.sender.send('isFBSignedInReply', 'failure');
    }
  })

  //Facebook Script Endpoint
  ipcMain.on('facebook', async (event, arg) => {

    console.log("Running Facebook Script...");

    let unitIdList = arg[0];
    try {
      if(FBLoginStatus){

        //If a sync cron job has been created
        // stop it until the manual sync is completed
        // to avoid overlap
        if(syncToFBCronJobCreated){
          console.log("Stopping Overlap");

          syncToFBCronJob.destroy();
          syncToFBCronJobCreated = false;
        }
        
        if(!cronSyncProgressStatus){
          await listToFacebook(unitIdList);
        }

        //Start CronJob
        let syncStatus = await getSyncStatus();
        if(syncStatus){
          syncToFBCronJob = await createSyncToFBCronJob();
            if(syncToFBCronJob){
              console.log("Cron Job created, starting");

              syncToFBCronJobCreated = true;
              syncToFBCronJob.start();
            }

        }


      } else {
        console.log("Not logged into FB");
      }

    } catch (error) {
      console.log(error);
    }
    console.log("Finished Facebook Script!");

  })

} catch (e) {
  // Catch Error
  // throw e;
  console.log(e);
}
