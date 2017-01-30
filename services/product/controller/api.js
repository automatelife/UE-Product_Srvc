/**
 * Created by borzou on 1/29/17.
 */
var helper = require('../../helper');
var Promise = require('bluebird');
var product = Promise.promisifyAll(require('./product'));

var productApi = {
    getProducts: function(req, res){
        product.getProductsAsync()
            .then(function(output){
                helper.sendJson(res, output)})
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                helper.sendJson(res, error);
            });
    },
    postProduct: function(req, res){
        product.postProductAsync(req.body)
            .then(function(output){
                helper.sendJson(res, output)})
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                helper.sendJson(res, error);
            });
    }
};

module.exports = productApi;