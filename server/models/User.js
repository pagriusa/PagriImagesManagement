const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
      password:{
          type:String,
          required:true
      },
      name: {
        type: String,
        required: true,
    },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      role: {
        type: String,
        required: true,
        default:'user',
        enum: ['admin', 'user'], // Accept only 'admin' or 'user'
      },
      createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('user',UserSchema)