/**
 * Created by borzou on 1/29/17.
 */
import respond from '../../helper';

import send from '../../callback';
import Promiseb from 'bluebird';
const product = Promiseb.promisifyAll(require('./product').default);
import config from '../../../config';
const Intent = Promiseb.promisifyAll(require('../../events/controller/event').default);
import log from '../../log/controller/log';
import readyEvents from '../../../events';
import auth from '../../auth/controller/auth';

export default {
	getProducts(req, res) {
		product.getProductsAsync()
			.then(output => respond.sendJson(res, output))
			.catch(error => //if(error.stack) console.log(error.stack);
				respond.sendJson(res, error));
	},
    getPublicProducts(req, res) {
        product.getPublicProducts()
            .then(output => respond.sendJson(res, output))
            .catch(error => //if(error.stack) console.log(error.stack);
                respond.sendJson(res, error));
	},
	postProduct(req, res) {
		if(!req.body.name) respond.sendJson(res, send.fail417('Name is a required input'));
		if(!req.body.slug) req.body['slug'] = req.body.name.trim().toLowerCase().replace(/ /g, '_').replace(/\./g, '').replace(/!/g, '').replace(/\?/g, '').replace(/{/g, '').replace(/}/g, '');
		if (req.body.enable_first_user) delete req.body.enable_first_user;
		req.body['creator'] = req.user._id;
		product.postProductAsync(req.body)
			.then(output => respond.sendJson(res, output))
			.catch(error => //if(error.stack) console.log(error.stack);
				respond.sendJson(res, error));
	},
	returnProductSlugHook(req, res) {
		if(req.query.code!==config.webhook) return respond.sendUnauthorized(res);
		product.returnProductSlugAsync(req.params.slug, true)
			.then(output => respond.sendJson(res, output))
			.catch(error => respond.sendJson(res, error));
	},
	returnProductSlug(req, res, next) {
		product.returnProductSlugAsync(req.params.slug, req.query.active)
			.then((output) => {
                if (!auth.thisValidProductAdmin(req.user, output.data.slug)) return respond.sendUnauthorized(res);
				return respond.sendJson(res, output)
            })
			.catch((error) => {
				console.error(error);
				next();
			});
	},
	returnProduct(req, res) {
		product.returnProductAsync(req.params.id)
			.then((output) => {
                if (!auth.thisValidProductAdmin(req.user, output.data.slug)) return respond.sendUnauthorized(res);
				return respond.sendJson(res, output)
            })
			.catch(error => respond.sendJson(res, error));
	},
	findOneAndUpdate(req, res) {
		let sendOut = {};
		let eventRec = [];
		if(req.body['_id']) delete req.body._id;
        if (req.body.enable_first_user) delete req.body.enable_first_user;
		product.returnProductAsync(req.params.id)
			.then((prod) => {
                if (!auth.thisValidProductAdmin(req.user, prod.data.slug)) return 'unauthorized';

				if(!req.body.name && !req.body.slug && typeof req.body.active === 'undefined') return 'SAFE';
				const output = [];
				readyEvents.productUpdates(req.body, prod.data).forEach(event => {
					output.push(product.prepareIntentAsync(event));
				});

				return Promiseb.all(output);
			})
			.then(results => {
				if(results === 'unauthorized') return send.fail401();
				if(!results) return send.fail500('Intent not written');
				if(results.length !== readyEvents.productUpdatesCount() && results!=='SAFE') return send.fail500('All events were not saved, aborting update');
				if(results!=='SAFE') eventRec = results;
				return product.findOneAndUpdateAsync(req.params.id, req.body);
			})
			.then(output => {
				sendOut = output;
				return eventRec;
			})
			.each(event => {
				Intent.processEvent(event._id, err => {
					if (err) log.error('An event may not have been processed', err);
				});
			})
			.then(() => respond.sendJson(res, sendOut))
			.catch(error => {
				eventRec.forEach(event => {
					Intent.eventIntentRollBack(event, err => {
						if (err) log.error('An event may not have been processed', err);
					});
				});
				return respond.sendJson(res, error);
			});
	},
	changeFirstUserUpdate(req, res) {
		if (req.user.role !== 1) return respond.sendUnauthorized(res);
		const options = {
			id: req.params.id,
			set: (req.params.option === 'true')
        };
		product.changeFirstUserUpdate(options)
            .then(output => respond.sendJson(res, output))
            .catch(error => //if(error.stack) console.log(error.stack);
                respond.sendJson(res, error));
	},
	deleteProduct(req, res) {
		let sendOut = {};
		let eventRec = [];
		product.returnProductAsync(req.params.id)
			.then(prod => {
                if (!auth.thisValidProductAdmin(req.user, prod.data.slug)) return 'unauthorized';
				const output = [];
				readyEvents.productUpdates({active: false}, prod.data).forEach(event => {
					output.push(product.prepareIntentAsync(event));
				});

				return Promiseb.all(output);
			})
			.then(results => {
				if(results === 'unauthorized') return send.fail401();
				if(!results) return send.fail500('Intent not written');
				if(results.length !== readyEvents.productUpdatesCount()) return send.fail500('All events were not saved, aborting update');
				eventRec = results;
				return product.findOneAndUpdateAsync(req.params.id, {active: false});
			})
			.then(output => {
				sendOut = output;
				return eventRec;
			})
			.each(event => {
				Intent.processEvent(event._id, err => {
					if (err) log.error('An event may not have been processed', err);
				});
			})
			.then(() => respond.sendJson(res, sendOut))
			.catch(error => {
				console.error(error);
				eventRec.forEach(event => {
					Intent.eventIntentRollBack(event, err => {
						if (err) log.error('An event may not have been processed', err);
					});
				});
				return respond.sendJson(res, error);
			});
	},
    getPublicProduct (req, res) {
		product.getPublicProduct(req.params.dns)
			.then(result => respond.sendJson(res, result))
			.catch(error => respond.sendJson(res, error));
	}
};