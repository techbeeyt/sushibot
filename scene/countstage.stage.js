const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const mealController = require('../controllers/mealController')
const orderController = require('../controllers/orderController')
const keyboard = require('../keyboard')
const config = require('../config')


const countstage = new Scene('countstage')
countstage.enter(async (ctx) => { //  ////////////////////////////////////////////////////////////////////////////////////
    ctx.session.mealsname = ctx.message.text;
    const meals = await mealController.findMealByName(ctx.message.text);
    if (meals) {
        if (meals.ingredients) {
            var text = `<b>${meals.name}</b>\n\n${meals.ingredients}\n\n${ctx.i18n.t('price')}: <b>${prettify(meals.price)} ${ctx.i18n.t('currency')}</b>`;
        } else {
            var text = `<b>${meals.name}</b>\n\n${ctx.i18n.t('price')}: <b>${prettify(meals.price)} ${ctx.i18n.t('currency')}</b>`;
        }
            await ctx.telegram.sendPhoto(ctx.message.chat.id, config.dataurl + meals.img, {
                caption: text,
                parse_mode: "HTML",
            })

        ctx.replyWithHTML(`${ctx.i18n.t('howmany')}`, {
            reply_markup: keyboard[ctx.i18n.locale()].numbers,
        })
    } else {
        ctx.scene.enter('maincategory')
    }
})
countstage.leave()
countstage.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter(ctx.session.counter || 'mainstage')
})
countstage.hears(match('keyboard.basket'), async (ctx) => {
    const basket = await orderController.findOrderById(ctx.message.from.id)
    if (basket) {
        ctx.session.basket = 'category';
        ctx.scene.enter('basket')
    } else {
        ctx.reply('Ваша корзина пуста', {    //  ///////////////////////////////////////////////////////////////////////
            reply_markup: keyboard[ctx.i18n.locale()].numbers
        })
    }
})
countstage.hears(/^\d+$/, async (ctx) => {
    const rezult = await orderController.addMeal(ctx.message.from.id, ctx.session.mealsname, ctx.message.text)
    ctx.reply(ctx.i18n.t('addbasket'))
    ctx.scene.enter('category')
})
countstage.on('message', (ctx) => {
    ctx.reply(ctx.i18n.t('count'), {
        reply_markup: keyboard[ctx.i18n.locale()].numbers
    })
})

function prettify(num) {
    var n = num.toString();
    return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
}

module.exports = countstage
