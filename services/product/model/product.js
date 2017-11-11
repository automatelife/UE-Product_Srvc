/**
 * Created by borzou on 1/29/17.
 */
import Promiseb from 'bluebird';

const mongoose = Promiseb.promisifyAll(require('mongoose'));
import moment from 'moment';

// Define our user schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    roles: {
        type: Array,
        default: ['admin']
    },
    created: {
        type: Date,
        default: moment().format()
    },
    private: {
        type: Boolean,
        default: false
    },
    private_code: {
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        default: true
    },
    meta: {
        type: Object,
        required: false
    }
});

// Execute before each user.save() call
productSchema.pre('save', callback => callback());

// Export the Mongoose model
export default mongoose.model('Product', productSchema);