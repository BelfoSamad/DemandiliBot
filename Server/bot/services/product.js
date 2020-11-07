"use strict"

module.exports = class Product {

    static getCatalogue(){
        //TODO: get products from database
        //TODO: sort (cards, accounts) by grouping the platforms/number of (cards, accounts)
        let products = [];
        return products;
    }

    static getProductByPlatform(platform){
        let products = [];
        //TODO: get products from database by platform
        return products;
    }

    static getProductById(id){
        //TODO: get product by id from database
        return null;
    }
}