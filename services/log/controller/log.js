/**
 * Created by borzou on 10/23/16.
 */

var Promise = require('bluebird');
var Log = Promise.promisifyAll(require('../model/log'));
var send = require('../../callback');

var logFactory = {
    enterLog: function(options, cb){
        var log = new Log({
            message: options.message,
            code: options.code,
            data: options.data
        });

        log.saveAsync()
            .then(function(saved){return cb(null, send.successSaved(saved));})
            .catch(function (err) {return cb(send.failErr(err), null);});

    },
    asyncEnterLog: function(message, code, data){
        var log = new Log({
            message: message,
            code: code,
            data: data
        });

        log.saveAsync()
            .then(function(saved){
                //return cb(null, send.successSaved(saved));
            })
            .catch(function (err) {
                console.log(err);
                //return cb(send.failErr(err), null);
            });
    },
    simpleLog: function(data){
        //will phase this out...
        var log = new Log({
            message: data,
            code: 'NOTIFICATION'
        });

        log.save(function(err){
            if(err) console.log(err);
        });
    },
    notify: function(message, data){
        var log = new Log({
            message: message,
            code: 'NOTIFICATION',
            data: data
        });
        log.save(function(err){
            if(err) console.log(err);
        });
    },
    error: function(message, data){
        var log = new Log({
            message: message,
            code: 'ERROR',
            data: data
        });
        log.save(function(err){
            if(err) console.log(err);
        });
    },
    success: function(message, data){
        var log = new Log({
            message: message,
            code: 'SUCCESS',
            data: data
        });
        log.save(function(err){
            if(err) console.log(err);
        });
    },
    unexpected: function(message, data){
        var log = new Log({
            message: message,
            code: 'UNEXPECTED',
            data: data
        });
        log.save(function(err){
            if(err) console.log(err);
        });
    },
    getLogs: function(cb){
        Log.find({}).sort({created: -1}).limit(600)
            .then(function(logs){
                return cb(null, send.success(logs));
            })
            .catch(function(err){
                return cb(send.failErr(err), null);
            });
    },
    getLogsRange: function(options, cb){
        var greater = new Date(options.greater);
        var less = new Date(options.less);
        Log.find({"created": {"$gte": greater, "$lte": less}}).sort('-created')
            .then(function(logs){
                return cb(null, send.success(logs));
            })
            .catch(function(err){
                return cb(send.failErr(err), null);
            });
    },
    getCode: function(code, cb){
        Log.find({code: code}).sort({created: -1})
            .then(function(logs){
                return cb(null, send.success(logs));
            })
            .catch(function(err){
                return cb(send.failErr(err), null);
            });
    },
    search: function(q, cb){
        Log.searchAsync(q, {code: 1, message: 1, data: 1}, {conditions: {code: {$exists: true}}, sort: {created: -1}, limit: 60})
            .then(function(result){
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    }
};

module.exports = logFactory;