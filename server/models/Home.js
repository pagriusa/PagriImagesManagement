const mongoose = require('mongoose');
const {Schema} = mongoose;

const HomeSchema = new Schema({
    to: {
        type: String,
        // required: true
    },
    from: {
        type: String,
        // required: true
    },
    date:{
        type: Date,
        // required: true
    },
    totalDistance: {
        type: String,
        // required: true
    },
    imageUrl: {
      type: [String],
      required: true,
    },
    numMeetingFarmer: {
        type: Number,
        // required: true
    },
    userid: {
        type: String,
       
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('home',HomeSchema)