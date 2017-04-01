/**
 * Created by borzou on 1/29/17.
 */

var Promise = require('bluebird');
var Product = Promise.promisifyAll(require('../model/product'));
var send = require('../../callback');

var productFactory = {
    getProducts: function(cb){
        Product.findAsync({})
            .then(function(results){
                return cb(null, send.success(results));
            })
            .catch(function(err){
                return cb(send.failErr(err), null);
            });
    },
    postProduct: function(options, cb){
        var product = new Product(options);

        product.save()
            .then(function(saved){return cb(null, send.success(saved));})
            .catch(function (err) {return cb(send.failErr(err), null);});
    },
    returnProductSlug: function(slug, active, cb){
        query = {slug:slug};
        if(active!=null) query['active'] = active;
        Product.findOne(query)
            .then(function(results){
                if(!results) cb(send.fail404('This product was not found'), null);
                return cb(null, send.success(results));
            })
            .catch(function(err){
                return cb(send.failErr(err), null);
            });
    }
};

module.exports = productFactory;