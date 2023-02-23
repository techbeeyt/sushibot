const Telegraf = require('telegraf')
const session = require('telegraf/session')
const mongoose = require('mongoose')
const Stage = require('telegraf/stage')
const { leave } = Stage
const path = require('path')
const config = require('./config')
// Greeter scene
const I18n = require('telegraf-i18n')
// controllers
const keyboard = require('./keyboard')
const mainstart = require('./scene/mainstart.stage')
const basket = require('./scene/basket.stage')
const get = require('./scene/get.stage')
const geo = require('./scene/geo.stage')
const mainstage = require('./scene/mainstage.stage')
const category = require('./scene/category.stage')
const categorysearch = require('./scene/categorysearch.stage')
const countstage = require('./scene/countstage.stage')
const contact = require('./scene/contact.stage')
const searchstage = require('./scene/search.stage')
const date = require('./scene/date.stage')
const aplyorder = require('./scene/applyorder.stage')
const comment = require('./scene/comment.stage')
const settingsScene = require('./scene/settings.stage')
const getaply = require('./scene/getaply.stage')
const maincategory = require('./scene/maincategory.stage')
const subcategory = require('./scene/subcategory.stage')
const list = require('./scene/list.stage')
const userController = require('./controllers/userController')
const orderController = require('./controllers/orderController')

// подключаем базу данных
mongoose.connect(config.DB_CL, {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))
mongoose.set('useFindAndModify', false);
const i18n = new I18n({
    directory: path.resolve(__dirname, 'locales'),
    defaultLanguage: 'ru',
    useSession: true,
    templateData: {
        pluralize: I18n.pluralize,
        uppercase: (value) => value.toUpperCase()
    }
})


// главная сцена
// главная сцена
// главная сцена


const stage = new Stage()
stage.command('cancel', leave())


stage.register(mainstart)
stage.register(contact)
stage.register(comment)
stage.register(mainstage)
stage.register(getaply)
stage.register(settingsScene)
stage.register(maincategory)
stage.register(subcategory)
stage.register(basket)
stage.register(aplyorder)
stage.register(category)
stage.register(date)
stage.register(get)
stage.register(geo)
stage.register(categorysearch)
stage.register(countstage)
stage.register(list)
stage.register(searchstage)


const bot = new Telegraf(config.TOKEN
    , {
        telegram: {webhookReply: false} // default true, but need to set false
    }
)

// bot.use(async (ctx, next) => {
//     const start = new Date()
//     await next()
//     const ms = new Date() - start
//     console.log('Response time: %sms', ms)
// })
bot.use(session())
bot.use(i18n.middleware())
bot.use(stage.middleware())


bot.command('start', (ctx) => {
    console.log('started' + '' + ctx.message.from.id);
    ctx.chat.type === 'supergroup' ? console.log(ctx.chat) : ctx.scene.enter('mainstart');
})
/*bot.on('message', (ctx) => {
console.log(ctx.update);
});*/

// bot.on('message', async (ctx) => {
//     const user = await userController.findOrderById(ctx.from);
//     console.log(user);
//     ctx.i18n.locale(user.language_code)
//     ctx.scene.enter('mainstart')
//     console.log(ctx.i18n.locale())
// })AgACAgIAAxkBAAIQyV6Juo9qTGC1bAZB-nZtUl-mD6G9AAKorDEbZsdJSFxNQmPOo4rpiiZ3kS4AAwEAAwIAA20AA_3EAQABGAQ


