/**
 * Created by borzou on 9/28/16.
 */
var callbackFactory = {
    success: function(message){
        return {
            err: null,
            data: (message) ? message : 'success'
        }
    },
    successSaved: function(saved){
        return {
            err: null,
            data: saved
        }
    },
    fail: function(code, message){
        return {
            err: code,
            data: message
        }
    },
    fail400: function(message){
        return {
            err: 400,
            data: (message) ? message : 'There was a problem with one of your inputs.'
        }
    },
    fail401: function(message){
        return {
            err: 401,
            data: 'Unauthorized' || message
        }
    },
    fail403: function(message){
        return {
            err: 403,
            data: (message) ? message : 'Request forbidden'
        }
    },
    fail404: function(message){
        return {
            err: 404,
            data: (message) ? message : 'Resource not found.'
        }
    },
    fail417: function(message){
        return {
            err: 417,
            data: (message) ? message : 'Some of the data you submitted is incorrect.'
        }
    },
    fail409: function(message){
        return {
            err: 409,
            data: (message) ? message : 'There was a data conflict with your input.'
        }
    },
    fail500: function(message){
        return {
            err: 500,
            data: (message) ? message : 'There was an unknown server error.'
        }
    },
    failErr: function(err){
        return {
            err: 500,
            data: {
                code: err.code,
                message: err.message || err
            }
        }
    }
};

module.exports = callbackFactory;