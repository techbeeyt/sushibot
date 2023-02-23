const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AgentShema = new Schema({
    name: {
        type: String,
        required: false
    },
    button: {
        type: String,
        required: false
    },
    subcategory: {
        type: [String],
        required: false
    },
    lang: {
        type: String,
        required: false
    },
    maincategory: {
        type: String,
        required: false
    },
    videourl: {
        type: String,
        required: false
    },
    sort: {
        type: Number,
        default: 9999,
        required: true
    }
})

mongoose.model('agents', AgentShema)
