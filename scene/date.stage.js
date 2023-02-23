const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const userController = require('../controllers/userController')
const keyboard = require('../keyboard')


const date = new Scene('date')

date.enter(async (ctx) => {
    let text = ctx.i18n.t('date')
    ctx.replyWithHTML(text, {
        reply_markup: keyboard[ctx.i18n.locale()].comment
    })
})
date.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter('date')
})
date.leave()

date.hears(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/, async (ctx) => {
    let c = ctx.message.text.split('.');
    if(Number(c[0][0]) === 0){
        c[0] = c[0][1];
    }
    if(Number(c[1][0]) === 0){
        c[1] = c[1][1];
    }
    if(c[1]) {
        const user = await userController.registerDate(ctx.chat.id, c[0],c[1])
        ctx.scene.enter('mainstage')
    }else {
        ctx.reply(ctx.i18n.t('errdate'))
        ctx.scene.enter('date')
    }
})


date.on('message', (ctx) => {
    ctx.reply(ctx.i18n.t('errdate'))
    ctx.scene.enter('date')
})

module.exports = date;
