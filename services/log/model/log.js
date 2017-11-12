/**
 * Created by borzou on 10/23/16.
 */

import Promiseb from 'bluebird';

const mongoose = Promiseb.promisifyAll(require('mongoose'));
import moment from 'moment';

// Define our user schema
const locSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: moment().format(),
        expires: '30d'
    },
    code: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: false
    }
});

// Execute before each user.save() call
locSchema.pre('save', callback => //console.log('log saved');
    callback());

// Export the Mongoose model
export default mongoose.model('Log', locSchema);