"use strict";

const i18n = require("../../i18n.config"),
    payloads = require("./payloads");

module.exports = class Response {
    static genTextMessage(message) {
        return {
            text: message
        }
    }

    static genQuickReplies(title, options) {
        let replies = [];
        for (let i in options) {
            replies.push({
                content_type: "text",
                title: options[i].option,
                payload: options[i].payload
            });
        }

        return {
            text: title,
            quick_replies: replies
        }
    }

    static genButtonTemplate(title, actions) {
        return {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: title,
                    buttons: actions
                }
            }
        }
    }

    static genProductsTemplate(products) {
    }

    static genReceiptTemplate(order) {
    }
}