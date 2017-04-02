/**
 * Created by borzou on 4/2/17.
 */
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var moment = require('moment');

// Define our user schema
var intentSchema = new mongoose.Schema({
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
intentSchema.pre('save', function(callback) {
    return callback();
});

// Export the Mongoose model
module.exports = mongoose.model('Intent', intentSchema);