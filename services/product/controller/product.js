/**
 * Created by borzou on 1/29/17.
 */

import Promiseb from 'bluebird';

const Product = Promiseb.promisifyAll(require('../model/product').default);
import send from '../../callback';
const Intent = Promiseb.promisifyAll(require('../../events/controller/event').default);

export default {
	getProducts(cb) {
		Product.findAsync({})
			.then(results => cb(null, send.success(results)))
			.catch(err => cb(send.failErr(err), null));
	},
	postProduct(options, cb) {
		const product = new Product(options);

		product.save()
			.then(saved => cb(null, send.success(saved)))
			.catch(err => cb(send.failErr(err), null));
	},
	returnProductSlug(slug, active, cb) {
		const query = {slug};
		if(active!==null) query['active'] = active;
		Product.findOne(query)
			.then(results => {
				if(!results) cb(send.fail404('This product was not found'), null);
				return cb(null, send.success(results));
			})
			.catch(err => cb(send.failErr(err), null));
	},
	returnProduct(id, cb) {
		Product.findOne({_id:id})
			.then(results => {
				if(!results) cb(send.fail404('This product was not found'), null);
				return cb(null, send.success(results));
			})
			.catch(err => cb(send.failErr(err), null));
	},
	findOneAndUpdate(id, options, cb) {
		Product.findOneAndUpdate({_id: id}, options, {new: true})
			.then(result => {
				if(!result) return cb(null, null);
				return cb(null, send.success(result));
			})
			.catch(error => cb(send.failErr(error), null));
	},
	prepareIntent(event, cb) {
		Intent.createIntentAsync(event)
			.then(event => {
				if(!event) return cb('Event Intent Not Created', null);
				return cb(null, event);
			})
			.catch(error => cb(send.failErr(error), null));
	}
};