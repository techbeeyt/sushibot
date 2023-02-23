const mongoose = require('mongoose')

require('../models/order.model')
require('../models/user.model')
require('../models/month.model')

const Meal = mongoose.model('meals')
const User = mongoose.model('users')
const Month = mongoose.model('month')

class UserController {

    async findOrderById(userfrom){
        let userpromise
        const user =  await User.findOne({telegramId: userfrom.id});
        if (user) {
            return user;
        } else {
            userpromise = new User({
                telegramId: userfrom.id,
                username: userfrom.username,
                language_code: 'none',
                status: 0
            })
           await userpromise.save()
        }



        const answerText = 'Пройдите регистрацию'

        const result = {
            callback_query_id: userpromise,
            text: answerText
        }

        return userpromise

    }

    async registerDate(userId, day, month){
        const user =  await User.findOne({telegramId: userId});

        if (user) {
            user.day = day;
            user.month = month;
            user.registred = true;
            await user.save();
            return user
        } else {
            return false
        }
    }

    async registerName(userId, message){
        const user =  await User.findOne({telegramId: userId});

        if (user) {
            user.first_name = message;
            await user.save();
            return user
        } else {
            return false
        }
    }
    async findUserByid(userfrom){
        const user =  await User.findOne({telegramId: userfrom.id});
        if (user) {
            return user;
        } else {
            return false
        }
    }

    async findUsee(userfrom){
        const user =  await User.findOne({telegramId: userfrom});
        if (user) {
            return user;
        } else {
            return false
        }
    }
    async findDayofbirth(day, month, year){
        let userpromise
        const m = await Month.find({day: day, month: month, year:year})
        if(!m[0]) {
            userpromise =  new Month({
                day: day,
                month: month,
                year: year
            })
            await userpromise.save()
            const user =  await User.find({day: day, month: month});
            if (user[0]) {
                return user;
            } else {
                return false
            }
        }else {
            return false
        }

    }


    async findAllUsers(){
        const user =  await User.find({});
        if (user) {
            return user;
        } else {
            return false
        }
    }




    async registerNumber(userId, message){
        let userpromise

        const user =  await User.findOne({telegramId: userId});

        if (user) {
            user.phone_number = message;
            user.registred = false;
            user.save();
        } else {


        }
        // const answerText = 'Registraciya proydena'
        //
        // const result = {
        //     callback_query_id: user,
        //     text: answerText
        // }

        return user

    }
    async registerLang(userfrom, lang){
        const user =  await User.findOne({telegramId: userfrom.id});

        if (user) {
            user.language_code = lang,
            user.save();
        }
        const answerText = 'Registraciya proydena'

        // const result = {
        //     callback_query_id: user,
        //     text: answerText
        // }
        return user

    }
}

module.exports = new UserController()


