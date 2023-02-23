const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const mealController = require('../controllers/mealController')
const orderController = require('../controllers/orderController')


const maincategory = new Scene('maincategory')
maincategory.enter(async (ctx) => {
    if (ctx.message.text !== ctx.i18n.t('keyboard.back')) {
        const keyboardMenu = await mealController.inlineMealTypesKeyboard(ctx.message.text, ctx.i18n.locale())
        if (keyboardMenu) {
            ctx.reply(ctx.i18n.t('category'), {   //////////////////////////////////////////////////
                reply_markup: keyboardMenu
            })
        }
        ctx.session.maincategory = ctx.message.text
    } else {
        const keyboardMenu = await mealController.inlineMealTypesKeyboard(ctx.session.maincategory, ctx.i18n.locale())
        if (keyboardMenu) {
            ctx.reply(ctx.message.text, {   //////////////////////////////////////////////////
                reply_markup: keyboardMenu
            })
        } else {
            ctx.scene.enter('mainstage')
        }
    }

});
maincategory.leave()
maincategory.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter('mainstage')
})
maincategory.command('start', (ctx) => {
    ctx.scene.enter('mainstart')
})
maincategory.hears(match('keyboard.menu'), (ctx) => {
    ctx.scene.enter('mainstage')
})
maincategory.hears(match('keyboard.order'), async (ctx) => {
    //process.env.TZ = 'Asia/Tashkent'
    var d = new Date()
    var day = d.getDay()
    var hour = d.getHours()
    console.log(day)
    console.log(hour)
    // if(day === 7 || day === 6) {
    //     ctx.replyWithHTML(`Извините мы не работаем в субботу и в воскресенье связи с ограничением`)
    //
    // } else {
        const user = await orderController.applyOrder(ctx.message.from.id, ctx.session.dostavka, 'Null');
        if (user) {
            ctx.scene.enter('contact')
        } else {
            ctx.reply(ctx.i18n.t('basket'))
        }
    // }

})
maincategory.hears(match('keyboard.basket'), async (ctx) => {

    const basket = await orderController.findOrderById(ctx.message.from.id)
    if (basket) {
        ctx.session.basket = 'maincategory';
        ctx.scene.enter('basket')
    } else {
        ctx.reply(ctx.i18n.t('basket'))
    }
})
maincategory.on('text', async (ctx) => {
    const keyboardMenu = await mealController.searchSubtypesKeyboard(ctx.message.text, ctx.i18n.locale());
    if (keyboardMenu) {
        ctx.scene.enter('subcategory')
    } else {
        const meals = await mealController.findAllMealsByTypeQuery(ctx.message.text, ctx.i18n.locale())
        if (meals[0]) {
            ctx.session.subcategory = ctx.message.text
            ctx.scene.enter('category')
        } else {
            const videourl = await mealController.findUrl(ctx.message.text);
            if (videourl !== null && videourl !== '') {
                await ctx.replyWithHTML(videourl)
            }
        }
    }
})

module.exports = maincategory
