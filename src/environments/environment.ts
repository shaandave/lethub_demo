export const APP_CONFIG = {
  production: false,
  environment: "LOCAL",
};

// const baseUrl = "http://localhost:3000";
// const baseUrlFrontend = "http://localhost:4200";
// const baseUrlChatBot = "http://localhost:9000";
// const baseUrlUnitFilter = "http://localhost:3001";

// const baseUrl = 'https://api.lethub.co';
// const baseUrlFrontend = 'https://app.lethub.co';
// const baseUrlChatBot = 'https://river.lethub.co';
// const baseUrlUnitFilter = 'https://api.lethub.co';

const baseUrl = 'https://staging.lethub.co';
const baseUrlFrontend = 'https://staging.lethub.co';
const baseUrlChatBot = 'https://river.lethub.co';
const baseUrlUnitFilter = 'https://staging.lethub.co';

export const environment = {
  production: true,
  baseUrlUnitFilter,
  baseUrlFrontend,
  baseUrlChatBot,
  baseUrl: baseUrl,
  publicUrl: `${baseUrl}/public`,
  privateUrl: `${baseUrl}/private`,
};
