const Scene = require('telegraf/scenes/base')
const {match} = require('telegraf-i18n')
const orderController = require('../controllers/orderController')
const keyboard = require('../keyboard')


const basket = new Scene('basket')

basket.enter(async (ctx) => {
    const order = await orderController.findOrderById(ctx.message.from.id)
    const agent = await orderController.findPersent()
    let sum = 0;
    let text = `${ctx.i18n.t('keyboard.basket')}\n`
    order.meals.map(m => {
        sum = sum + (m.price * m.count);
        text += `<b>${m.name}</b>\n${m.count} x ${m.price} = <b>${prettify(m.count * m.price)} ${ctx.i18n.t('currency')}.</b>\n`
    })
    let deleteOrders = [];

    order.meals.map(m => {
        deleteOrders.push([{text: `❌ ${m.name}`}])
    })
    // text += `${ctx.i18n.t('dostavkamess')} = <b>${prettify(20000)} ${ctx.i18n.t('currency')}.</b>\n`
    deleteOrders.push([{
        text: ctx.i18n.t('keyboard.back')
    }, {
        text: ctx.i18n.t('keyboard.clear')
    }], [{
        text: ctx.i18n.t('keyboard.order'),
    }])
    var persent = 0
    if (agent[0]) {
        agent.map(p => {
            sum > Number(p.videourl) ? persent = Number(p.button) : persent;
        })
    }
    if (persent > 0) {
        let i = (sum / 100) * persent;
        text += `\n${ctx.i18n.t('persents')} ${persent}% = ${i}`
        text += `\n📎<b>${ctx.i18n.t('lastprice')}: ${prettify(sum)} - ${prettify(i)} = ${prettify(sum - i)}${ctx.i18n.t('currency')}.</b>`
    } else {
        text += `\n<b>${ctx.i18n.t('lastprice')}: ${prettify(sum)} ${ctx.i18n.t('currency')}.</b>`
    }
    await ctx.replyWithHTML(text, {
        reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: deleteOrders
        }
    })
    // ctx.replyWithHTML(ctx.i18n.t('dostavka'))
})
basket.leave()
// basket.hears(/^🚚/, (ctx) => {
//     ctx.session.main = 'basket';
//     ctx.scene.enter('maincategory')
// })
basket.hears(match('keyboard.go'), (ctx) => {
    ctx.session.dostavka = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('address'), {
        parse_mode: "HTML", /////////////////////////////////////////////////////////////////////////////////////////////
        reply_markup: keyboard[ctx.i18n.locale()].requestaddress
    })
})
basket.hears(match('keyboard.go'), (ctx) => {
    ctx.session.dostavka = ctx.message.text;
    ctx.replyWithHTML(ctx.i18n.t('address'), {
        parse_mode: "HTML", /////////////////////////////////////////////////////////////////////////////////////////////
        reply_markup: keyboard[ctx.i18n.locale()].requestaddress
    })
})
basket.hears(`📋Добавить Дополнительный список`, (ctx) => {
    ctx.session.list = 'basket'
    ctx.scene.enter('list')
})
basket.hears(`📋Измнить Дополнительный список`, (ctx) => {
    ctx.session.list = 'basket'
    ctx.scene.enter('list')
})
basket.hears(match('keyboard.order'), async (ctx) => {
    var d = new Date()
    var day = d.getDay()
    var hour = d.getHours()
    console.log(day)
    console.log(hour)
    // if(day === 5 || day === 7 || day === 6) {
    //     ctx.replyWithHTML(`Извините мы не работаем в пятницу, субботу и в воскресенье связи с ограничением`)
    //
    // } else {
        const user = await orderController.applyOrder(ctx.message.from.id, ctx.session.dostavka, 'Null');
        ctx.scene.enter('contact')
    // }
})
basket.hears(match('keyboard.back'), (ctx) => {
    ctx.scene.enter(ctx.session.basket || 'mainstage')
})


basket.hears(match('keyboard.menu'), (ctx) => {
    ctx.scene.enter('mainstage')
})

basket.hears(/^\❌/, async (ctx) => {
    let mealName = ctx.message.text.slice(2);
    const removeOrder = await orderController.removeMeal(ctx.message.from.id, mealName)
    if (removeOrder.served === 'deleted') {
        ctx.scene.enter('mainstage')
    } else {
        ctx.scene.enter('basket')
    }
})

basket.hears(match('keyboard.clear'), async (ctx) => {
    const removeOrder = await orderController.deleteFullOrder(ctx.message.from.id)
    if (removeOrder.served === 'deleted') {
        ctx.scene.enter('mainstage')
    } else {
        ctx.scene.enter('basket')
    }
})
// basket.on('text', async (ctx) => {
//     const user = await orderController.applyOrder(ctx.message.from.id, 'Доставка', ctx.message.text);
//     ctx.scene.enter('aplyorder')
//     // if (!ctx.session.dostavka) {
//     //     ctx.scene.reenter()
//     // } else {
//     //     const user = await orderController.applyOrder(ctx.message.from.id, ctx.session.dostavka, ctx.message.text);
//     //     ctx.scene.enter('aplyorder')
//     // }
// })

// basket.on(['location'], async (ctx) => {
//     ctx.session.addressset = true;
//     const user = await orderController.applyOrder(ctx.message.from.id, 'Доставка', ctx.message.location);
//     ctx.scene.enter('aplyorder')
//     // if (!ctx.session.dostavka) {
//     //     ctx.scene.reenter()
//     // }
//     // ctx.reply(ctx.i18n.t('geo'))     //////////////////////////////////////////////
//     // ctx.session.addressset = true;
//     // const user = await orderController.applyOrder(ctx.message.from.id, ctx.session.dostavka, ctx.message.location);
//     // ctx.scene.enter('aplyorder')
// })

function prettify(num) {
    var n = num.toString();
    return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
}

module.exports = basket
