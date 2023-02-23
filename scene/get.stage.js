const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const orderController = require('../controllers/orderController')
const keyboard = require('../keyboard')


const get = new Scene('get')

get.enter((ctx) => {
    ctx.replyWithHTML(ctx.i18n.t('order'), {
        parse_mode: "HTML", /////////////////////////////////////////////////////////////////////////////////////////////
        reply_markup: keyboard[ctx.i18n.locale()].aplyorder
    })
})
get.leave()

get.hears(match('keyboard.go'), async (ctx) => {
    ctx.session.dostavka = ctx.message.text;
    const user = await orderController.applyOrder(ctx.message.from.id, ctx.message.text, ctx.message.text);
    ctx.scene.enter('getaply')
})
get.hears(match('keyboard.car'), (ctx) => {
    ctx.session.dostavka = ctx.message.text;
    ctx.scene.enter('geo')
})
get.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter('contact')
})

module.exports = get
