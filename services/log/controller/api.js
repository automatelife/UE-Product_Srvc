/**
 * Created by borzou on 10/23/16.
 */
import respond from '../../helper';

import Promiseb from 'bluebird';
const Log = Promiseb.promisifyAll(require('./log').default);
import send from '../../callback';

export default {
	logDefinitions(req, res) {
		const output = {
			err: null,
			data: {
				default_codes: ['NOTIFICATION', 'ERROR', 'SUCCESS', 'UNEXPECTED'],
				date_range: {
					greater: 'mm/dd/yyyy',
					less: 'mm/dd/yyyy'
				},
				custom_codes: 'There may be custom codes that you as the admin have utilized, you will have to know them to search for them.',
				time_to_live: 'Logs expire after 30 days'
			}
		};
		return respond.sendJson(res, output);
	},
	newLog(req, res) {
		if(req.user.role !== 1) return respond.sendUnauthorized(res);
		Log.enterLogAsync(req.body)
			.then(output => respond.sendJson(res, output))
			.catch(error => {
				if(error.stack) console.info(error.stack);
				return respond.sendJson(res, error);
			});
	},
	returnLogs(req, res) {
		if(req.user.role !== 1) return respond.sendUnauthorized(res);
		Log.getLogsAsync()
			.then(output => respond.sendJson(res, output))
			.catch(error => {
				if(error.stack) console.info(error.stack);
				return respond.sendJson(res, error);
			});
	},
	returnRange(req, res) {
		if(req.user.role !== 1) return respond.sendUnauthorized(res);
		Log.getLogsRangeAsync(req.body)
			.then(output => respond.sendJson(res, output))
			.catch(error => {
				if(error.stack) console.info(error.stack);
				return respond.sendJson(res, error);
			});
	},
	returnByCode(req, res) {
		if(req.user.role !== 1) return respond.sendUnauthorized(res);
		Log.getCodeAsync(req.params.code)
			.then(output => respond.sendJson(res, output))
			.catch(error => {
				if (error.stack) console.info(error.stack);
				return respond.sendJson(res, error);
			});
	},
	search(req, res) {
		if(req.user.role !== 1) return respond.sendUnauthorized(res);
		if(!req.query.q) return respond.sendJson(res, send.fail417('missing a search term'));
		Log.searchAsync(req.query.q)
			.then(output => respond.sendJson(res, output))
			.catch(error => {
				if (error.stack) console.info(error.stack);
				return respond.sendJson(res, error);
			});
	}
};