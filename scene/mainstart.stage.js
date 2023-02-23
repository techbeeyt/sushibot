const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const keyboard = require('../keyboard')
const userController = require('../controllers/userController')

const mainstart = new Scene('mainstart')
mainstart.enter(async (ctx) => {
    const user = await userController.findOrderById(ctx.from);

    if (user.language_code === 'none') {
        const message = ctx.i18n.t('greeting', {
            username: ctx.from.username,
        })
        await ctx.replyWithHTML(message)
        ctx.reply(ctx.i18n.t('postgreeting'), {
            parse_mode: "HTML",
            reply_markup: keyboard[ctx.i18n.locale()].langregister,
        })
    }

    // else if (!user.day) {
    //     ctx.i18n.locale(user.language_code)
    //     ctx.scene.enter('date')
    //
    // }
    else {
        console.log(user.language_code)
       await ctx.i18n.locale(user.language_code)
        ctx.scene.enter('mainstage')
    }
});
mainstart.leave()
mainstart.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter('mainstart')
})
mainstart.hears(match('keyboard.langru'), async (ctx) => {
    const user = await userController.registerLang(ctx.from, 'ru');
    ctx.i18n.locale('ru')
    ctx.scene.enter('mainstage')
})

// Set locale to `ru`
mainstart.hears(match('keyboard.languz'), async (ctx) => {
    const user = await userController.registerLang(ctx.from, 'uz');
    ctx.i18n.locale('uz')
    ctx.scene.enter('mainstage')
})
mainstart.command('start', (ctx) => {
    ctx.scene.enter('mainstart')
})
mainstart.on('text', (ctx) => {
    ctx.scene.enter('mainstart')
})

module.exports = mainstart
