"use strict";
const request = require('request'),
    config = require("../../config");

module.exports = class GraphAPi {
    //Call Needed APIs
    static callSendAPI(requestBody) {
        // Send the HTTP request to the Messenger Platform
        request(
            {
                uri: `${config.mPlatfom}/me/messages`,
                qs: {
                    access_token: config.pageAccesToken
                },
                method: "POST",
                json: requestBody
            },
            error => {
                if (error) {
                    console.error("Unable to send message:", error);
                }
            }
        );
    }

    static callMessengerProfileAPI(requestBody) {
        // Send the HTTP request to the Messenger Profile API
        request(
            {
                uri: `${config.mPlatfom}/me/messenger_profile`,
                qs: {
                    access_token: config.pageAccesToken
                },
                method: "POST",
                json: requestBody
            },
            (error, _res, body) => {
                if (!error) {
                    console.log("Request sent:", body);
                } else {
                    console.error("Unable to send message:", error);
                }
            }
        );
    }

    static callHandoverProtocolAPI(requestBody) {
        // Send the HTTP request to the Messenger Platform
        request(
            {
                uri: `${config.mPlatfom}/me/pass_thread_control`,
                qs: {
                    access_token: config.pageAccesToken
                },
                method: "POST",
                json: requestBody
            },
            error => {
                if (error) {
                    console.error("Unable to send message:", error);
                }
            }
        );
    }
}