const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const keyboard = require('../keyboard')
const userController = require('../controllers/userController')


const settingsScene = new Scene('settingsScene')
settingsScene.enter((ctx) => {
    ctx.reply(ctx.i18n.t('keyboard.settings'), {
        parse_mode: "HTML",
        reply_markup: keyboard[ctx.i18n.locale()].settings,
    })
})
settingsScene.leave()
settingsScene.hears(/^\+(\d{12})$/, async (ctx) => {
    const user = await userController.registerNumber(ctx.chat.id, ctx.message.text)
    ctx.scene.enter('mainstage')
})
settingsScene.hears(match('keyboard.changelang'), (ctx) => {
    ctx.reply(ctx.i18n.t('keyboard.changelang'), {
        parse_mode: "HTML",
        reply_markup: keyboard[ctx.i18n.locale()].langsettings,
    })
})
settingsScene.hears(match('keyboard.langru'), async (ctx) => {
    const user = await userController.registerLang(ctx.from, 'ru');
    ctx.i18n.locale('ru')
    ctx.scene.enter('settingsScene')
})
settingsScene.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.reenter()
})
settingsScene.hears(match('keyboard.menu'), (ctx) => {
    ctx.scene.enter('mainstage')
})
// Set locale to `ru`
settingsScene.hears(match('keyboard.languz'), async (ctx) => {
    const user = await userController.registerLang(ctx.from, 'uz');
    ctx.i18n.locale('uz')
    ctx.scene.enter('settingsScene')
})

settingsScene.hears(match('keyboard.changephone'), (ctx) => {
    const message = ctx.i18n.t('phone')
    ctx.replyWithHTML(message, {
        parse_mode: "HTML",
        reply_markup: keyboard[ctx.i18n.locale()].phonesettings,
    })
})
settingsScene.command('start', ctx => ctx.scene.enter('contact'))
settingsScene.on(['contact'], async (ctx) => {
    const user = await userController.registerNumber(ctx.chat.id, ctx.message.contact.phone_number)
    ctx.scene.enter('mainstage')
})

module.exports = settingsScene
