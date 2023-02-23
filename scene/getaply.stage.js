const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const orderController = require('../controllers/orderController')
const keyboard = require('../keyboard')
const config = require('../config')

const getaply = new Scene('getaply')
getaply.enter(async (ctx) => {
    const user = await orderController.applyPayment(ctx.message.from.id, "На месте");
    await ctx.replyWithHTML(user.msg, {
        parse_mode: "HTML",
        reply_markup: keyboard[ctx.i18n.locale()].agree
    })
    ctx.reply(ctx.i18n.t('confirm'))
})
getaply.leave()




getaply.hears(match('keyboard.menu'), (ctx) => {
    ctx.scene.enter('mainstage')
})
getaply.on('successful_payment', async ctx => {
    console.log(ctx.update.message.successful_payment);
    const user = await orderController.applyToAdminPayment(ctx.message.from.id, ctx.update.message.successful_payment.provider_payment_charge_id);
    ctx.telegram.sendMessage(config.MANAGER_CHAT_ID, `${user.msg}\n<a href="tg://user?id=${ctx.message.from.id}">Пользователь</a>`, {
        parse_mode: "HTML",
        reply_markup: keyboard['ru'].apply(ctx, user.data)
    });
    if (user.location) {
        ctx.telegram.sendLocation(config.MANAGER_CHAT_ID, user.location.latitude, user.location.longitude);
    }
    ctx.session.applymess = user.usermsg
    ctx.scene.enter('mainstage')
})
getaply.hears(match('keyboard.back'), async (ctx) => {
    ctx.scene.enter('basket')
})
getaply.hears(match('keyboard.backtogeo'), async (ctx) => {
    ctx.scene.reenter()
})

getaply.hears(match('keyboard.yes'), async (ctx) => {
    const user = await orderController.applyToAdmin(ctx.message.from.id);
    await ctx.replyWithHTML('Вы можете забрать заказ по этой геолокации. Адрес: Ю.Абад, 2-квартал, 6-дом. Магазин: CP PLUS')
    ctx.replyWithLocation(41.362019,69.288864)
    await ctx.telegram.sendMessage(config.MANAGER_CHAT_ID, `${user.msg}\n<a href="tg://user?id=${ctx.message.from.id}">Пользователь</a>`, {
        parse_mode: "HTML",
        reply_markup: keyboard['ru'].apply(ctx, user.data)
    });
    if (user.location) {
        ctx.telegram.sendLocation(config.MANAGER_CHAT_ID, user.location.latitude, user.location.longitude);
    }
    ctx.session.applymess = "..."; //////////////////////////////////////////////////////////////////////////////////////////
    ctx.scene.enter('mainstage')
})
getaply.hears(match('keyboard.no'), async (ctx) => {
    ctx.scene.enter('mainstage')
})


// Create scene manager


// Scene registration


module.exports = getaply
