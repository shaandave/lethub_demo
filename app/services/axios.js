const axios = require('axios');
const config = require('../config/config');
const {refreshAuthToken} = require('./auth');
const Store = require('electron-store');
const store = new Store();

//Create Lethub API instance
const lethubAPI = axios.create({
    baseURL: `${config.LETHUB_API_BASE_URL}`,
    timeout: 10000, 
    headers: { 
        "Content-Type": "application/json" 
    }
});

//Lethub API request interceptor
lethubAPI.interceptors.request.use(
    (config) => {
      const token = store.get('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}` ;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

//Lethub API response interceptor
lethubAPI.interceptors.response.use(
    (response) => {
      return response.data;
    },
    async (error) => {
      const originalConfig = error.config;
  
      if (error.response) {
        // Access Token was expired
        if (error.response.status === 401 && !originalConfig._retry) {
          console.log("Token Expired...");
          originalConfig._retry = true;
  
          try {
            console.log("Refreshing Token...");
            const refreshResponse = await refreshAuthToken();
            if(refreshResponse){
              const { token, refreshToken } = refreshResponse.data;
              store.set('token', token);
              store.set('refreshToken', refreshToken);

              lethubAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;
              console.log("Token Refreshed!");
            }
            
            return lethubAPI(originalConfig);
          } catch (_error) {
            console.log(_error);
            if (_error.response && _error.response.data) {
              return Promise.reject(_error.response.data);
            }
  
            return Promise.reject(_error);
          }
        }
  
        if (error.response.status === 403 && error.response.data) {
          return Promise.reject(error.response.data);
        }
      }
  
      return Promise.reject(error);
    }
);

module.exports = {
  lethubAPI: lethubAPI
};