bot.on(['video'], async (ctx) => {
    if (ctx.message.from.id === config.RECLAMA_ID || ctx.message.from.id === config.GLOBAL_ADMIN) {
        ctx.reply(ctx.message.video.file_id);
    }
})
bot.on('callback_query', async (ctx) => {
    query = JSON.parse(ctx.update.callback_query.data).query
    userId = JSON.parse(ctx.update.callback_query.data).userId
    mess = JSON.parse(ctx.update.callback_query.data).data
    if (query === "apply") {
        const order = await orderController.orderStatus(userId, query)
        const user = await userController.findUsee(userId);
        let message;
        if (user.language_code === 'ru') {
            if (order) {
                message = `Ваш заказ #${mess} подтвержден!
Ваш заказ скоро будет доставлен`
            } else {
                message = `Ваш заказ #${mess} подтвержден!`
            }
        } else {
            message = `Sizning buyurtmangiz #${mess} tasdiqlandi!`
        }
        await ctx.telegram.sendMessage(userId, message).catch(function (error) {
            if (error.response && error.response.error_code === 403) {
                console.log('user blocked')
            }
        });
        // if (order.payment === '💳 Payme' || '💳 Click') {
        //     ctx.telegram.sendInvoice(userId, {
        //         title: config.clickname,
        //         description: user.language_code === 'ru' ? 'Ваш счет на оплату ZER UZ' : 'To\'lov uchun',
        //         payload: Date.now() + '#' + user.orderId,
        //         provider_token: order.payment === '💳 Payme' ? config.paycomtest : config.clicktest,
        //         start_parameter: 'Oplata',
        //         currency: 'UZS',
        //         prices: [{label: 'ZER', amount: order.count * 100}]
        //     })
        // }
        if (order) {
            ctx.editMessageReplyMarkup({
                inline_keyboard: [
                    [
                        {
                            text: `Доставленно`,
                            callback_data: JSON.stringify({
                                query: 'get',
                                userId: userId,
                                data: mess
                            })
                        },
                    ]
                ]
            })
        } else {
            ctx.editMessageReplyMarkup({})
        }
        ctx.reply(`Заказ #${mess} подтвержден.`)
    } else if (query === "reject") {
        const user = await userController.findOrderById(ctx.from);
        await orderController.orderStatus(userId, query)
        let message;
        if (user.language_code === 'ru') {
            message = `Ваш заказ #${mess} отклонен уточните причину у Менеджера!`
        } else {
            message = `Sizning buyurtmangiz #${mess} rad qilindi, sababini Administratordan tekshiring!`
        }
        ctx.telegram.sendMessage(userId, message)
            .catch(function (error) {
                if (error.response && error.response.error_code === 403) {
                }
            });
        ctx.editMessageReplyMarkup({})
        ctx.reply(`Заказ #${mess} Отменен`)
    } else if (query === "get") {
        const user = await userController.findUsee(userId);
        ctx.i18n.locale(user.language_code);
        //  const user = await userController.findOrderById(ctx.from);
        const order = await orderController.orderStatusGet(userId, query)
        // if (order) {
        //     ctx.telegram.sendMessage(order.telegramId, order.text, {
        //         parse_mode: 'HTML'
        //     })
        //         .catch(function (error) {
        //             if (error.response && error.response.error_code === 403) {
        //             }
        //         });
        // }
        // let message;
        //ctx.i18n.t('keyboard.orderstart')
        await ctx.telegram.sendMessage(userId, ctx.i18n.t('thanks'))
            .catch(function (error) {
                if (error.response && error.response.error_code === 403) {
                }
            });
        ctx.telegram.sendMessage(userId, ctx.i18n.t('commentmsg'), {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: ctx.i18n.t('keyboard.comment'),
                            callback_data: JSON.stringify({
                                query: 'comment',
                                userId: userId,
                                data: mess
                            })
                        },
                    ]
                ]
            }
        })
            .catch(function (error) {
                if (error.response && error.response.error_code === 403) {
                }
            });
        ctx.editMessageReplyMarkup({})
        ctx.reply(`Заказ #${mess} Доставлен`)
    } else if (query === "comment") {
        ctx.editMessageReplyMarkup({})
        ctx.scene.enter('comment')
    } else if (query === "+") {
        mess = mess.split(',')
        ctx.editMessageReplyMarkup(keyboard['ru'].basket(userId, mess[0], Number(mess[1]) + 1)).catch(err => {
            console.log(err.response)
        })
    } else if (query === "del") {

        mess = mess.split(',')
        if ((Number(mess[1]) - 1) === 0) {
        } else {
            ctx.editMessageReplyMarkup(keyboard['ru'].basket(userId, mess[0], Number(mess[1]) - 1)).catch(err => {
                console.log(err.response)
            })
        }
    } else if (query === "num") {
        mess = mess.split(',')
        ctx.editMessageReplyMarkup(keyboard['ru'].basket(userId, mess[0], Number(mess[1]) + Number(mess[1]))).catch(err => {
            console.log(err.response)
        })
    } else if (query === "addtobasket") {
        mess = mess.split(',')
        const basket = await orderController.addMealFromId(userId, mess[0], mess[1])
        ctx.editMessageCaption(basket.text)
    }


})

bot.on('pre_checkout_query', async ctx => {
    let s = Date.now()
    let payload = ctx.update.pre_checkout_query.invoice_payload.split('#')
    let si = (Number(s) - Number(payload[0]));
    if (si > 1000000) {
        await orderController.orderStatusState(ctx.update.pre_checkout_query.from.id, "reject")
        ctx.telegram.answerPreCheckoutQuery(ctx.update.pre_checkout_query.id, false, `Платеж не актуальный пройдите заново`).then(res => console.log(false));
    } else {
        ctx.telegram.answerPreCheckoutQuery(ctx.update.pre_checkout_query.id, true).then(res => console.log(true));
    }
})
bot.on('successful_payment', async ctx => {
    const user = await orderController.applyToAdminPayment(ctx.message.from.id);
    ctx.telegram.sendMessage(config.MANAGER_CHAT_ID, `Оплата прошла успешно ${user.payment} #${user.id}\n<a href="tg://user?id=${ctx.message.from.id}">Пользователь</a>`, {
        parse_mode: "HTML",
        //reply_markup: keyboard['ru'].apply(ctx, user.data)
    });
    // if (user.location) {
    //     ctx.telegram.sendLocation(config.MANAGER_CHAT_ID, user.location.latitude, user.location.longitude);
    // }
    //ctx.telegram.sendMessage(ctx.message.from.id, user.usermsg)
})
bot.on(['contact'], async (ctx) => {
    const user = await userController.findOrderById(ctx.from);
    ctx.i18n.locale(user.language_code)
    ctx.scene.enter('mainstart')
})
// bot.on('text', async (ctx) => {
//     ctx.reply('Отправьте команду /start')
// })

bot.hears([/^⬅️/, /^📥/, /^⚙️/, /^🛍/, /^🔎/, /^❌/, /^🇺🇿/, /^✍️/, /^📞/, /^🏠/, /^✅/, /^🍱/, /^🥫/, /^🍣/, /^🍽️/], async (ctx) => {
    const user = await userController.findUserByid(ctx.from);
    if (user) {
        console.log(user.language_code)
        await ctx.i18n.locale(user.language_code);
    }
    if (ctx.chat.type !== 'supergroup') {
        ctx.scene.enter('mainstart')
    }

})

//
bot.telegram.setWebhook('https://sushibot-3jkx6ryup-techbeeyt.vercel.app/secret-path')
bot.startWebhook('/secret-path', null, config.PORT)

bot.startPolling()


