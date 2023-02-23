const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const orderController = require('../controllers/orderController')
const keyboard = require('../keyboard')


const list = new Scene('list')

list.enter(async (ctx) => {
    let text = ctx.i18n.t('ok')

    ctx.replyWithHTML(text, {
        reply_markup: keyboard[ctx.i18n.locale()].comment
    })
})

list.leave()

list.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter("geo")
})

list.on('text', async (ctx) => {
    const user = await orderController.addMess(ctx.message.from.id, ctx.message.text);

    //ctx.session.list === 'mainstage' ? ctx.session.applymess = `Ваш список добавлен в корзину`: ctx.reply(`Ваш список добавлен в корзину`);
    ctx.scene.enter("aplyorder")
})

module.exports = list
