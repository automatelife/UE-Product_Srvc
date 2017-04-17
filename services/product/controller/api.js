/**
 * Created by borzou on 1/29/17.
 */
var respond = require('../../helper');
var send = require('../../callback');
var Promise = require('bluebird');
var product = Promise.promisifyAll(require('./product'));
var config = require('../../../config');
var Intent = Promise.promisifyAll(require('../../events/controller/event'));
var log = require('../../log/controller/log');
var readyEvents = require('../../../events');

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
        if(req.user.role!=1) respond.sendUnauthorized(res);
        if(!req.body.name) respond.sendJson(res, send.fail417('Name is a required input'));
        if(!req.body.slug) req.body['slug'] = req.body.name.trim().toLowerCase().replace(/ /g, "_").replace(/\./g, "").replace(/!/g, "").replace(/\?/g, "").replace(/{/g, "").replace(/}/g, "");
        req.body["owner"] = req.user._id;
        product.postProductAsync(req.body)
            .then(function(output){
                return respond.sendJson(res, output)})
            .catch(function(error){
                //if(error.stack) console.log(error.stack);
                return respond.sendJson(res, error);
            });
    },
    returnProductSlugHook: function(req, res){
        if(req.query.code!=config.webhook) return respond.sendUnauthorized(res);
        product.returnProductSlugAsync(req.params.slug, true)
            .then(function(output){
                return respond.sendJson(res, output)})
            .catch(function(error){
                return respond.sendJson(res, error);
            });
    },
    returnProductSlug: function(req, res, next){
        if(req.user.role!=1) return respond.sendUnauthorized(res);
        product.returnProductSlugAsync(req.params.slug, req.query.active)
            .then(function(output){
                return respond.sendJson(res, output)})
            .catch(function(error){
                next();
            });
    },
    returnProduct: function(req, res){
        if(req.user.role!=1) return respond.sendUnauthorized(res);
        product.returnProductAsync(req.params.id)
            .then(function(output){
                return respond.sendJson(res, output)})
            .catch(function(error){
                return respond.sendJson(res, error);
            });
    },
    findOneAndUpdate: function(req, res){
        if(req.user.role!=1) return respond.sendUnauthorized(res);
        var sendOut = {};
        var eventRec = [];
        if(req.body["_id"]) delete req.body._id;
        product.returnProductAsync(req.params.id)
            .then(function(prod){
                if(!req.body.name && !req.body.slug && typeof req.body.active === 'undefined') return 'SAFE';
                var output = [];
                readyEvents.productUpdates(req.body, prod.data).forEach(function(event){
                    output.push(product.prepareIntentAsync(event));
                });

                return Promise.all(output);
            })
            .then(function(results){
                if(!results) return send.fail500('Intent not written');
                if(results.length != readyEvents.productUpdatesCount() && results!='SAFE') return send.fail500('All events were not saved, aborting update');
                if(results!='SAFE') eventRec = results;
                return product.findOneAndUpdateAsync(req.params.id, req.body)
            })
            .then(function(output){
                sendOut = output;
                return eventRec;
            })
            .each(function(event){
                Intent.processEvent(event._id, function (err, record) {
                    if (err) log.error('An event may not have been processed', err);
                });
            })
            .then(function(output){
                return respond.sendJson(res, sendOut);
            })
            .catch(function(error){
                eventRec.forEach(function(event){
                    Intent.eventIntentRollBack(event, function (err, record) {
                        if (err) log.error('An event may not have been processed', err);
                    });
                });
                return respond.sendJson(res, error);
            });
    },
    deleteProduct: function(req, res){
        if(req.user.role!=1) return respond.sendUnauthorized(res);
        var sendOut = {};
        var eventRec = [];
        product.returnProductAsync(req.params.id)
            .then(function(prod){
                var output = [];
                readyEvents.productUpdates({active: false}, prod.data).forEach(function(event){
                    output.push(product.prepareIntentAsync(event));
                });

                return Promise.all(output);
            })
            .then(function(results){
                if(!results) return send.fail500('Intent not written');
                if(results.length != readyEvents.productUpdatesCount()) return send.fail500('All events were not saved, aborting update');
                eventRec = results;
                return product.findOneAndUpdateAsync(req.params.id, {active: false})
            })
            .then(function(output){
                sendOut = output;
                return eventRec;
            })
            .each(function(event){
                Intent.processEvent(event._id, function (err, record) {
                    if (err) log.error('An event may not have been processed', err);
                });
            })
            .then(function(output){
                return respond.sendJson(res, sendOut);
            })
            .catch(function(error){
                console.log(error);
                eventRec.forEach(function(event){
                    Intent.eventIntentRollBack(event, function (err, record) {
                        if (err) log.error('An event may not have been processed', err);
                    });
                });
                return respond.sendJson(res, error);
            });
    }
};

module.exports = productApi;