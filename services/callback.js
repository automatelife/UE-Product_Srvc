/**
 * Created by borzou on 9/28/16.
 */

const callbackFactory = {
	success(message, type) {
		return {
			type,
			data: (message) || 'success'
		};
	},
	set(code, message, type) {
		return {
			code,
			type,
			data: message
		};
	},
	fail400(message) {
		return {
			code: 400,
			data: (message) || 'There was a problem with one of your inputs.'
		};
	},
	fail401(message) {
		return {
			code: 401,
			data: 'Unauthorized' || message
		};
	},
	fail403(message) {
		return {
			code: 403,
			data: (message) || 'Request forbidden'
		};
	},
	fail404(message) {
		return {
			code: 404,
			data: (message) || 'Not found.'
		};
	},
	fail405(message) {
		return {
			code: 405,
			data: (message) || 'Invalid input'
		};
	},
	fail409(message) {
		return {
			code: 409,
			data: (message) || 'There was a data conflict with your input.'
		};
	},
	fail500(message) {
		return {
			code: 500,
			data: (message) || 'There was an unknown server code.'
		};
	},
	failErr(err) {
		return {
			code: 500,
			data: {
				code: err.code,
				message: err.message || err
			}
		};
	}
};

export default callbackFactory;