"use strict"

module.exports = class Order {
    static initOrder(ssid, product_id) {
        /* TODO: Create New Order and Set:
            - ssid
            - timestamp
            - state
            - product_id
        */
    }

    //msg: Temp
    static getCurrOrder(ssid, msg) {
        //TODO: Get last order of that ssid
        /*TODO: Based on order type:
            If info is empty: return state Info
            If email is empty: return state Email
            If info and email not empty: return confirmation
            + order id
            */
        let curr = {
            state: "Info",
            id: 1
        }
        if (msg == "a")
            curr[state] = "Email";
        if (msg == "b")
            curr[state] = "Confirmation";
        return curr;
    }

    static setInfo(order_id, info) {
        /* TODO: based on order type:
            info verification
            calculate and set price
        */
    }

    static setEmail(order_id, email) {
        //TODO: set email after checking if it works
    }

    static setPaymentMethod(order_id, method) {
        //TODO: set payment method
        //TODO: change state of order to confirmation
    }

    static getPrice(order_id) {
        //TODO: get price after order
        return 200;
    }

    static confirmOrder(id, attachment) {
        //TODO: add confirmation image
        //TODO: change state of order to pending
        return {
            id: id,
            product_id: 1,
            price: 300,
            payment_method: "CCP",
            timestamp: new Date().getTime(),
            balance: 100
        };
    }
}