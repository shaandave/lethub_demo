const config = {
    ENV : `${process.env.ENV}`,
    DOWNLOAD_PICTURES_BASE_FILE_PATH: `${process.env.DOWNLOAD_PICTURES_BASE_FILE_PATH}`,
    LETHUB_API_BASE_URL: process.env.ENV === "DEV" ? "https://staging.lethub.co": "https://api.lethub.co",
    LETHUB_FB_LOG_SLACK_WEBHOOK: "https://hooks.slack.com/services/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",
    
}

module.exports = config;