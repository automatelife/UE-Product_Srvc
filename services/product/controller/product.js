/**
 * Created by borzou on 1/29/17.
 */

import Promiseb from 'bluebird';
import log from '../../../services/log/controller/log';
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
		if(!options.private_code) options.private_code = uid(512);
		const product = new Product(options);

		product.save()
			.then((saved) => {
                if(!options.private_code) delete saved.privcate_code;
				return cb(null, send.success(saved))
            })
			.catch(err => cb(send.failErr(err), null));
	},
	returnProductSlug(slug, active, cb) {
		const query = {slug};
		if(active) query['active'] = active;
		Product.findOne(query)
			.then(results => {
				if(!results) {
					return cb(send.fail404('This product was not found'), null);
                }
				return cb(null, send.success(results));
			})
			.catch((err) => {
				return cb(send.failErr(err), null)
            });
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
    changeFirstUserUpdate(options) {
		return new Promise((resolve, reject) => {
			Product.findOneAndUpdate({ _id: options.id }, { enable_first_user: options.set }, { new: true })
                .then(result => {
                    if(!result) return reject(send.fail404('Product Not Found'));
                    return resolve(send.success(result));
                })
                .catch(error => {
                	log.error(error);
                	return reject(send.failErr(error));
                });
		})
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

function uid (len) {
    let buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (let i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}