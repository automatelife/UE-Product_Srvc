/**
 * Created by borzou on 9/27/16.
 */

import passport from 'passport';
import Promiseb from 'bluebird';
import {BasicStrategy} from 'passport-http';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import Token from '../model/auth';
//const Token = Promiseb.promisifyAll(require('../model/auth').default);
import moment from 'moment';
import rq from 'request';
const request = Promiseb.promisify(rq);

/*
const request = Promiseb.promisify(require('request'));
Promiseb.promisifyAll(request);
*/

//const basicAuth = require('basic-auth'); //may not need this
import config from '../../../config';

import helper from '../../helper';

passport.use('basic', new BasicStrategy({
	passReqToCallback: true
},
(req, username, password, callback) => {
	let pSlug = null;
	if(req.body.product_slug) pSlug = req.body.product_slug;
	if(req.query.product_slug) pSlug = req.query.product_slug;
	if(req.params.product_slug) pSlug = req.params.product_slug;
	if(!pSlug) return callback(null, false);
	const reqOptions = {
		method: 'GET',
		uri: `${config.userApiServer}/api/${pSlug}/basicauth`,
		auth: {
			user: username,
			pass: password
		}
	};
	request(reqOptions)
		.then(response => {
			if(response.statusCode!==200) return callback(null, false);
			if(helper.isJson(response.body)){
				const returned = JSON.parse(response.body);
				try{
					return callback(null, returned.data);
				}catch(err){
					return callback(err, null);
				}
			}else return callback(null, false);
		})
		.catch(error => {
			error['detail'] = 'Basic Auth against UserAuth Service';
			return callback(error, null);
		});

}
));

passport.use('bearer', new BearerStrategy(
	(accessToken, callback) => {
		try {
			if (!accessToken) return callback(null, false);
			const fullToken = Buffer.from(accessToken.replace(/%3D/g, '='), 'base64').toString('ascii');
			const lookup = fullToken.split('.');
			if (!lookup.length >= 2) return callback(null, false);
			const userId = (lookup[0]) ? lookup[0] : null;
			const tokenVal = (lookup[1]) ? lookup[1] : null;
			const product =  (lookup[2]) ? lookup[2] : null;
			const domain = (lookup[3]) ? lookup[3] : null;

			if(!product) return callback(null, false);
			if(!domain) return callback(null, false);
			Token.findOne({ user_id: userId, product_slug: product, domain_slug: domain })
				.then(token => {
					if (!token) {
						getBearerToken(accessToken, (err, result) => callback(err, result));
					} else {
						token.verifyToken(tokenVal, (err, isMatch) => {
							if (err) return callback(null, false);
							if (isMatch) {
								token.user['token'] = accessToken;
								token.user['expires'] = moment(token.created).add(12, 'hours');
								token.user['token_created'] = token.created;
								return callback(null, token.user);
							} else {
								//getting token
								getBearerToken(accessToken, (err, result) => callback(err, result));
							}

						});
					}
				})
				.catch(error => {
					error['detail']='Bearer Auth from Domain Service';
					return callback(error, false);
				});
		}catch(error){
			error['detail']='Unhandled Error caught at Bearer Auth from Domain Service';
			return callback(error, false);
		}
	}
));

function getBearerToken(accessToken, callback){
	const fullToken = Buffer.from(accessToken.replace(/%3D/g, '='), 'base64').toString('ascii');
	const lookup = fullToken.split('.');
	const reqOptions = {
		method: 'GET',
		uri: `${config.authApiServer}/api/validate`,
		auth: {
			bearer: accessToken
		}
	};
	request(reqOptions)
		.then(response => {
			if (response.statusCode !== 200) return callback(null, false);
			const returned = (helper.isJson(response.body)) ? JSON.parse(response.body) : response.body;
			try {
				authFactory.saveToken(returned.data, {product: lookup[2] || null, domain: lookup[3] || null}, lookup[1], err => {
					console.error(err);
					callback(null, returned.data);
				}); //if (err) console.log('validated token but could not save - moving on.');

			} catch (err) {
				console.error(err);
				return callback(null, false);
			}
		})
		.catch(error => {
			error['detail'] = 'Bearer Auth from Domain Service';
			return callback(error, false);
		});
}

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

const authFactory = {
	isBearerAuthenticated: passport.authenticate('bearer', { session: false }),
	isBasicAuthenticated: passport.authenticate('basic', {session: false}),
	isBasicOrBearer: passport.authenticate(['basic', 'bearer'], {session: false}),
	saveToken(user, access, tokenVal, callback) {
		Token.findOneAndRemove({user_id: user._id, product_slug: access.product, domain_slug: access.domain})
			.then(() => {
				const tCreated = user.token_created;

				const temp = JSON.parse(JSON.stringify(user));
				delete temp.token;
				delete temp.token_created;
				delete temp.expires;


				const token = new Token({
					value: tokenVal,
					user_id: user._id,
					product_slug: access.product,
					domain_slug: access.domain,
					user: temp,
					created: tCreated
				});

				token.save()
					.then(saved => {
						callback(null, saved);
					})
					.catch(error => {
						callback(error, null);
					});
			})
			.catch(error => {
				callback(error, null);
			});

	},
    validProductAdmin (user) {
        if(user.role === 1) return true;
        else if(user.activity) if (user.activity.product) if(user.permissions) if(user.permissions.product) if(user.permissions.product[user.activity.product]) {
            return user.permissions.product[user.activity.product].admin;
        }
        return false;
    },
    validDomainAdmin (user) {
        if(user.role === 1) return true;
        else if(user.activity) if (user.activity.domain) if(user.permissions) if(user.permissions.domain) if(user.permissions.domain[user.activity.domain]) {
            return user.permissions.domain[user.activity.domain].admin;
        }
        return false;
    },
    validAdmin (user) {
        if(user.role === 1) return true;
        else if(this.validProductAdmin(user)) return true;
        else if(this.validDomainAdmin(user)) return true;
        return false;
    },
    thisValidProductAdmin (user, product) {
        if(user.role === 1) return true;
        else if(user.permissions) if(user.permissions.product) if(user.permissions.product[product]) {
            return user.permissions.product[product].admin;
        }
        return false;
    },
    thisValidDomainAdmin (user, domain) {
        if(user.role === 1) return true;
        else if(user.permissions) if(user.permissions.domain) if(user.permissions.domain[domain]) {
            return user.permissions.domain[domain].admin;
        }
        return false;
    },
};

export default authFactory;