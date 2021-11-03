const axios = require('axios');
const config = require('../config/config');
const Store = require('electron-store');
const store = new Store();
const {scheduleHangWorkaround} = require('../tools/scheduleHangWorkaround');


async function messageLethubSlack(msg) {
    return new Promise (async (resolve, reject) => {
        const url = config.LETHUB_FB_LOG_SLACK_WEBHOOK;
        scheduleHangWorkaround();
            axios.post(url,
                {
                    blocks: [
                        {
                            type: "header",
                            text: {
                                type: "plain_text",
                                text: "Error Notification"
                            }
                        },

                        {
                            type: "divider"
                        },

                        {
                            type: "section",
                            fields: [
                                {
                                    type: "mrkdwn",
                                    text: `*UserId*: ${store.get("userId")}\n\n*Message*: ${msg}`
                                },
                            ]
                        }
                    ],
                    
                }
            )
            .then((response) => {
                console.log(response.data);
                
                resolve(response.data);
            })
            .catch((error) => {
                console.log("ERROR IN messageLethubSlack(): ",error);
                resolve(error);
            })
    })
    
}

module.exports = {
    messageLethubSlack
}