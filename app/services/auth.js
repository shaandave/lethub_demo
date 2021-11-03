const axios = require('axios').default;
const Store = require('electron-store');
const config = require('../config/config');
const {scheduleHangWorkaround} = require('../tools/scheduleHangWorkaround');
// Import events module
const common = require('./common');
const commonEmitter = common.commonEmitter;

/**
 * Refreshes the auth token 
 * 
 * @returns the response object on success, null if failed
 */
async function refreshAuthToken() {
    return new Promise (async (resolve, reject) => {
        console.log("Refreshing Auth Token");
        const urlPublic = `${config.LETHUB_API_BASE_URL}/public/refresh`;
        //const urlPublic = `http://localhost:3000/public/refresh`
        
        //Init storage
        const store = new Store();

        scheduleHangWorkaround();
        axios.post(urlPublic,
            {
                refreshToken: store.get("refreshToken")
            }
        )
        .then((response) => {
            store.set('token', response.data.token);
            store.set('refreshToken', response.data.refreshToken);
            //Send tokens to FE
            commonEmitter.emit('refreshToken', {token: response.data.token, refreshToken: response.data.refreshToken});
            
            resolve(response);
        })
        .catch((error) => {
            console.log("ERROR IN refreshAuthToken(): ",error);
            reject();
        })
    })
    
}

module.exports = {refreshAuthToken}