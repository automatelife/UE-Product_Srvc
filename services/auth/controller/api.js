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
    superAndProductAdminsOnly (req, res, next) {
		if(auth.validProductAdmin(req.user)) return next();
		return helper.sendUnauthorized(res);
	},
    superAndThisProductAdminsOnly (req, res, next) {
		let product = '';
		if(req.params.product_slug) product = req.params.product_slug;
		else if(req.params.slug) product = req.params.slug;
		else if(req.body.product_slug) product = req.body.product_slug;
		else if(req.body.slug) product = req.body.slug;
		else if(req.query.product_slug) product = req.query.product_slug;
		else if(req.query.slug) product = req.query.slug;
        if(auth.thisValidProductAdmin(req.user, product)) return next();
        return helper.sendUnauthorized(res);
    },
	superAdminOnly (req, res, next) {
		if(req.user.role === 1) return next();
        return helper.sendUnauthorized(res);
	},
	anyAdmin (req, res, next) {
		if(auth.validAdmin(req.user)) return next();
		return helper.sendUnauthorized(res);
	},
	superAndDomainAdminsOnly (req, res, next) {
		if(auth.validDomainAdmin(req.user)) return next();
		return helper.sendUnauthorized(res);
	},
	superAndThisDomainAdminsOnly (req, res, next) {
		let domain = '';
		if(req.params.domain_slug) domain = req.params.domain_slug;
		else if(req.params.slug) domain = req.params.slug;
		else if(req.body.domain_slug) domain = req.body.domain_slug;
		else if(req.body.slug) domain = req.body.slug;
		else if(req.query.domain_slug) domain = req.query.domain_slug;
		else if(req.query.slug) domain = req.query.slug;
		if(auth.thisValidDomainAdmin(req.user, domain)) return next();
		return helper.sendUnauthorized(res);
	},
	isAuthenticated: auth.isBasicAuthenticated,
	isBearerAuthenticated: auth.isBearerAuthenticated,
    isBasicOrBearer: auth.isBasicOrBearer
};
