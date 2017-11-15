

import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const transferSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    original: {
        type: String,
        required: true
    },
    product:{
        type: String,
        required: true,
        index: true
    },
    created: {
        type: Date,
        default: Date.now,
        expires: '12h'
    }
});

// Execute before each user.save() call
transferSchema.pre('save', function(callback) {
    const transfer = this;

    // Break out if the password hasn't changed
    if (!transfer.isModified('code')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, (err, salt) => {
        if (err) return callback(err);

        bcrypt.hash(transfer.code, salt, null, (err, hash) => {
            if (err) return callback(err);
            transfer.code = hash;
            callback();
        });
    });
});

transferSchema.methods.verifyCode = function(code, callback) {
    bcrypt.compare(code, this.code, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

// Export the Mongoose model
export default mongoose.model('Transfer', transferSchema);