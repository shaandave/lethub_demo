export const APP_CONFIG = {
  production: false,
  environment: 'WEB'
};


const baseUrl = 'https://staging.lethub.co';
// const baseUrl = 'http://localhost:3000';
const baseUrlFrontend = 'https://app.lethub.co';
const baseUrlChatBot = 'https://river.lethub.co';
const baseUrlUnitFilter = 'https://api.lethub.co';

export const environment = {
  production: true,
  baseUrlUnitFilter,
  baseUrlFrontend,
  baseUrlChatBot,
  baseUrl: baseUrl,
  publicUrl: `${baseUrl}/public`,
  privateUrl: `${baseUrl}/private`,
};
