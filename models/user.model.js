const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    telegramId: {
        type: Number,
        required: true
    },
    is_bot: {
        type: Boolean,
        required: false
    },
    first_name: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    language_code: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: false
    },
    phone_number: {
        type: String,
        required: false
    },
    orderdate: {
        type: Date,
        required: false,
        default: Date.now()
    },
    registred: {
        type: Boolean,
        required: true,
        default: false
    },
    day: {
        type: Number,
        required: false
    },
    month: {
        type: Number,
        required: false
    },
})

mongoose.model('users', UserSchema)
//await ctx.telegram.sendInvoice(id, produto, produto, 'TestPagg', '398062629:TEST:999999999_F91D8F69C042267444B74CC0B3C747757EB0E065', 'teste', 'USD', [{amount: p, label: produto }, {amount: 000, label: "PriceLabel_2"}]);
// ctx.telegram.sendInvoice(ctx.message.from.id, {
//     title: 'product name',
//     description: 'product description',
//     payload: 'bot-defined invoice payload',
//     provider_token: '371317599:TEST:763352745',
//     start_parameter: 'Pay',
//     currency: 'UZS',
//     prices: [
//         {label: 'product', amount: 11000},
//         {label: 'tax', amount: 11000},
//     ]
// }, {},)

// title: 'asdasd',
//     description: 'qweqwe1231',
//     payload: payload,
//     provider_token: '398062629:TEST:999999999_F91D8F69C042267444B74CC0B3C747757EB0E065',
//     start_parameter: '123445123',
//     currency: 'UZS',
//     prices: prices,
//     price: 45000
// var payload = "12345" + Date.now() + "pay";// you can use your own payload
// var prices = [{
//     label: "Donation",
//     amount: parseInt("1000")	// if you have a decimal price with . instead of ,
// }];
