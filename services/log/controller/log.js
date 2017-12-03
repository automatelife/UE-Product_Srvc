/**
 * Created by borzou on 10/23/16.
 */

import Promiseb from 'bluebird';

const Log = Promiseb.promisifyAll(require('../model/log').default);
import send from '../../callback';

export default {
	enterLog(options, cb) {
		const log = new Log({
			message: options.message,
			code: options.code,
			data: options.data
		});

		log.save()
			.then(saved => cb(null, send.success(saved)))
			.catch(err => cb(send.failErr(err), null));

	},
	asyncEnterLog(message, code, data) {
		const log = new Log({
			message,
			code,
			data
		});

		log.save()
			.then(() => {
				//return cb(null, send.successSaved(saved));
			})
			.catch(err => {
				console.info(err);
				//return cb(send.failErr(err), null);
			});
	},
	simpleLog(data) {
		//will phase this out...
		const log = new Log({
			message: data,
			code: 'NOTIFICATION'
		});

		log.save(err => {
			if(err) console.info(err);
		});
	},
	notify(message, data) {
		const log = new Log({
			message,
			code: 'NOTIFICATION',
			data
		});
		log.save(err => {
			if(err) console.info(err);
		});
	},
	error(message, data) {
		const log = new Log({
			message,
			code: 'ERROR',
			data
		});
		log.save(err => {
			if(err) console.info(err);
		});
	},
	success(message, data) {
		const log = new Log({
			message,
			code: 'SUCCESS',
			data
		});
		log.save(err => {
			if(err) console.info(err);
		});
	},
	unexpected(message, data) {
		const log = new Log({
			message,
			code: 'UNEXPECTED',
			data
		});
		log.save(err => {
			if(err) console.info(err);
		});
	},
	getLogs(cb) {
		Log.find({}).sort({created: -1}).limit(600)
			.then(logs => cb(null, send.success(logs)))
			.catch(err => cb(send.failErr(err), null));
	},
	getLogsRange(options, cb) {
		const greater = new Date(options.greater);
		const less = new Date(options.less);
		Log.find({'created': {'$gte': greater, '$lte': less}}).sort('-created')
			.then(logs => cb(null, send.success(logs)))
			.catch(err => cb(send.failErr(err), null));
	},
	getCode(code, cb) {
		Log.find({code}).sort({created: -1})
			.then(logs => cb(null, send.success(logs)))
			.catch(err => cb(send.failErr(err), null));
	},
	search(q, cb) {
		Log.searchAsync(q, {code: 1, message: 1, data: 1}, {conditions: {code: {$exists: true}}, sort: {created: -1}, limit: 60})
			.then(result => cb(null, send.success(result)))
			.catch(error => cb(send.failErr(error), null));
	}
};