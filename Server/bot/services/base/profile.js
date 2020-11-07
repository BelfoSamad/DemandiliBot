"use strict";

// Imports dependencies
const GraphAPi = require("./graph-api"),
    i18n = require("../../i18n.config"),
    config = require("../../config"),
    payloads = require("./payloads"),
    locales = i18n.getLocales();

module.exports = class Profile {
    //Setup Profile stuff
    setupProfile() {
        let profilePayload = {
            ...this.getGettingStarted(),
            ...this.getGreeting(),
            ...this.getPersistentMenu(),
            ...this.getWhitelistedDomains()
        }

        console.log(profilePayload);

        GraphAPi.callMessengerProfileAPI(profilePayload);
    }

    getGettingStarted() {
        return {
            get_started: {
                payload: payloads.GET_STARTED
            }
        };
    }

    getGreeting() {
        //TODO: Change
        let greetings = [{
            locale: "en_US",
            text: "Hey What's up, welcome to the bot... it's just for testing"
        }];

        /*
        for (let locale of locales) {
            let param = locale === "en_US" ? "default" : locale;
            i18n.setLocale(locale);
            greetings.push({
                locale: param,
                text: i18n.__("get_started.welcome", {
                    user_first_name: "{{user_fullname}}"
                })
            });
        }*/

        return {
            greeting: greetings
        };
    }

    getPersistentMenu() {
        //TODO: Change
        let menu = [
            {
                locale: "en_US",
                composer_input_disabled: false,
                call_to_actions: [
                    {
                        title: "Start Over",
                        type: "postback",
                        payload: payloads.GET_STARTED
                    },
                ]
            }
        ];
        /*
        for (let locale of locales) {
            let param = locale === "en_US" ? "default" : locale;
            i18n.setLocale(locale);
            menu.push({
                locale: param,
                composer_input_disabled: false,
                call_to_actions: [
                    {
                        title: i18n.__("actions.start_over"),
                        type: "postback",
                        payload: payloads.GET_STARTED
                    },
                    {
                        title: i18n.__("actions.change_language"),
                        type: "postback",
                        payload: payloads.CHANGE_LOCALE
                    },
                    {
                        title: i18n.__("actions.my_orders"),
                        type: "postback",
                        payload: payloads.MY_ORDERS
                    },
                    {
                        title: i18n.__("actions.help"),
                        type: "postback",
                        payload: payloads.TALK_TO_AGENT
                    }
                ]
            });

        }*/

        return {
            persistent_menu: menu
        };
    }

    getWhitelistedDomains() {
        return {
            whitelisted_domains: config.whitelistedDomains
        };
    }
}