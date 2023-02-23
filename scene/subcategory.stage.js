const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const mealController = require('../controllers/mealController')
const orderController = require('../controllers/orderController')
const keyboard = require('../keyboard')

const subcategory = new Scene('subcategory')
subcategory.enter(async (ctx) => {
    const videourl = await mealController.findUrl(ctx.message.text);
    if (videourl!== null && videourl !== '') {
        await ctx.replyWithVideo(videourl)
    }
    if (ctx.message.text !== ctx.i18n.t('keyboard.back')) {
        const keyboardMenu = await mealController.inlineMealSubtypesKeyboard(ctx.message.text, ctx.i18n.locale());
        if (keyboardMenu) {
            ctx.reply(ctx.i18n.t('category'), {   //////////////////////////////////////////////////
                reply_markup: keyboardMenu
            })
            ctx.session.subcategory = ctx.message.text
        } else {
            ctx.scene.enter('maincategory')
        }
    } else {
        const keyboardMenu = await mealController.inlineMealSubtypesKeyboard(ctx.session.subcategory, ctx.i18n.locale());
        if (keyboardMenu) {
            ctx.reply(ctx.i18n.t('category'), {   //////////////////////////////////////////////////
                reply_markup: keyboardMenu
            })
        } else {
            ctx.scene.enter('mainstage')
        }
    }

});
subcategory.leave()
subcategory.hears(match('keyboard.basket'), async (ctx) => {
    const basket = await orderController.findOrderById(ctx.message.from.id)
    if (basket) {
        ctx.session.basket = 'subcategory';
        ctx.scene.enter('basket')
    } else {
        ctx.reply(ctx.i18n.t('basket'))
    }
})
subcategory.hears(match('keyboard.menu'),  (ctx) => {
    ctx.scene.enter('mainstage')
})
subcategory.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter('maincategory')
})
subcategory.command('start', (ctx) => {
    ctx.scene.enter('mainstart')
})
subcategory.on('text', async (ctx) => {

    const meals = await mealController.findAllMealsByTypeQuery(ctx.message.text, ctx.i18n.locale())
    if (meals[0]) {
        ctx.scene.enter('category')
    }
})

module.exports = subcategory
