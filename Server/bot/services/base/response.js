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
        let elements = [];
        products.forEach(product => {
            elements.push({
                title: product.platform,
                subtitle: product.details,
                image_url: product.image,
                buttons: [{
                    type: "postback",
                    title: "Order",
                    payload: product.payload
                }]
            });
        });

        return {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: elements
                }
            }
        }
    }

    static genReceiptTemplate(order) {
        let elements = [];
        elements.push({
            title: order.platform,
            subtitle: order.details,
            quantity: order.quantity,
            price: order.price,
            currency: "DZD",
            image_url: order.image
        });

        let request = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "receipt",
                    recipient_name: order.recipient_name,
                    order_number: order.order_number,
                    currency: "DZD",
                    payment_method: order.payment_method,
                    timestamp: order.date,
                    summary: {
                        subtotal: order.price,
                        shipping_cost: 0,
                        total_cost: order.price
                    },
                    elements: elements
                }
            }
        };
        return request;
    }
}