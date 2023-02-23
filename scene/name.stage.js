const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const userController = require('../controllers/userController')
const keyboard = require('../keyboard')


const name = new Scene('name')

name.enter(async (ctx) => {
    let text = `Введите <b>фамилию и имя:</b>`
    ctx.replyWithHTML(text, {
        reply_markup: keyboard[ctx.i18n.locale()].comment
    })
})

name.leave()

name.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter('name')
})


name.on('text', async (ctx) => {
    let e = ctx.message.text.split(' ')
    if (e[1]) {
        const user = await userController.registerName(ctx.chat.id, ctx.message.text)
        ctx.scene.enter('date')
    } else {
        ctx.replyWithHTML(`Вы ввели не достающие данные. Введите
фамилию и имя:`)
    }
})

module.exports = name;
