/**
 * Created by borzou on 4/2/17.
 */

var Promise = require('bluebird');
var Intent = Promise.promisifyAll(require('../model/intent'));
var request = Promise.promisify(require('request'));
var send = require('../../callback');

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
    }
};

module.exports = eventFactory;