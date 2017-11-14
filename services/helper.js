/**
 * Created by borzou on 9/27/16.
 */
import mongoose from 'mongoose';

mongoose.Promise = require('bluebird');
const conn = mongoose.connection;

export default {
	sendJson(res, output) {
		let status;
		if (!output.code || output.code === null)status = 200;
		else status = output.code;
		const resp = {
			code: output.code,
			type: output.type,
			data: output.data,
			message: output.message
		};
		res.status(status).json(resp);
	},
	sendUnauthorized(res) {
		res.status(401).send('Unauthorized');
	},
	mongoStatus() {
		return {
			config: conn.config,
			replica: conn.replica,
			name: conn.name,
			options: conn.options,
			readyState: conn._readyState,
			opened: conn._hasOpened
		};
	},
	isJson(check) {
		try {
			JSON.parse(check);
			return true;
		} catch(e) {
			return false;
		}
	}
};