// tgid: {
//     type: Number,
//         required: true
// },
// is_bot: {
//     type: Boolean,
//         required: true
// },
// first_name: {
//     type: Number,
//         required: true
// },
// username: {
//     type: String,
//         required: false
// },
// language_code: {
//     type: Number,
//         required: true
// },
// status: {
//     type: Number,
//     required: false
// },
// phone: {
//     type: String,
//         required: true
// },
// registred: {
//     type: Boolean,
//         required: false,
// default: false
// },
// const Telegraf = require('telegraf')
// const path = require('path')
// const I18n = require('telegraf-i18n')
// const { Extra } = Telegraf
// const config = require('./config')
// // i18n options
// const i18n = new I18n({
//     directory: path.resolve(__dirname, 'locales'),
//     defaultLanguage: 'en',
//     sessionName: 'session',
//     useSession: true,
//     templateData: {
//         pluralize: I18n.pluralize,
//         uppercase: (value) => value.toUpperCase()
//     }
// })
//
// const bot = new Telegraf(config.TOKEN)
// bot.use(Telegraf.session())
// bot.use(i18n.middleware())
//
// // Start message handler
// bot.start(({ i18n, replyWithHTML }) => replyWithHTML(i18n.t('greeting')))
//
// // Using i18n helpers
// bot.command('help', I18n.reply('greeting', Extra.HTML()))
//
// // Set locale to `en`
// bot.command('en', ({ i18n, replyWithHTML }) => {
//     i18n.locale('en-US')
//     return replyWithHTML(i18n.t('greeting'))
// })
//
// // Set locale to `ru`
// bot.command('ru', ({ i18n, replyWithHTML }) => {
//     i18n.locale('ru')
//     return replyWithHTML(i18n.t('greeting'))
// })
//
// // Add apple to cart
// bot.command('add', ({ session, i18n, reply }) => {
//     session.apples = session.apples || 0
//     session.apples++
//     const message = i18n.t('cart', { apples: session.apples })
//     return reply(message)
// })
//
// // Add apple to cart
// bot.command('cart', (ctx) => {
//     const message = ctx.i18n.t('cart', { apples: ctx.session.apples || 0 })
//     return ctx.reply(message)
// })
//
// // Checkout
// bot.command('checkout', ({ reply, i18n }) => reply(i18n.t('checkout')))
// bot.startPolling()


// const TelegramBot = require('node-telegram-bot-api')
// const mongoose = require('mongoose')
//
// const config = require('./config')

