/**
 * Created by borzou on 1/29/17.
 */
var respond = require('../../helper');
var send = require('../../callback');
var Promise = require('bluebird');
var product = Promise.promisifyAll(require('./product'));
var config = require('../../../config');

var productApi = {
    getProducts: function(req, res){
        if(req.user.role!=1) respond.sendUnauthorized(res);
        product.getProductsAsync()
            .then(function(output){
                return respond.sendJson(res, output)})
            .catch(function(error){
                //if(error.stack) console.log(error.stack);
                return respond.sendJson(res, error);
            });
    },
    postProduct: function(req, res){
        //if(req.user.role!=1) respond.sendUnauthorized(res);
        if(!req.body.name) respond.sendJson(res, send.fail417('Name is a required input'));
        if(!req.body.slug) req.body['slug'] = req.body.name.trim().toLowerCase().replace(/ /g, "_").replace(/\./g, "").replace(/!/g, "").replace(/\?/g, "").replace(/{/g, "").replace(/}/g, "");
        req.body["owner"] = 'testingIDWithThis'; //req.user._id;
        product.postProductAsync(req.body)
            .then(function(output){
                return respond.sendJson(res, output)})
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return respond.sendJson(res, error);
            });
    },
    returnProductSlug: function(req, res){
        if(!req.user && req.query.code!=config.webhook) respond.sendUnauthorized(res);
        if(req.user && req.user.role!=1) respond.sendUnauthorized(res);
        product.returnProductSlugAsync(req.params.slug, req.query.active)
            .then(function(output){
                return respond.sendJson(res, output)})
            .catch(function(error){
                return respond.sendJson(res, error); //later next for id
            });
    }
};

module.exports = productApi;