

import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const transferSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    user_id:{
        type: String,
        required: true,
        index: true
    },
    product:{
        type: String,
        required: true,
        index: true
    },
    created: {
        type: Date,
        default: Date.now,
        expires: '1d'
    }
});

// Execute before each user.save() call
transferSchema.pre('save', callback => {
    const gcode = this;

    // Break out if the password hasn't changed
    if (!gcode.isModified('code')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, (err, salt) => {
        if (err) return callback(err);

        bcrypt.hash(gcode.code, salt, null, (err, hash) => {
            if (err) return callback(err);
            gcode.code = hash;
            callback();
        });
    });
});

transferSchema.methods.verifyCode = (code, callback) => {
    bcrypt.compare(code, this.code, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

// Export the Mongoose model
export default mongoose.model('Transfer', transferSchema);