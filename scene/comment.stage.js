const Scene = require('telegraf/scenes/base')
const keyboard = require('../keyboard')
const {match} = require('telegraf-i18n')
const userController = require('../controllers/userController')
const config = require('../config')





const comment = new Scene('comment')
comment.enter((ctx) => {
    ctx.reply(ctx.i18n.t('commentmsg'), {
        parse_mode: "HTML",
        reply_markup: keyboard[ctx.i18n.locale()].commentstar
    })

});

comment.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter('mainstage')
})
comment.command('start', (ctx) => {
    ctx.scene.enter('mainstart')
})
comment.on('text', async (ctx) => {
    if (ctx.message.text.length > 1000) {
        ctx.reply(ctx.i18n.t('message'))
    } else {
        const user = await userController.findOrderById(ctx.from);
        ctx.telegram.sendMessage(config.MANAGER_CHAT_ID,
            `🔈Отзыв от <a href="tg://user?id=${ctx.message.from.id}">🙎‍♂️Пользователя</a>\n ${user.phone_number}\n✍️Сообщение: ${ctx.message.text}`
            , {
                parse_mode: "HTML"
            });
        ctx.reply(ctx.i18n.t('messagesend'))
    }
    ctx.scene.enter('mainstart')
})

module.exports = comment
