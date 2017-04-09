/**
 * Created by borzou on 9/27/16.
 */
var passport = require('passport');
var Promise = require('bluebird');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var Token = Promise.promisifyAll(require('../model/auth'));
var moment = require('moment');
var request = Promise.promisify(require('request'));
Promise.promisifyAll(request);
//var basicAuth = require('basic-auth'); //may not need this
var config = require('../../../config');
var helper = require('../../helper');
var send = require('../../callback');

passport.use('basic', new BasicStrategy({
        passReqToCallback: true
    },
    function(req, username, password, callback) {
        var pSlug = null;
        if(req.body.product_slug) pSlug = req.body.product_slug;
        if(req.query.product_slug) pSlug = req.query.product_slug;
        if(req.params.product_slug) pSlug = req.params.product_slug;
        if(!pSlug) return callback(null, false);
        var reqOptions = {
            method: 'GET',
            uri: config.userApiServer+'/api/'+pSlug+'/basicauth',
            auth: {
                user: username,
                pass: password
            }
        };
        request(reqOptions)
            .then(function(response){
                if(response.statusCode!=200) return callback(null, false);
                if(helper.isJson(response.body)){
                    var returned = JSON.parse(response.body);
                    try{
                        return callback(null, returned.data);
                    }catch(err){
                        return callback(err, null);
                    }
                }else return callback(null, false);
            })
            .catch(function(error){
                error["detail"] = 'Basic Auth against UserAuth Service';
                return callback(error, null);
            });

    }
));

passport.use('bearer', new BearerStrategy(
    function(accessToken, callback) {
        try {
            if (!accessToken) return callback(null, false);
            var fullToken = Buffer.from(accessToken.replace(/%3D/g, '='), 'base64').toString('ascii');
            var lookup = fullToken.split('.');
            if (!lookup.length >= 2) return callback(null, false);
            var userId = (lookup[0]) ? lookup[0] : null;
            var tokenVal = (lookup[1]) ? lookup[1] : null;
            var product =  (lookup[2]) ? lookup[2] : null;
            var domain = (lookup[3]) ? lookup[3] : null;

            if(!product) return callback(null, false);
            if(!domain) return callback(null, false);
            Token.findOneAsync({ user_id: userId, product_slug: product, domain_slug: domain })
                .then(function (token) {
                    if (!token) {
                        getBearerToken(accessToken, function(err, result){
                            return callback(err, result);
                        })
                    } else {
                        token.verifyToken(tokenVal, function (err, isMatch) {
                            if (err) return callback(null, false);
                            if (isMatch) {
                                token.user["token"] = accessToken;
                                token.user["expires"] = moment(token.created).add(12, 'hours');
                                token.user["token_created"] = token.created;
                                return callback(null, token.user);
                            } else {
                                //getting token
                                getBearerToken(accessToken, function(err, result){
                                    return callback(err, result);
                                })
                            }

                        })
                    }
                })
                .catch(function (error) {
                    error["detail"]='Bearer Auth from Domain Service';
                    return callback(error, false);
                });
        }catch(error){
            error["detail"]='Unhandled Error caught at Bearer Auth from Domain Service';
            return callback(error, false);
        }
    }
));

function getBearerToken(accessToken, callback){
    var fullToken = Buffer.from(accessToken.replace(/%3D/g, '='), 'base64').toString('ascii');
    var lookup = fullToken.split('.');
    var reqOptions = {
        method: 'GET',
        uri: config.authApiServer + '/api/validate',
        auth: {
            bearer: accessToken
        }
    };
    request(reqOptions)
        .then(function (response) {
            if (response.statusCode != 200) return callback(null, false);
            var returned = (helper.isJson(response.body)) ? JSON.parse(response.body) : response.body;
            try {
                authFactory.saveToken(returned.data, {product: lookup[2] || null, domain: lookup[3] || null}, lookup[1], function (err, saved) {
                    //if (err) console.log('validated token but could not save - moving on.');
                    return callback(null, returned.data);
                });
            } catch (err) {
                console.log(err);
                return callback(null, false);
            }
        })
        .catch(function (error) {
            error["detail"] = 'Bearer Auth from Domain Service';
            return callback(error, false);
        });
}

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var authFactory = {
    isBearerAuthenticated: passport.authenticate('bearer', { session: false }),
    isBasicAuthenticated: passport.authenticate('basic', {session: false}),
    saveToken: function (user, access, tokenVal, callback){
        Token.findOneAndRemoveAsync({user_id: user._id, product_slug: access.product, domain_slug: access.domain})
            .then(function(result){
                var tCreated = user.token_created;

                var temp = JSON.parse(JSON.stringify(user));
                delete temp.token;
                delete temp.token_created;
                delete temp.expires;


                var token = new Token({
                    value: tokenVal,
                    user_id: user._id,
                    product_slug: access.product,
                    domain_slug: access.domain,
                    user: temp,
                    created: tCreated
                });

                token.saveAsync()
                    .then(function (saved) {
                        callback(null, saved);
                    })
                    .catch(function (error) {
                        callback(error, null);
                    });
            })
            .catch(function(error){
                callback(error, null);
            })

    }
};

module.exports = authFactory;