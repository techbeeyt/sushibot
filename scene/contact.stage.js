const Scene = require('telegraf/scenes/base')
const keyboard = require('../keyboard')
const userController = require('../controllers/userController')
const {match} = require('telegraf-i18n')


const contact = new Scene('contact')
contact.enter((ctx) => {
    const message = ctx.i18n.t('phone')
    ctx.reply(message, {
        parse_mode: "HTML",
        reply_markup: keyboard[ctx.i18n.locale()].contactReques,
    })
})
contact.leave()
contact.hears(/^\+(\d{12})$/, async (ctx) => {
    const user = await userController.registerNumber(ctx.chat.id, ctx.message.text)
    ctx.scene.enter('geo')
    // const user = await userController.registerNumber(msg.contact)
})
contact.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter('basket')
})
contact.command('start', ctx => ctx.scene.enter('contact'))
contact.on(['contact'], async (ctx) => {
    const user = await userController.registerNumber(ctx.chat.id, ctx.message.contact.phone_number)
    ctx.scene.enter('geo')
})


module.exports = contact