//
// // создаем объект бот
//
// const bot = new TelegramBot(config.TOKEN, {
//     webHook: {
//         port: config.port,
//         autoOpen: false
//     }
// })
// bot.openWebHook()
// bot.setWebHook(`${config.url}/bot${config.TOKEN}`)
// // текст для главного меню
// const mainText = "<strong>BeReZka_UZ_BOT</strong>"
// // const phoneText = "Введите свой номер телефона \nВ формате <strong>+99891 111 11 11</strong>\nИли отправьте контакт";
// const phoneText = `\nДля продолжения \nотправьте свой контакт либо\nвведите свой номер чтобы связаться с вами\n в Формате +99899 999 99 99`;
// // обработка команды /start
// bot.onText(/^\/start$/, async msg => {
//     // const chatId = msg.from.id
//     // const messageId = msg.message.message_id
//     if(msg.from.is_bot){
//     } else {
//      const user = await userController.findOrderById(msg.from)
//      if(user.callback_query_id) {
//          bot.sendMessage(msg.chat.id, phoneText, {
//              reply_markup: keyboard.contactReques,
//              parse_mode: "HTML"
//          }, async stx => {
//              console.log(stx)
//              console.log('Its my stx')
//          })
//      }
//
//     }
// })
//
//
//
// bot.onText(/^\/menu$/, async msg => {
//     bot.sendMessage(msg.chat.id, mainText, {
//         reply_markup: keyboard.mainKeyboard,
//         parse_mode: "HTML"
//     }, async stx => {
//         console.log(stx)
//         console.log('Its my stx')
//     })
// })
// bot.onText(/^\+(\d{12})$/, async msg => {
//     const user = await userController.registerNumber(msg.text)
//     console.log(user);
//     bot.sendMessage(msg.chat.id, mainText, {
//         reply_markup: keyboard.mainKeyboard,
//         parse_mode: "HTML"
//     })
//     console.log(msg.contact);
// })
//
//
// bot.on('contact', async msg => {
//         console.log(msg.contact);
//         const user = await userController.registerNumber(msg.contact)
//         console.log(user);
//         bot.sendMessage(msg.chat.id, mainText, {
//             reply_markup: keyboard.mainKeyboard,
//             parse_mode: "HTML"
//         })
//         console.log(msg.contact);
// })
//
//
// bot.on('location', async msg => {
//     const chatId = msg.chat.id
//     if(msg.location){
//         const orderApplyKeyboard = {
//             inline_keyboard: [
//                 [
//                     {
//                         text: 'Подтвердить',
//                         callback_data: JSON.stringify({
//                             query: 'apply',
//                             userId: chatId
//                         })
//                     },
//                     {
//                         text: 'Отказать',
//                         callback_data: JSON.stringify({
//                             query: 'reject',
//                             userId: chatId
//                         })
//                     }
//                 ]
//             ]
//         }
//         const text = await orderController.applyOrder(chatId, msg.location)
//         console.log(msg);
//         bot.sendMessage(chatId, text, {reply_markup: {
//                 resize_keyboard: true,
//                 keyboard: [
//                     [
//                         "/menu"
//                     ]
//                 ],
//             }})
//         const listOrder = await orderController.orderList(chatId)
//         bot.sendMessage(config.MANAGER_CHAT_ID, listOrder, {reply_markup: orderApplyKeyboard})
//     }
// })
//
// bot.on('message', async msg => {
//     console.log(msg)
//
//     const chatId = msg.from.id
//     const messageId = msg.message_id
//     for (var i = messageId; i >= messageId - 14; i--){
//         bot.deleteMessage(chatId, i)
//     }
//
//     if(msg.text !== "/start") {
//     }
//     // if(msg.from.is_bot){
//     //     bot.sendMessage(msg.chat.id, phoneText);
//     // } else {
//     //     const user = await userController.findOrderById(msg.from)
//     //     console.log('!!!!!!!!!!!!!!!!!!!!!!!!');
//     //     if(user.callback_query_id) {
//     //         bot.sendMessage(msg.chat.id, phoneText, {
//     //             reply_markup: keyboard.contactReques,
//     //             parse_mode: "HTML"
//     //         })
//     //     }
//     //
//     // }
//     // bot.sendMessage(msg.chat.id,'404 not found')
//     //  // bot.editMessageText('Наше меню:', {chat_id:msg.chat.id, message_id:msg.message_id-1, reply_markup: null})
//     //
//     // console.log('Working', msg.from.first_name)
//     //
//     // const chatId = msg.chat.id
//
//     // if(msg.location){
//     //     const orderApplyKeyboard = {
//     //         inline_keyboard: [
//     //             [
//     //                 {
//     //                     text: 'Подтвердить',
//     //                     callback_data: JSON.stringify({
//     //                         query: 'apply',
//     //                         userId: chatId
//     //                     })
//     //                 },
//     //                 {
//     //                     text: 'Отказать',
//     //                     callback_data: JSON.stringify({
//     //                         query: 'reject',
//     //                         userId: chatId
//     //                     })
//     //                 }
//     //             ]
//     //         ]
//     //     }
//     //     const text = await orderController.applyOrder(chatId, msg.location)
//     //     console.log(msg);
//     //     bot.sendMessage(chatId, text, {reply_markup: {
//     //         resize_keyboard: true,
//     //         keyboard: [
//     //             [
//     //                 "menu"
//     //             ]
//     //         ],
//     //     }})
//     //     const listOrder = await orderController.orderList(chatId)
//     //     bot.sendMessage(config.MANAGER_CHAT_ID, listOrder, {reply_markup: orderApplyKeyboard})
//     // }
//
// })
//
//
// // обработка инлайн клавиатуры
// bot.on('callback_query', async query => {
//     const chatId = query.from.id
//     const messageId = query.message.message_id
//     let data, result, message
//
//     // получение сегодняшней даты
//     const today = new Date()
//     // установка времени в 00:00
//     today.setHours(-21,0,0)
//     // получение завтрашней даты
//     const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000))
//     // получение послезавтрашней даты
//     const tomorrowPlusOne = new Date(today.getTime() + 2*(24 * 60 * 60 * 1000))
//
//     const monthArr=[
//         'января',
//         'февраля',
//         'марта',
//         'апреля',
//         'мая',
//         'июня',
//         'июля',
//         'августа',
//         'сентября',
//         'ноября',
//         'декабря',
//      ]
//
//     try {
//         data = JSON.parse(query.data)
//     } catch (e) {
//         throw new Error('Data is not an object')
//     }
//
//     switch(data.query){
//         case "apply":
//             orderController.orderStatus(data.userId, "served")
//             bot.sendMessage(data.userId, "Заказ подтвержден")
//             break
//         case "reject":
//             orderController.orderStatus(data.userId, "reject")
//             bot.sendMessage(data.userId, "К сожалению, Ваш заказ не может быть выполнен. Свяжитесь с менеджером для уточнения причин.")
//             break
//         case "menu":
//             bot.deleteMessage(chatId, messageId+1)
//             const keyboardMenu = await mealController.inlineMealTypesKeyboard()
//             bot.editMessageText('Наше меню:', {chat_id:chatId, message_id:messageId, reply_markup:keyboardMenu})
//             bot.sendMessage(chatId, 'Для вызова главного меню нажмите "назад" или воспользуйтесь командой /menu', {reply_markup: {
//                 resize_keyboard: true,
//                 keyboard: [
//                     [
//                         "menu"
//                     ]
//                 ],
//             }})
//             break
//         case "yourOrder":
//             const order = await orderController.findOrderById(chatId)
//             if(order){
//                 if (order.meals.length > 0) {
//                     let sum = 0
//                     order.meals.map(m => {
//                         sum = sum + m.price
//                     })
//                     bot.sendMessage(chatId, `Общая стоимость вашего заказа\nсоставляет: ${sum} сум.`, {reply_markup:keyboard.orderKeyboard})
//                 } else {
//                     bot.sendMessage(chatId, "Вы еще ничего не заказали")
//                 }
//             } else {
//                 bot.sendMessage(chatId, "Вы еще ничего не заказали")
//             }
//             break
//         case "applyOrder":
//             bot.sendMessage(chatId, "Для подтверждения заказа укажите Ваше местоположение", {reply_markup: {
//                 resize_keyboard: true,
//                 one_time_keyboard: true,
//                 keyboard: [
//                     [
//                         {
//                             text: 'Отправить местоположение',
//                             request_location: true
//                         }
//                     ]
//                 ],
//             }})
//             break
//         case "displayOrder":
//             const displayOrder = await orderController.findOrderById(chatId)
//
//             bot.sendMessage(chatId, "Ваш заказ:")
//             displayOrder.meals.map(m => {
//                 bot.sendMessage(chatId, m.name + " - " + m.price + " сум.", {reply_markup:{
//                     inline_keyboard: [
//                         [
//                             {
//                                 text: 'Удалить',
//                                 callback_data: JSON.stringify({
//                                     query: 'remove',
//                                     mealUuid: m.uuid
//                                 })
//                             }
//                         ]
//                     ]
//                 }})
//             })
//
//             break
//         case "remove":
//             orderController.removeMeal(chatId, data.mealUuid)
//             bot.deleteMessage(chatId, messageId)
//              break
//         // case "interier":
//         //     const images = ["https://reston.com.ua/images/img/obzor_spezzo_svyatoshino_1.jpg",
//         //                     "https://reston.com.ua/images/img/obzor_spezzo_svyatoshino_2.jpg",
//         //                     "https://reston.com.ua/images/img/obzor_spezzo_svyatoshino_5.jpg",
//         //                     "https://reston.com.ua/images/img/obzor_spezzo_svyatoshino_4.jpg"]
//         //
//         //     images.map(i => {
//         //         bot.sendPhoto(chatId, i)
//         //     })
//         //     break
//         case "contacts":
//             bot.sendMessage(chatId, `Berezka\nтелефон:\n+998707153890\nоткрыт с 10:00 до 23:00`)
//             bot.sendLocation(chatId, 41.467602,  69.580107)
//             break
//         case "more":
//             const meal = await mealController.findMealByUuid(data.mealUuid)
//             const orderKeyboard = {
//                 inline_keyboard: [
//                     [
//                         {
//                             text: 'Заказать',
//                             callback_data: JSON.stringify({
//                                 query: 'order',
//                                 mealUuid: meal.uuid
//                             })
//                         }
//                     ]
//                 ]
//             }
//             bot.editMessageCaption(`${meal.name}\nЦена: ${meal.price} сум.\nИнгридиенты: ${meal.ingredients.join(', ')}\nВес: ${meal.weight} г.`, {chat_id:chatId, message_id:messageId, reply_markup:orderKeyboard})
//             break
//         case "order":
//             result = await orderController.addMeal(chatId, query.id, data.mealUuid)
//             console.log(result)
//             bot.answerCallbackQuery(result)
//             break
//         case "back":
//             bot.editMessageText(mainText, {chat_id:chatId, message_id:messageId, reply_markup:keyboard.mainKeyboard})
//             break
//         case "table":
//             bot.editMessageText("Желаете забронировать столик?", {chat_id:chatId, message_id:messageId, reply_markup:keyboard.tableKeyboard})
//             break
//         case "deleteTable":
//             tableController.tableDelete(chatId)
//             bot.editMessageText("Бронь отменена.", {chat_id:chatId, message_id:messageId})
//             break
//         default:
//             if (data.query == "tableTomorrow" || data.query == "tableAfterTomorrow"){
//                 if (data.query == "tableTomorrow"){
//                     result = await tableController.tableSetDate(chatId, tomorrow)
//                 } else {
//                     result = await tableController.tableSetDate(chatId, tomorrowPlusOne)
//                 }
//
//                 if(result){
//                     message = "Дата заказа установлена. Выберите время."
//                     bot.editMessageText(message, {chat_id:chatId, message_id:messageId, reply_markup:keyboard.timeKeyboard})
//                 } else {
//                     yourTable = await tableController.findTableById(chatId)
//                     message = `Вы уже заказали столик.\n${yourTable.date.getDate()+1} ${monthArr[yourTable.date.getMonth()]} ${yourTable.date.getFullYear()}\n${yourTable.date.getUTCHours()} часов\nЖелаете отменить заказ?`
//                     bot.editMessageText(message, {chat_id:chatId, message_id:messageId, reply_markup:keyboard.tableDeleteKeyboard})
//                 }
//             } else {
//                 if (data.query == 10 || data.query == 12 || data.query == 14 || data.query == 16) {
//                     result = await tableController.tableSetTime(chatId, data.query)
//                     yourTable = await tableController.findTableById(chatId)
//                     message = `Столик забронирован`
//                     bot.editMessageText(message, {chat_id:chatId, message_id:messageId})
//                 } else {
//                     const meals = await mealController.findMealsByTypeQuery(data.query)
//                     meals.map(m => {
//                         const text = `${m.name}\nЦена: ${m.price} сум.`
//                         bot.sendPhoto(chatId, m.img, {
//                             caption: text,
//                             reply_markup: {
//                                 inline_keyboard: [
//                                     [
//                                         {
//                                             text: 'Подробнее',
//                                             callback_data: JSON.stringify({
//                                                 query: 'more',
//                                                 mealUuid: m.uuid
//                                             })
//                                         }
//                                     ],
//                                     [
//                                         {
//                                             text: 'Заказать',
//                                             callback_data: JSON.stringify({
//                                                 query: 'order',
//                                                 mealUuid: m.uuid
//                                             })
//                                         }
//                                     ]
//                                 ]
//                             }
//                         })
//                     })
//                 }
//             }
//         break
//     }
// })
//   ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id+1)
// await ctx.telegram.editMessageText(ctx.message.chat.id, ctx.message.message_id-1,  ctx.message.message_id-1, 'asdasdasdasdasd',{
//     reply_markup:keyboardMenu
// })
// await ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id+1)
