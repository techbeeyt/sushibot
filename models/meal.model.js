const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MealSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isIsset: {
        type: Boolean,
        default: true,
        required: true
    },
    uuid: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    subcategory: {
        type: String,
        required: false
    },
    measure: {
        type: String,
        required: false
    },
    lang: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    ingredients: {
        type: String,
        required: false
    },
    img: {
        type: String
    },
    count: {
        type: Number,
        required: false
    },
    database: {
        type: String,
        required: false
    },
    sort: {
        type: Number,
        default: 9999,
        required: true
    }
})

mongoose.model('meals', MealSchema)
