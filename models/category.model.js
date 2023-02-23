const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategoryShema = new Schema({
    name: {
        type: String,
        required: true
    },
    button: {
        type: String,
        required: true
    },
    subcategory: {
        type: [String],
        required: false
    },
    lang: {
        type: String,
        required: true
    },
    maincategory: {
        type: String,
        required: true
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

mongoose.model('categorys', CategoryShema)
