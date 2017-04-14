/**
 * Created by borzou on 4/2/17.
 */

var Promise = require('bluebird');
var Intent = Promise.promisifyAll(require('../model/intent'));
var request = Promise.promisify(require('request'));
var send = require('../../callback');
var log = require('../../log/controller/log');
var moment = require('moment');

var eventFactory = {
    createIntent: function(options, cb){
        var intent = new Intent(options);

        intent.saveAsync()
            .then(function(result){
                return cb(null, result);
            })
            .catch(function(error){
                return cb(send.fail500(error), null);
            })
    },
    createIntentBatch: function(batch, cb){
        Intent.insert(batch)
            .then(function(result){
                return cb(null, result);
            })
            .catch(function(error){
                return cb(send.fail500(error), null);
            })
    },
    findUnProcessed: function(cb){
        Intent.find({processed: false})
            .then(function(results){
                return cb(null, results);
            })
            .catch(function(error){
                return cb(send.fail500(error), null);
            })
    },
    markProcessed: function(id, cb){
        Intent.findOneAndUpdate({_id: id}, {processed: true}, {new:true})
            .then(function(result){
                return cb(null, result);
            })
            .catch(function(error){
                return cb(send.fail500(error), null);
            })
    },
    recordAck: function(id, response, cb){
        Intent.findOneAndUpdate({_id: id}, {response: response}, {new:true})
            .then(function(result){
                return cb(null, result);
            })
            .catch(function(error){
                return cb(send.fail500(error), null);
            })
    },
    getEvent: function(id, cb){
        Intent.findOne({_id:id})
            .then(function(result){
                return cb(null, result);
            })
            .catch(function(error){
                return cb(send.fail500(error), null);
            })
    },
    processEvent: function(id, cb){
        var respAck = {};
        Intent.findOne({_id:id})
            .then(function(event){
                if(!event) {
                    return cb('No such event', null);
                }
                return request(event.request)
            })
            .then(function(response){
                if(response.statusCode!=200) return cb('Unable to complete event', null);
                respAck = response.body;
                var completeThis = Promise.promisify(eventFactory.markProcessed);
                return completeThis(id);
            })
            .then(function(completed){
                if(!completed) return cb('Unable to mark this event complete. It may be repeated.', null);
                var record = Promise.promisify(eventFactory.recordAck);
                return record(id, respAck);
            })
            .then(function(output){
                return cb(null, output)
            })
            .catch(function(error){
                return cb(send.fail500(error), null);
            })
    },
    checkAndProcessAllIntent: function(cb){
        Intent.find({processed: false})
            .then(function(all){
                return all;
            })
            .each(function(event){
                eventFactory.processEvent(event._id, function(err, result){
                    if(err) log.error('Error processing event '+event._id+' at '+moment(),format('MMMM Do YYYY, hh:mm:ss a'), err);
                })
            })
            .then(function(results){
                return cb(null, send.success());
            })
            .catch(function(error){
                return cb(send.fail500(error), null);
            })
    },
    eventIntentRollBack: function(event, cb){
        Intent.findOneAndRemove({_id: event._id})
            .then(function(results){
                return cb(null, send.success());
            })
            .catch(function(error){
                return cb(send.fail500(error), null);
            })
    }
};

module.exports = eventFactory;