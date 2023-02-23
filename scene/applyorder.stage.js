const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const orderController = require('../controllers/orderController')
const keyboard = require('../keyboard')
const config = require('../config')

const aplyorder = new Scene('aplyorder')
aplyorder.enter((ctx) => {
    ctx.reply(ctx.i18n.t('payment'), { //////////////////////////////////////////
        parse_mode: "HTML",
        reply_markup: keyboard[ctx.i18n.locale()].payment,
    })
})
aplyorder.leave()



aplyorder.hears(match('keyboard.payme'), async (ctx) => {
    // const user = await orderController.applyPayment(ctx.message.from.id, ctx.message.text);
    // await ctx.telegram.sendInvoice(ctx.message.from.id, {
    //     title: config.clickname,
    //     description: user.msg,
    //     payload: Date.now()+'#'+user.orderId,
    //     provider_token: config.paycomtest,
    //     start_parameter: 'Oplata',
    //     currency: 'UZS',
    //     prices: user.prices
    // })
//     if(ctx.i18n.locale() === 'ru') {
//         ctx.replyWithHTML(`+Стоимость доставки - 8000 сум до 5 км от филиала. Свыше 5 км 1200 сум за км.
// Бесплатная доставка по Ташкенту при заказе от 300 000 сум.`)
//     }else {
//         ctx.replyWithHTML(`+Yetkazib berish narxi- Bizning dokondan 5 km gacha bo'lgan masofaga 8000 so'm va xar bir koshimcha km uchun 1200 so' m olinadi.
// Agar siz 300 000 so'm va undan ortiq miqdorda xarid qilsangiz Toshkent shahar bo'ylab BEPUL yetkazib beriladi....`)
//     }
    // const user = await orderController.applyPayment(ctx.message.from.id, ctx.message.text);
    // await ctx.replyWithHTML(user.msg, {
    //     parse_mode: "HTML",
    //     reply_markup: keyboard[ctx.i18n.locale()].agree
    // })
    // ctx.reply(ctx.i18n.t('confirm'))
    const user = await orderController.applyPayment(ctx.message.from.id, ctx.message.text);
    await ctx.replyWithHTML(user.msg, {
        parse_mode: "HTML",
        reply_markup: keyboard[ctx.i18n.locale()].agree
    })
})
aplyorder.hears(match('keyboard.click'), async (ctx) => {
    const user = await orderController.applyPayment(ctx.message.from.id, ctx.message.text);
    await ctx.replyWithHTML(user.msg, {
        parse_mode: "HTML",
        reply_markup: keyboard[ctx.i18n.locale()].agree
    })
//     if(ctx.i18n.locale() === 'ru') {
//         ctx.replyWithHTML(`+Стоимость доставки - 8000 сум до 5 км от филиала. Свыше 5 км 1200 сум за км.
// Бесплатная доставка по Ташкенту при заказе от 300 000 сум.`)
//     }else {
//         ctx.replyWithHTML(`+Yetkazib berish narxi- Bizning dokondan 5 km gacha bo'lgan masofaga 8000 so'm va xar bir koshimcha km uchun 1200 so' m olinadi.
// Agar siz 300 000 so'm va undan ortiq miqdorda xarid qilsangiz Toshkent shahar bo'ylab BEPUL yetkazib beriladi....`)
//     }
    ctx.reply(ctx.i18n.t('confirm'))
})
aplyorder.hears(match('keyboard.menu'), (ctx) => {
    ctx.scene.enter('mainstage')
})
aplyorder.hears(match('keyboard.nal'), async (ctx) => {
    const user = await orderController.applyPayment(ctx.message.from.id, ctx.message.text);
    await ctx.replyWithHTML(user.msg, {
        parse_mode: "HTML",
        reply_markup: keyboard[ctx.i18n.locale()].agree
    })
//     if(ctx.i18n.locale() === 'ru') {
//         ctx.replyWithHTML(`+Стоимость доставки - 8000 сум до 5 км от филиала. Свыше 5 км 1200 сум за км.
// Бесплатная доставка по Ташкенту при заказе от 300 000 сум.`)
//     }else {
//         ctx.replyWithHTML(`+Yetkazib berish narxi- Bizning dokondan 5 km gacha bo'lgan masofaga 8000 so'm va xar bir koshimcha km uchun 1200 so' m olinadi.
// Agar siz 300 000 so'm va undan ortiq miqdorda xarid qilsangiz Toshkent shahar bo'ylab BEPUL yetkazib beriladi....`)
//     }
    ctx.reply(ctx.i18n.t('confirm'))
})
aplyorder.hears(match('keyboard.menu'), (ctx) => {
    ctx.scene.enter('mainstage')
})
// aplyorder.on('successful_payment', async ctx => {
//     console.log(ctx.update.message.successful_payment);
//     const user = await orderController.applyToAdminPayment(ctx.message.from.id, ctx.update.message.successful_payment.provider_payment_charge_id);
//     ctx.telegram.sendMessage(config.MANAGER_CHAT_ID, `${user.msg}\n<a href="tg://user?id=${ctx.message.from.id}">Пользователь</a>`, {
//         parse_mode: "HTML",
//         reply_markup: keyboard['ru'].apply(ctx, user.data)
//     });
//     if (user.location) {
//         ctx.telegram.sendLocation(config.MANAGER_CHAT_ID, user.location.latitude, user.location.longitude);
//     }
//     ctx.session.applymess = user.usermsg
//     ctx.scene.enter('mainstage')
// })
aplyorder.hears(match('keyboard.back'), async (ctx) => {
    ctx.scene.enter('basket')
})
aplyorder.hears(match('keyboard.backtogeo'), async (ctx) => {
    ctx.scene.reenter()
})

aplyorder.hears(match('keyboard.yes'), async (ctx) => {
    const user = await orderController.applyToAdmin(ctx.message.from.id);
    ctx.telegram.sendMessage(config.MANAGER_CHAT_ID, `${user.msg}\n<a href="tg://user?id=${ctx.message.from.id}">Пользователь</a>`, {
        parse_mode: "HTML",
        reply_markup: keyboard['ru'].apply(ctx, user.data)
    });
    if (user.location) {
        ctx.telegram.sendLocation(config.MANAGER_CHAT_ID, user.location.latitude, user.location.longitude);
    }
    ctx.session.applymess = user.usermsg; //////////////////////////////////////////////////////////////////////////////////////////
    ctx.scene.enter('mainstage')
})
aplyorder.hears(match('keyboard.no'), async (ctx) => {
    ctx.scene.enter('mainstage')
})


// Create scene manager


// Scene registration


module.exports = aplyorder
