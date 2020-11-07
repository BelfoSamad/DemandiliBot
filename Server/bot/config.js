"use strict";

// Use dotenv to read .env vars into Node
require("dotenv").config();

// Required environment variables
const ENV_VARS = [
    "PAGE_ID",
    "APP_ID",
    "PAGE_ACCESS_TOKEN",
    "APP_SECRET",
    "VERIFY_TOKEN",
    "APP_URL"
];

const IMGS = [
    {"s": ""},
    {"s": ""},
    {"s": ""},
]

module.exports = {
    // Messenger Platform API
    mPlatformDomain: "https://graph.facebook.com",
    mPlatformVersion: "v8.0",

    // Page and Application information
    pageId: process.env.PAGE_ID,
    appId: process.env.APP_ID,
    inboxId: process.env.INBOX_ID,
    pageAccesToken: process.env.PAGE_ACCESS_TOKEN,
    appSecret: process.env.APP_SECRET,
    verifyToken: process.env.VERIFY_TOKEN,
    details: process.env.DETAILS,

    // URL of your app domain
    appUrl: process.env.APP_URL,

    // Preferred port (default to 3000)
    port: process.env.PORT || 3000,

    get mPlatfom() {
        return this.mPlatformDomain + "/" + this.mPlatformVersion;
    },

    // URL of your webhook endpoint
    get webhookUrl() {
        return this.appUrl + "/webhook";
    },

    get whitelistedDomains() {
        return [this.appUrl];
    },

    //TODO: Add Other Configurations
    get getImages(platform) {
        return IMGS[platform];
    }
};