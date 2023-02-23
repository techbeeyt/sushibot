const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AgentShema = new Schema({
    day: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    }
})

mongoose.model('month', AgentShema)
