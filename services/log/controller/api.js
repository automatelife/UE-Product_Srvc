/**
 * Created by borzou on 10/23/16.
 */
var respond = require('../../helper');
var Promise = require('bluebird');
var Log = Promise.promisifyAll(require('./log'));
var send = require('../../callback');

var logApi = {
    logDefinitions: function(req, res){
        var output = {
            err: null,
            data: {
                default_codes: ['NOTIFICATION', 'ERROR', 'SUCCESS', 'UNEXPECTED'],
                date_range: {
                    greater: 'mm/dd/yyyy',
                    less: 'mm/dd/yyyy'
                },
                custom_codes: 'There may be custom codes that you as the admin have utilized, you will have to know them to search for them.',
                time_to_live: 'Logs expire after 30 days'
            }
        };
        return respond.sendJson(res, output);
    },
    newLog: function(req, res){
        if(req.user.role != 1) return respond.sendUnauthorized(res);
        Log.enterLogAsync(req.body)
            .then(function(output){
                return respond.sendJson(res, output)})
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return respond.sendJson(res, error);
            });
    },
    returnLogs: function(req, res){
        if(req.user.role != 1) return respond.sendUnauthorized(res);
        Log.getLogsAsync()
            .then(function(output){
                return respond.sendJson(res, output)})
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return respond.sendJson(res, error);
            });
    },
    returnRange: function(req, res){
        if(req.user.role != 1) return respond.sendUnauthorized(res);
        Log.getLogsRangeAsync(req.body)
            .then(function(output){
                return respond.sendJson(res, output)})
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return respond.sendJson(res, error);
            });
    },
    returnByCode: function(req, res) {
        if(req.user.role != 1) return respond.sendUnauthorized(res);
        Log.getCodeAsync(req.params.code)
            .then(function (output) {
                return respond.sendJson(res, output)
            })
            .catch(function (error) {
                if (error.stack) console.log(error.stack);
                return respond.sendJson(res, error);
            });
    },
    search: function(req, res){
        if(req.user.role != 1) return respond.sendUnauthorized(res);
        if(!req.query.q) return respond.sendJson(res, send.fail417("missing a search term"));
        Log.searchAsync(req.query.q)
            .then(function (output) {
                return respond.sendJson(res, output)
            })
            .catch(function (error) {
                if (error.stack) console.log(error.stack);
                return respond.sendJson(res, error);
            });
    }
};

module.exports = logApi;