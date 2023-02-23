const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const mealController = require('../controllers/mealController')
const config = require('../config')
const orderController = require('../controllers/orderController')
const category = new Scene('category')
const keyboard = require('../keyboard')
category.enter(async (ctx) => {
    const videourl = await mealController.findUrl(ctx.message.text);
    if (videourl!== null && videourl !== '') {
        await ctx.replyWithVideo(videourl)
    }
    var reExp = /^\d+$/;
    if (ctx.message.text !== ctx.i18n.t('keyboard.back') && !reExp.test(ctx.message.text)) {
        const keyboardMenu = await mealController.findMealsByTypeQuery(ctx.message.text, ctx.i18n.locale())
        ctx.reply(ctx.i18n.t('product'), { // //////////////////////////////////////////////////////////////////////
            reply_markup: keyboardMenu
        })
        ctx.session.text = ctx.message.text
    } else {
        const keyboardMenu = await mealController.findMealsByTypeQuery(ctx.session.text, ctx.i18n.locale())
        const basket = await orderController.findOrderById(ctx.message.from.id)
        if (basket) {
            var message = ctx.i18n.t('more');
        } else {
            var message = ctx.i18n.t('product');
        }
        await ctx.replyWithHTML(message, {
            reply_markup: keyboardMenu
        })
    }
})
category.leave()
category.hears(/^⏫/,  async (ctx) => {
    const meals = await mealController.findAllMealsByTypeQuery(ctx.session.text, ctx.i18n.locale())
    meals.map( p => {
        if (p.ingredients) {
            var text = `<b>${p.name}</b>\n\n${p.ingredients}\n\n<b>${ctx.i18n.t('price')}: ${prettify(p.price)} ${ctx.i18n.t('currency')}</b>`;
        } else {
            var text = `<b>${p.name}</b>\n\n<b>${ctx.i18n.t('price')}: ${prettify(p.price)} ${ctx.i18n.t('currency')}</b>`;
        }
        ctx.telegram.sendPhoto(ctx.message.chat.id, config.dataurl + p.img, {
            caption: text,
            parse_mode: "HTML",
            reply_markup: keyboard[ctx.i18n.locale()].basket(ctx.message.from.id, p.uuid, 1)
        })
    })
})
category.hears(match('keyboard.orderstart'), async (ctx) => {
    const keyboardMenu = await mealController.inlineMealTypesKeyboard(ctx.i18n.locale())
    ctx.reply(ctx.i18n.t('keyboard.menu'), {
        reply_markup: keyboardMenu
    })
})
category.hears(match('keyboard.back'), async (ctx) => {
    const keyboardMenu = await mealController.searchSubtypesKeyboard(ctx.session.subcategory, ctx.i18n.locale());
    if (keyboardMenu) {
        ctx.scene.enter('subcategory')
    } else {
        ctx.scene.enter('maincategory')
    }

})

category.hears(match('keyboard.menu'),  (ctx) => {
    ctx.scene.enter('mainstage')
})
category.hears(match('keyboard.basket'), async (ctx) => {
    const basket = await orderController.findOrderById(ctx.message.from.id)
    if (basket) {
        ctx.session.basket = 'category';
        ctx.scene.enter('basket')
    } else {
        ctx.reply(ctx.i18n.t('basket'))
    }
})

category.on('text', async (ctx) => {
    const meals = await mealController.findMealByName(ctx.message.text);
    if (meals) {
        if (meals.isIsset) {
            ctx.session.counter = 'category'
            ctx.scene.enter('countstage')
        } else {
            ctx.reply(ctx.i18n.t('noproduct'))
        }
    }
})

function prettify(num) {
    var n = num.toString();
    return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
}

module.exports = category
