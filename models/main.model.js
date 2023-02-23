const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MainShema = new Schema({
    button: {
        type: String,
        required: true
    },
    lang: {
        type: String,
        required: true
    },
    sort: {
        type: Number,
        default: 9999,
        required: true
    }

})

mongoose.model('mains', MainShema)
