"use strict";

const
    Response = require("./response"),
    GraphAPi = require("./graph-api"),
    payloads = require("./payloads"),
    Order = require("../order"),
    Product = require("../product"),
    config = require("../../config"),
    i18n = require("../../i18n.config");
const { response } = require("express");

module.exports = class Receive {

    static handleMessage(user, event) {
        if (event.message) {
            let message = event.message;
            if (message.quick_reply) Receive.handlePayloads(message.quick_reply.payload, user, message.text);
            else if (message.text) Receive.handleTextMessages(message.text, user);
            else if (message.attachments) Receive.handleAttachements(message.attachments[0], user);
        } else if (event.postback) {
            let postback = event.postback;
            if (postback.referral && postback.referral.type == "OPEN_THREAD") Receive.handleReferral(postback.referral, user);
            else Receive.handlePayloads(postback.payload, user);
        } else if (event.referral) Receive.handleReferral(event.referral.ref, user);
    }

    static handlePayloads(payload, user, text) {
        switch(payload){

        }
    }

    static handleTextMessages(message, user) {
    }

    static handleAttachements(attachment, user) {
    }

    static handleReferral(ref, user) {
    }

    static handleHandoverControl(user) {
    }

    static sendResponse(responses, user) {
    }

}