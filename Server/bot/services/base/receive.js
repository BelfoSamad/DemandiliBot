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
        let responses = [];
        switch (payload) {
            case payloads.GET_STARTED:
                responses.push(Response.genTextMessage("Choose product to order!"));
                let products = [];
                Product.getCatalogue().forEach(product => {
                    switch (product.type) {
                        case "Balance":
                            products.push({
                                platform: product.platform,
                                details: "Balance: " + product.balance + "\n"
                                    + "Currency: " + product.currency + "\n"
                                    + "Rate Change: " + product.rate_change,
                                image: config.getImages(product.platform),
                                payload: payloads.ADD_ORDER + "-" + product.id
                            });
                            break;
                        default:
                            products.push({
                                platform: product.platform,
                                details: "Count: " + product.count,
                                image: config.getImages(product.platform),
                                payload: payloads.EXPAND_PRODUCT + "-" + product.platform
                            });
                            break;
                    }
                });
                responses.push(Response.genProductsTemplate(products));
                break;
            case payloads.CCP:
                let curr_order = Order.getCurrOrder(user.id);
                curr_order.setPaymentMethod("CCP");
                responses.push(Response.genTextMessage("Send money to this ccp: 123456 and send image confirmarion of the receipt, if you need more infos check the link https://www.facebook.com"));
                response.push(Response.genTextMessage("Please send the confirmation image"));
                break;
            case payloads.BMOB:
                let curr_order = Order.getCurrOrder(user.id);
                curr_order.setPaymentMethod("Baridimob");
                responses.push(Response.genTextMessage("Send money to this baridimob: 123456 and send image confirmarion of the receipt, if you need more infos check the link https://www.facebook.com"));
                response.push(Response.genTextMessage("Please send the confirmation image"));
                break;
            default:
                let pld = "";
                let data = "";

                switch (pld) {
                    case payloads.EXPAND_PRODUCT:
                        let products = [];
                        Product.getProductByPlatform(data).forEach(product => {
                            switch (product.type) {
                                case "Gift Card":
                                    products.push({
                                        platform: product.platform,
                                        details: "Balance: " + product.balance + "\n"
                                            + "Count: " + product.codes.length,
                                        image: config.getImages(product.platform),
                                        payload: payloads.ADD_ORDER + "-" + product.id
                                    });
                                    break;
                                case "Account":
                                    products.push({
                                        platform: product.platform,
                                        details: "Months: " + product.time + "\n"
                                        + "Count: " + product.accounts.length,
                                        image: config.getImages(product.platform),
                                        payload: payloads.ADD_ORDER + "-" + product.id
                                    });
                                    break;
                            }
                        });
                        responses.push(Response.genProductsTemplate(products));
                        break;
                    case payloads.ADD_ORDER:
                        Order.initOrder(user.id, data);
                        let product = Product.getProductById(data);
                        switch (product.type) {
                            case "Balance":
                                responses.push(Response.genTextMessage("How much you want?"));
                                break;
                            case "Gift Card":
                                responses.push(Response.genTextMessage("How much cards you want?"));
                                break;
                            case "Account":
                                responses.push(Response.genTextMessage("How much accounts you want?"));
                                break;
                        }
                        break;
                }
                break;
        }
        Receive.sendResponse(responses, user);
    }

    static handleTextMessages(message, user) {
        let responses = [];
        let curr_order = Order.getCurrOrder(user.id);
        switch (curr_order.state) {
            case "Info":
                Order.setInfo(curr_order.id, message);
                responses.push(Response.genTextMessage("What is your email?"));
                break;
            case "Email":
                Order.setEmail(curr_order.id, message);
                let price = Order.getPrice(curr_order.id);
                responses.push(Response.genTextMessage("The Price: " + price))
                responses.push(Response.genQuickReplies("Do you want to pay with CCP or BaridiMob", [
                    {
                        type: "postback",
                        title: "CCP",
                        payload: payloads.CCP
                    },
                    {
                        type: "postback",
                        title: "BaridiMob",
                        payload: payloads.BMOB

                    },
                    {
                        type: "postback",
                        title: "Cancel",
                        payload: payloads.CANCEL_ORDER
                    }
                ]))
                break;
        }
    }

    static handleAttachements(attachment, user) {
        let responses = [];
        let curr_order = Order.getCurrOrder(user.id);
        if (curr_order.state == "Confirmation") {
            let order = Order.confirmOrder(curr_order.id, attachment);
            let product = Product.getProductById(order.product.id);
            let receipt = {
                platform: product.platform,
                price: order.price,
                image: config.getImages(product.platform),
                recipient_name: user.last_name + " " + user.first_name,
                order_number: order.id,
                payment_method: order.payment_method,
                date: order.timestamp
            }
            switch (product.type) {
                case "Balance":
                    receipt["details"] = "Balance: " + product.balance + "\n"
                        + "Currency: " + product.currency + "\n"
                        + "Rate Change: " + product.rate_change;
                    receipt["quantity"] = order.balance;
                    break;
                case "Gift Card":
                    receipt["details"] = "Count: " + product.count;
                    receipt["quantity"] = order.codes.length;
                    break;
                case "Account":
                    receipt["details"] = "Months: " + product.time;
                    receipt["quantity"] = order.accounts.length;
                    break;
            }
            responses.push(Response.genReceiptTemplate(receipt));
            responses.push(Response.genButtonTemplate("Thanks for your order", [
                {
                    type: "postback",
                    title: "Start Over",
                    payload: payloads.GET_STARTED
                }
            ]));
        }
    }

    static handleReferral(ref, user) {
    }

    static handleHandoverControl(user) {
    }

    static sendResponse(responses, user) {
        let delay = 0;
        for (let response of responses) {
            // Construct the message body
            let requestBody = {
                recipient: {
                    id: user.psid
                },
                message: response
            };

            setTimeout(() => GraphAPi.callSendAPI(requestBody), delay * 2000);
            delay++;
        }
    }

}