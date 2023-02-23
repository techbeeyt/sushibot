const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AutoIncrement = require('mongoose-sequence')(mongoose);

const mealSchema = require('./meal.model')

const OrderSchema = new Schema({
    telegramId: {
        type: Number,
        required: true
    },
    meals: {
        type: [mealSchema],
        default: []
    },
    served: {
        type: String,
        default: "waiting"
    },
    location: {
        type: Schema.Types.Mixed
    },
    count: {
        type: Number,
        required: false

    },
    dos: {
        type: Number,
        required: false

    },
    payment: {
        type: String,
        required: false
    },
    orderdate: {
        type: Date,
        required: false
    },
    name: {
        type: String,
        required: false

    },
    typeorder: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    database: {
        type: String,
        required: false
    },
    mess: {
        type: String,
        required: false
    },
    percent: {
        type: Number,
        default: 0
    },
    percentsum: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        required: false
    },
    provider_payment_charge_id: {
        type: String,
        required: false
    },
    phone_number: {
        type: String,
        required: false
    },



})
OrderSchema.plugin(AutoIncrement, {inc_field: 'id'});
mongoose.model('orders', OrderSchema)

