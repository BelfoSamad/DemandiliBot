"use strict";
const request = require('request'),
    camelCase = require("camelcase"),
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

    //TODO: Change behavior
    //Get User Data
    static async getUserProfile(senderPsid) {
        try {
            const userProfile = await this.callUserProfileAPI(senderPsid);

            for (const key in userProfile) {
                const camelizedKey = camelCase(key);
                const value = userProfile[key];
                delete userProfile[key];
                userProfile[camelizedKey] = value;
            }

            return userProfile;
        } catch (err) {
            console.log("Fetch failed:", err);
        }
    }

    static callUserProfileAPI(senderPsid) {
        return new Promise(function (resolve, reject) {
            let body = [];

            // Send the HTTP request to the Graph API
            request({
                uri: `${config.mPlatfom}/${senderPsid}`,
                qs: {
                    access_token: config.pageAccesToken,
                    fields: "first_name, last_name, gender, locale, timezone"
                },
                method: "GET"
            })
                .on("response", function (response) {
                    // console.log(response.statusCode);

                    if (response.statusCode !== 200) {
                        reject(Error(response.statusCode));
                    }
                })
                .on("data", function (chunk) {
                    body.push(chunk);
                })
                .on("error", function (error) {
                    console.error("Unable to fetch profile:" + error);
                    reject(Error("Network Error"));
                })
                .on("end", () => {
                    body = Buffer.concat(body).toString();
                    // console.log(JSON.parse(body));

                    resolve(JSON.parse(body));
                });
        });
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