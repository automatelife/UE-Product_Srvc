/**
 * Created by borzou on 1/29/17.
 */
import mongoose from 'mongoose';
mongoose.Promise = Promise;
import moment from 'moment';

import config from '../../../config';

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
    logo: {
        type: String,
        default: config.defaultLogo
    },
    url: {
        type: String,
        required: true
    },
    // owner is depreciated and should be deleted in next version
    owner: {
        type: String,
        required: false
    },
    creator: {
        type: String,
        required: true
    },
    /**
     * This doesn't do anything... it is depreciated and should be removed in future versions
     */
    roles: {
        type: Array,
        default: ['admin']
    },
    created: {
        type: Date,
        default: moment().format()
    },
    // if set to true, we require the private_code below (with enable_first_user == true) or an invite (userauth managed) to register
    private: {
        type: Boolean,
        default: false
    },
    // this is an override to allow first user access. a 512 char key is auto generated to protect the funcitonality if one isn't provided
    private_code: {
        type: String,
        required: false
    },
    // if this is true, only admins can generate licenses
    license_lock: {
        type: Boolean,
        default: true
    },
    // this enables or disables the override. It should be disabled as soon as first user is enabled.
    enable_first_user: {
        type: Boolean,
        default: false
    },
    dnsRef: {
        type: String,
        required: true
    },
    vanity: {
        type: Boolean,
        default: false
    },
    brand: {
        brandName: String,
        primaryLogo: {
            uri: String,
            contentId: String
        },
        backgroundImage: {
            uri: String,
            contentId: String
        },
        companyName: String,
        welcomeMessage: String,
        profileLogo: {
            uri: String,
            contentId: String
        },
        sidebarImage: {
            uri: String,
            contentId: String
        },
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