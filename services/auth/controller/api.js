/**
 * Created by borzou on 9/28/16.
 */
import helper from '../../helper';
import Promiseb from 'bluebird';
const auth = Promiseb.promisifyAll(require('./auth').default);

export default {
	authorize(req, res) {
		if(!req.body.code || !req.body.redirect_uri || !req.body.domain || !req.body.product) return helper.sendJson(res, {err: 417, data: 'code, redirectUrl, domain, and product are all required elements of the body.'});
		auth.requestTokenAsync(req.body, req.user)
			.then(function (output) {
				helper.sendJson(res, output);
			})
			.catch(function (error) {
				if (error.stack) console.error(error.stack);
				if(error.err===401) helper.sendUnauthorized(res);
				else helper.sendJson(res, error);
			});
	},
	validate(req, res) {
		delete req.user.password;
		helper.sendJson(res, {err:null, data: req.user});
	},
	isAuthenticated: auth.isBasicAuthenticated,
	isBearerAuthenticated: auth.isBearerAuthenticated
};
