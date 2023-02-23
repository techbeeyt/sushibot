const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const mealController = require('../controllers/mealController')
const orderController = require('../controllers/orderController')
const keyboard = require('../keyboard')
const config = require('../config')


const searchstage = new Scene('searchstage')
searchstage.enter(async (ctx) => {
////////////////////////////////////////////////////////////////////////////////////
    ctx.reply(ctx.i18n.t('search'), {
        reply_markup: keyboard[ctx.i18n.locale()].comment
    })
})
searchstage.leave()
searchstage.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter('mainstage')
})

searchstage.on('text', async (ctx) => {
    if (ctx.message.text.length < 3) {
        ctx.scene.reenter()
    } else {
        const keyboardMenu = await mealController.searchMealsByTypeQuery(ctx.message.text, ctx.i18n.locale())
        if (keyboardMenu) {
            ctx.scene.enter('categorysearch')
        } else {
            ctx.reply(ctx.i18n.t('searcherror'))
        }
    }
})

module.exports = searchstage
