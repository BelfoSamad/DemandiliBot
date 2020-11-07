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

    static getCurrOrder(ssid) {
        //TODO: Get last order of that ssid
        /*TODO: Based on order type:
            If info is empty: return state Info
            If email is empty: return state Email
            If info and email not empty: return confirmation
            + order id
            */
        return null;
    }

    static setInfo(order_id, info) {
        /* TODO: based on order type:
            info verification
            calculate and set price
        */
    }

    static setEmail(order_id, email) {
        //TODO: set email after checking if it works
        //TODO: change state of order to confirmation
    }

    static getPrice(order_id){
        //TODO: get price after order
        return 0;
    }

    static confirmOrder(id, attachment) {
        //TODO: add confirmation image
        //TODO: change state of order to pending
        return null;
    }
}