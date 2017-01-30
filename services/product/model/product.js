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
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    test_url: {
        type: String,
        required: true
    },
    test_mode: {
        type: Boolean,
        default: false
    },
    owner: {
        type: String,
        required: true
    },
    domains: {
        type: Array,
        required: false
    },
    created: {
        type: Date,
        default: moment().format()
    },
    meta: {
        type: Object,
        required: false
    }
});

// Execute before each user.save() call
productSchema.pre('save', function(callback) {
    //console.log('log saved');
    return callback();
});

// Export the Mongoose model
module.exports = mongoose.model('Product', productSchema);