/**
 * Created by borzou on 1/29/17.
 */

var Promise = require('bluebird');
var Product = Promise.promisifyAll(require('../model/product'));
var send = require('../../callback');
var Intent = Promise.promisifyAll(require('../../events/controller/event'));
var config = require('../../../config');

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
    },
    returnProduct: function(id, cb){
        Product.findOne({_id:id})
            .then(function(results){
                if(!results) cb(send.fail404('This product was not found'), null);
                return cb(null, send.success(results));
            })
            .catch(function(err){
                return cb(send.failErr(err), null);
            });
    },
    findOneAndUpdate: function(id, options, cb){
        Product.findOneAndUpdate({_id: id}, options, {new: true})
            .then(function(result){
                if(!result) return cb(null, null);
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    prepareIntent: function(event, cb){
        Intent.createIntentAsync(event)
            .then(function(event){
                if(!event) return cb('Event Intent Not Created', null);
                return cb(null, event);
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            });
    }
};

module.exports = productFactory;