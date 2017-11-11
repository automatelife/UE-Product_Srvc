/**
 * Created by borzou on 4/2/17.
 */

import Promiseb from 'bluebird';

const Intent = Promiseb.promisifyAll(require('../model/intent').default);
import request from 'request';
//const request = Promiseb.promisify(require('request'));
import send from '../../callback';
import log from '../../log/controller/log';
import moment from 'moment';

const eventFactory = {
	createIntent(options, cb) {
		const intent = new Intent(options);

		intent.saveAsync()
			.then(result => cb(null, result))
			.catch(error => cb(send.fail500(error), null));
	},
	createIntentBatch(batch, cb) {
		Intent.insert(batch)
			.then(result => cb(null, result))
			.catch(error => cb(send.fail500(error), null));
	},
	findUnProcessed(cb) {
		Intent.find({processed: false})
			.then(results => cb(null, results))
			.catch(error => cb(send.fail500(error), null));
	},
	markProcessed(id, cb) {
		Intent.findOneAndUpdate({_id: id}, {processed: true}, {new:true})
			.then(result => cb(null, result))
			.catch(error => cb(send.fail500(error), null));
	},
	recordAck(id, response, cb) {
		Intent.findOneAndUpdate({_id: id}, {response}, {new:true})
			.then(result => cb(null, result))
			.catch(error => cb(send.fail500(error), null));
	},
	getEvent(id, cb) {
		Intent.findOne({_id:id})
			.then(result => cb(null, result))
			.catch(error => cb(send.fail500(error), null));
	},
	processEvent(id, cb) {
		let respAck = {};
		Intent.findOne({_id:id})
			.then(event => {
				if(!event) {
					return cb('No such event', null);
				}
				return request(event.request);
			})
			.then(response => {
				if(response.statusCode!=200) return cb('Unable to complete event', null);
				respAck = response.body;
				const completeThis = Promise.promisify(eventFactory.markProcessed);
				return completeThis(id);
			})
			.then(completed => {
				if(!completed) return cb('Unable to mark this event complete. It may be repeated.', null);
				const record = Promise.promisify(eventFactory.recordAck);
				return record(id, respAck);
			})
			.then(output => cb(null, output))
			.catch(error => {
				console.error(error);
				return cb(send.fail500(error), null);
			});
	},
	checkAndProcessAllIntent(cb) {
		Intent.find({processed: false})
			.then(all => all)
			.each(event => {
				eventFactory.processEvent(event._id, err => {
					if(err) log.error(`Error processing event at ${moment().format('MMMM Do YYYY, hh:mm:ss a')}`, {error: err, event});
					console.error(err);
				});
			})
			.then(() => cb(null, send.success()))
			.catch(error => cb(send.fail500(error), null));
	},
	eventIntentRollBack(event, cb) {
		Intent.findOneAndRemove({_id: event._id})
			.then(() => cb(null, send.success()))
			.catch(error => cb(send.fail500(error), null));
	}
};

export default eventFactory;