const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const mealController = require('../controllers/mealController')
const config = require('../config')
const orderController = require('../controllers/orderController')
const categorysearch = new Scene('categorysearch')
const keyboard = require('../keyboard')
categorysearch.enter(async (ctx) => {
    var reExp = /^\d+$/;
    if (ctx.message.text !== ctx.i18n.t('keyboard.back') && !reExp.test(ctx.message.text)) {
        const keyboardMenu = await mealController.searchMealsByTypeQuery(ctx.message.text, ctx.i18n.locale())
        ctx.reply(ctx.i18n.t('product'), { // //////////////////////////////////////////////////////////////////////
            reply_markup: keyboardMenu.type
        })
        ctx.session.text = ctx.message.text
    } else {
        const keyboardMenu = await mealController.searchMealsByTypeQuery(ctx.session.text, ctx.i18n.locale())
        ctx.reply(ctx.i18n.t('product'), {
            reply_markup: keyboardMenu.type
        })
    }
})
categorysearch.leave()
categorysearch.hears(/^⏫/, async (ctx) => {
    const meals = await mealController.searchAllMealsByTypeQuery(ctx.session.text, ctx.i18n.locale())
    meals.map(async p => {
        if (p.ingredients) {
            var text = `<b>${p.name}</b>\n\n${p.ingredients}\n\n${ctx.i18n.t('price')}: <b>${prettify(p.price)} ${ctx.i18n.t('currency')}.</b>`;
        } else {
            var text = `<b>${p.name}</b>\n\n${ctx.i18n.t('price')}: <b>${prettify(p.price)} ${ctx.i18n.t('currency')}.</b>.`;
        }
        if (p.isIsset) {
            await ctx.telegram.sendPhoto(ctx.message.chat.id, config.dataurl + p.img, {
                caption: text,
                parse_mode: "HTML",
                reply_markup: keyboard[ctx.i18n.locale()].basket(ctx.message.from.id, p.uuid, 1)
            })
        } else {
            await ctx.telegram.sendPhoto(ctx.message.chat.id, config.dataurl + p.img, {
                caption: `${text}\n<b>Нет в наличии</b>`,
                parse_mode: "HTML"
            })
        }
    })
})
categorysearch.hears(match('keyboard.orderstart'), async (ctx) => {
    const keyboardMenu = await mealController.inlineMealTypesKeyboard(ctx.i18n.locale())
    ctx.reply(ctx.i18n.t('keyboard.menu'), {
        reply_markup: keyboardMenu
    })
})
categorysearch.hears(match('keyboard.back'), async (ctx) => {
    ctx.scene.enter('searchstage')
})

categorysearch.hears(match('keyboard.menu'),  (ctx) => {
    ctx.scene.enter('mainstage')
})
categorysearch.hears(match('keyboard.basket'), async (ctx) => {
    const basket = await orderController.findOrderById(ctx.message.from.id)
    if (basket) {
        ctx.session.basket = 'categorysearch';
        ctx.scene.enter('basket')
    } else {
        ctx.reply(ctx.i18n.t('basket'))
    }
})

categorysearch.on('text', async (ctx) => {
    const meals = await mealController.findMealByName(ctx.message.text);
    if (meals) {
        if (meals.isIsset) {
            ctx.session.counter = 'categorysearch'
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

module.exports = categorysearch
