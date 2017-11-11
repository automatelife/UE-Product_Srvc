/**
 * Created by borzou on 4/2/17.
 */
import Promiseb from 'bluebird';

const mongoose = Promiseb.promisifyAll(require('mongoose'));
import moment from 'moment';

// Define our user schema
const intentSchema = new mongoose.Schema({
	product_id: {
		type: String,
		required: true
	},
	product_slug: {
		type: String,
		required: true
	},
	request: {
		type: Object,
		required: true
	},
	response: {
		type: Object,
		rquired: false
	},
	created: {
		type: Date,
		default: moment().format(),
		expires: '30d'
	},
	processed: {
		type: Boolean,
		default: false
	}
});

// Execute before each user.save() call
intentSchema.pre('save', callback => callback());

// Export the Mongoose model
export default mongoose.model('Intent', intentSchema);