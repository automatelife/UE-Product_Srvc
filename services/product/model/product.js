/**
 * Created by borzou on 1/29/17.
 */
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var moment = require('moment');

// Define our user schema
var productSchema = new mongoose.Schema({
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
productSchema.pre('save', function(callback) {
    return callback();
});

// Export the Mongoose model
module.exports = mongoose.model('Product', productSchema);