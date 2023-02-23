const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const orderController = require('../controllers/orderController')
const keyboard = require('../keyboard')


const geo = new Scene('geo')

geo.enter(async (ctx) => {
    ctx.replyWithHTML(ctx.i18n.t('address'), {
        parse_mode: "HTML", /////////////////////////////////////////////////////////////////////////////////////////////
        reply_markup: keyboard[ctx.i18n.locale()].requestaddress
    })
    // ctx.replyWithHTML(ctx.i18n.t('dostavka'))
})
geo.leave()
geo.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter('contact')
})


geo.hears(match('keyboard.menu'), (ctx) => {
    ctx.scene.enter('mainstage')
})

// geo.on('text', async (ctx) => {
//     const user = await orderController.applyOrder(ctx.message.from.id, '🚖 Доставка', ctx.message.text);
//     ctx.scene.enter('list')
// })

geo.on(['location'], async (ctx) => {
    // ctx.replyWithHTML(`Подождите ваша локация определяется`)
    ctx.session.addressset = true;
    const user = await orderController.applyOrder(ctx.message.from.id, '🚖 Доставка', ctx.message.location);
    ctx.scene.enter('list')
})

function prettify(num) {
    var n = num.toString();
    return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
}

module.exports = geo
