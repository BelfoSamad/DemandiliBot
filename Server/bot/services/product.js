"use strict"

module.exports = class Product {

    static getCatalogue() {
        //TODO: get products from database
        //TODO: sort (cards, accounts) by grouping the platforms/number of (cards, accounts)
        let products = [
            {
                id: 1,
                type: "Balance",
                platform: "Paysera",
                balance: 200,
                currency: "euro",
                rate_change: 206
            },
            {
                id: 2,
                type: "Balance",
                platform: "Paysera",
                balance: 300,
                currency: "euro",
                rate_change: 207
            },
            {
                id: 3,
                type: "Balance",
                platform: "Paysera",
                balance: 100,
                currency: "euro",
                rate_change: 206
            },
            {
                platform: "Spotify",
                count: 12,
            },
            {
                platform: "Google Play",
                count: 12,
            },
        ];
        return products;
    }

    static getProductByPlatform(platform) {
        //TODO: get products from database by platform
        let products = [
            {
                id: 4,
                type: "Gift Card",
                platform: "Google Play",
                balance: "50$",
                codes: ["qqq", "sss", "fff"]
            },
            {
                id: 5,
                type: "Gift Card",
                platform: "Google Play",
                balance: "60$",
                codes: ["qqq", "sss", "fff"]
            },
            {
                id: 6,
                type: "Gift Card",
                platform: "Spotify",
                time: 6,
                accounts: ["qqq", "sss", "fff"]
            }
        ];
        return products;
    }

    static getProductById(id) {
        //TODO: get product by id from database
        return {
            platform: "Paysera",
            type: "Balance",
            balance: 100,
            currency: "euro",
            rate_change: 206
        };
    }
}