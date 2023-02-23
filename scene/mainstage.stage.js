const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const orderController = require('../controllers/orderController')
const mealController = require('../controllers/mealController')
const userController = require('../controllers/userController')
const config = require('../config')

const mainstage = new Scene('mainstage')
mainstage.enter(async (ctx) => {
    const keyboardMenu = await mealController.inlineMealMainKeyboard(ctx.i18n.locale())
    if (keyboardMenu) {

        if (ctx.session.applymess) {
            ctx.reply(ctx.i18n.t(ctx.session.applymess), {   //////////////////////////////////////////////////
                reply_markup: keyboardMenu
            })
            ctx.session.applymess = false
        } else {
            ctx.reply(ctx.i18n.t('keyboard.orderstart'), {   //////////////////////////////////////////////////
                reply_markup: keyboardMenu
            })
        }
    }
});
mainstage.leave()
mainstage.hears(match('keyboard.basket'), async (ctx) => {
    const basket = await orderController.findOrderById(ctx.message.from.id)
    if (basket) {
        ctx.session.basket = 'mainstage';
        ctx.scene.enter('basket')
    } else {
        ctx.reply(ctx.i18n.t('basket'))
    }
})
mainstage.hears('📋 Составить дополнительный список', (ctx) => {
    ctx.session.list = 'mainstage'
    ctx.scene.enter('list')
})
mainstage.on(['photo'], async (ctx) => {
    console.log(ctx.message.photo[0].file_id)
    if (ctx.message.from.id === config.RECLAMA_ID || ctx.message.from.id === config.GLOBAL_ADMIN || ctx.message.from.id === config.GLOBAL) {
        const users = await userController.findAllUsers()
        users.map(async user => {
            await ctx.telegram.sendPhoto(user.telegramId, ctx.message.photo[0].file_id, {
                parse_mode: 'HTML',
                caption: ctx.message.caption
            }).catch(function (error) {
                if (error.response && error.response.error_code === 403) {
                    console.log('user blocked')
                }
            });
        })

    }
})
mainstage.hears(/^http/, async (ctx) => {
    const users = await userController.findAllUsers()
    if (ctx.message.from.id === config.RECLAMA_ID || ctx.message.from.id === config.GLOBAL_ADMIN || ctx.message.from.id === config.GLOBAL) {
        users.map(async user => {
            await ctx.telegram.sendMessage(user.telegramId, ctx.message.text).catch(function (error) {
                if (error.response && error.response.error_code === 403) {
                    console.log('user blocked')
                }
            });
        })
    }
})
mainstage.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter('mainstart')
})
mainstage.hears(/^🔎/, (ctx) => {
    ctx.scene.enter('searchstage')
})

mainstage.hears(/^✍/, (ctx) => {
    ctx.scene.enter('comment')
})

mainstage.hears(match('keyboard.settings'), (ctx) => {
    ctx.scene.enter('settingsScene')
})
mainstage.command('start', (ctx) => {
    ctx.scene.enter('mainstage')
})
mainstage.hears(/^📊/, async (ctx) => {
    let c = ctx.message.text.split('|')
    const users = await userController.findAllUsers()
    if (ctx.message.from.id === config.RECLAMA_ID || ctx.message.from.id === config.GLOBAL_ADMIN || ctx.message.from.id === config.GLOBAL) {
        users.map(async user => {

            ctx.telegram.sendPoll(user.telegramId,
                c[3],
                c.slice(4),
                { allows_multiple_answers: c[1] === 'Yes'? true: false, is_anonymous: c[2] === 'Yes'? true: false }
            ).catch(function (error) {
                    if (error.response && error.response.error_code === 403) {
                        console.log('user blocked')
                    }
                })
            // await ctx.telegram.sendMessage(, ctx.message.text);
        })
    }
    // ctx.replyWithPoll(
    //     c[1],
    //     c.slice(2),
    //     { allows_multiple_answers: true, is_anonymous: false }
    // )
})
mainstage.hears(/^📞/, async (ctx) => {
    const text = await mealController.findContacts(ctx.i18n.locale())
    await ctx.replyWithHTML(text.videourl)
    ctx.replyWithLocation(41.339946, 69.253936) //,&ll=41.336734,69.303597&z=16
})
// mainstage.hears(match('keyboard.contacts'), async (ctx) => {
//     await ctx.replyWithPhoto('AgACAgIAAxkBAAIQ7F6JvV-t8t5XZrOWHR4LugYOhiPbAAJArjEbqJlJSBI69hr_dz4cQmbLDgAEAQADAgADbQADuCgEAAEYBA', {
//         caption: ctx.i18n.t('contacts'),
//         parse_mode: "HTML"
//     })
//     ctx.telegram.sendLocation(ctx.message.chat.id, 41.339946, 69.253936) //,&ll=41.336734,69.303597&z=16
//     //   ctx.telegram.sendLocation(ctx.message.chat.id, 41.223866,69.141798) //,&ll=41.336734,69.303597&z=16
// })
mainstage.on('text', async (ctx) => {
    // let d = new Date()
    // let day = d.getDate()
    // let month = d.getMonth()+1
    // let year = d.getFullYear()
    // const u = await userController.findDayofbirth(day, month, year)
//     if(u) {
//         u.map(p => {
//             if(p.language_code === 'ru') {
//                 ctx.telegram.sendMessage(p.telegramId, `🎁🎈🎉🎊 От нашей компании "ZER" хотим поздравить Вас с Днем Рождения! Примите от нас самые искренние пожелания!
// от имени компании хотим пожелать Вам Здоровья,
// Счастья, Добра и Благополучия Вам и Вашим близким!
// Желаем, чтобы Удача, Успех и Вдохновение были верными спутниками во всех Ваших начинаниях, а здоровье и благополучие – в ежедневной жизни.`).catch(function (error) {
//                     if (error.response && error.response.error_code === 403) {
//                         console.log('user blocked')
//                     }
//                 });
//             }else {
//                 ctx.telegram.sendMessage(p.telegramId, `🥳🎊🎁🎈"ZER" kompaniyamiz sizni  tug'ilgan kuningizni tabriklaymiz!!! Bizning eng samimiy tilaklarimizni qabul qiling!
// Kompaniya nomidan sizga sog' salomatlik, baxt, ishlaringizda omad va farovonlik tilaymiz...`).catch(function (error) {
//                     if (error.response && error.response.error_code === 403) {
//                         console.log('user blocked')
//                     }
//                 });
//             }
//         })
//     }
    const meal = await mealController.findMaincategory(ctx.message.text, ctx.i18n.locale())
    if (meal === true) {
        ctx.session.main = 'mainstage';
        ctx.scene.enter('maincategory')
    }
})

module.exports = mainstage
