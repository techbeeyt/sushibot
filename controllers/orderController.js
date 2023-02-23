const mongoose = require('mongoose')

require('../models/order.model')
require('../models/meal.model')
require('../models/user.model')
require('../models/agent.model')

const Meal = mongoose.model('meals')
const Order = mongoose.model('orders')
const User = mongoose.model('users')
const Agent = mongoose.model('agents')

class OrderController {

    // добавление блюда в заказ
    async addMeal(userId, queryId, mealUuid) {
        let orderPromise
        let count = Number(mealUuid);
        const order = await Order.findOne({telegramId: userId, served: "waiting"})
        const meal = await Meal.findOne({name: queryId})
        if (order) {
            let arr;
            let id;
            const a = order.meals.filter(p => meal.name === p.name);
            if (a[0]) {
                for (let i in order.meals) {

                    if (meal.name === order.meals[i].name) {
                        arr = order.meals[i];
                        id = i
                        arr.count += count;
                    }
                }
                if (arr) {
                    order.meals.splice(id, 1)
                    order.meals.unshift(arr)
                    orderPromise = order
                }
            } else {
                meal.count = count;
                order.meals.push(meal)
                orderPromise = order
            }
        } else {
            meal.count = count;
            orderPromise = new Order({
                telegramId: userId,
                meals: [meal],
//            count: 1
            })
        }
        await orderPromise.save()
        const answerText = 'Блюдо добавлено в Ваш заказ'
        const result = {
            callback_query_id: queryId,
            text: answerText
        }
        return result
    }

    async addMealFromId(userId, queryId, mealUuid) {
        let orderPromise
        let count = Number(mealUuid);
        // поиск заказа данного пользователя
        const order = await Order.findOne({telegramId: userId, served: "waiting"})
        // поиск блюда в базе данных
        const meal = await Meal.findOne({uuid: queryId})
        // проверка, существует ли заказ
        if (order) {
            // если заказ существует, добавление
            // блюда в заказ
            let arr;
            let id;
            const a = order.meals.filter(p => meal.name === p.name);
            if (a[0]) {
                for (let i in order.meals) {

                    if (meal.name === order.meals[i].name) {
                        arr = order.meals[i];
                        id = i
                        arr.count += count;
                        // order.meals.unshift(arr)
                        // orderPromise = order
                    }
                }
                if (arr) {
                    order.meals.splice(id, 1)
                    order.meals.unshift(arr)
                    orderPromise = order
                }
            } else {
                meal.count = count;
                order.meals.push(meal)
                orderPromise = order
            }
        } else {
            // если заказа не существует
            // создание заказа
            meal.count = count;
            orderPromise = new Order({
                telegramId: userId,
                meals: [meal],
//            count: 1
            })
        }
        // сохраниение изменений или нового заказа
        await orderPromise.save()

        // текст всплывающего сообщения
        const answerText = 'Добавлено в корзину! Savatizga kushildi!'

        // формирование ответа пользователю
        const result = {
            callback_query_id: queryId,
            text: answerText
        }
        return result
    }

    async addMess(userId, message) {
        let orderPromise
        const order = await Order.findOne({telegramId: userId, served: "waiting"})
        if (order) {
            order.mess = message
            orderPromise = order
        } else {
            orderPromise = new Order({
                telegramId: userId,
                mess: message
            })
        }
        await orderPromise.save()
        const answerText = 'Блюдо добавлено в Ваш заказ'
        return answerText
    }

    async findMess(userId) {
        const order = await Order.findOne({telegramId: userId, served: "waiting"})
        if (order.mess) {
            return true
        } else {
            return false
        }
    }

    // удаление блюда из заказа
    async removeMeal(userId, name) {
        // получение заказа из БД
        const order = await Order.findOne({telegramId: userId, served: "waiting"})

        // поиск блюда в списке заказанных
        for (let index = 0; index < order.meals.length; index++) {
            if (order.meals[index].name == name) {
                // удаление блюда
                order.meals.splice(index, 1)
                break
            }
        }


        if (order.meals.length < 1) {
            order.served = "deleted";
            await order.save()
            return order
        } else {
            await order.save();
            return order
        }
        // сохранение изменений
    }

    async deleteFullOrder(userId) {
        // получение заказа из БД
        const order = await Order.findOne({telegramId: userId, served: "waiting"})
        order.served = "deleted";
        await order.save();
        return order
    }

    // поиск заказа по id пользователя
    async findOrderById(userId) {
        return Order.findOne({telegramId: userId, served: "waiting"})
    }

    async findPersent() {
        return Agent.find({})
    }

    // подтверждение заказа
    async applyOrder(userId, type, location) {
        const order = await Order.findOne({telegramId: userId, served: "waiting"})
        const user = await User.findOne({telegramId: userId})
        let msg = "Вы еще ничего не заказали"

        // проверка на наличие заказа
        if (order) {
            // проверка на содержание в заказе блюд
            if (order.meals.length > 0) {
                // проверка подтвержден ли заказ
                order.typeorder = type
                // подтверждение заказа
                if (location.latitude) {
                    order.location = location
                } else {
                    order.address = location
                }
                await order.save()
                return {msg, userphone: user.phone_number}

            } else {
                return {msg, userphone: user.phone_number}
            }
        } else {
            return false
        }
    }


    async applyPayment(userId, payment) {
        const order = await Order.findOne({telegramId: userId, served: "waiting"})
        const user = await User.findOne({telegramId: userId})
        const agent = await Agent.find({})
        let msg = "Вы еще ничего не заказали"

        // проверка на наличие заказа
        if (order) {
            // проверка на содержание в заказе блюд
            // проверка подтвержден ли заказ
            order.payment = payment
            order.phone_number = user.phone_number
            order.orderdate = Date.now()
            order.name = user.first_name;
            let dostavka = getDistanceFromLatLonInKm(41.339946, 69.253936, order.location.latitude, order.location.longitude)
            console.log(dostavka)
            let dis =  Math.ceil(dostavka) - 5
            let dos = dis <= 0 ? 8000 : dis * 1200 + 8000
            if(dostavka - 3 <= 0) {
                dos = 0
            }
            if (user.language_code === 'ru') {
                let sum = 0;
                let persent = 0;
                msg = `✅ Ваш заказ: #${order.id}\n💳Способ оплаты: ${payment}\n📞 Телефон: ${user.phone_number}\n🏠Адрес:${order.address || 'geolocation'}\n\n`
                order.meals.map(m => {
                    sum = sum + (m.price * m.count);
                    msg += `${m.name}\n${m.count} x ${m.price} = ${prettify(m.count * m.price)}\n`
                })
                if (order.mess) {
                    msg += `📋Комментарий:\n${order.mess}\n`
                }
                if (agent[0]) {
                    agent.map(p => {
                        sum > Number(p.videourl) ? persent = Number(p.button) : persent;
                    })
                }
                // if (dos > 0) {
                //     msg += `\n+Стоимость доставки: ${dos}\n`
                // }
                if (persent > 0) {
                    let i = (sum / 100) * persent
                    msg += `\n% Скидка ${persent}% = ${i}`
                    msg += `📎 Итого: ${prettify(sum)} - ${prettify(i)} = ${prettify((sum - i))}`
                    order.count = sum + dos;
                    order.percent = persent;
                    order.percentsum = i;
                    await order.save()
                } else {
                    msg += `📎 Итого: ${prettify(sum)}`
                    //msg += `📎 Итого: ${prettify(sum + dos)}`
                    //order.count = sum + dos;
                    order.count = sum;
                    order.dos = dos;
                    await order.save()
                }
            } else {
                let sum = 0;
                let persent = 0;
                msg = `✅ Sizning buyurtmangiz: #${order.id}\n💳 To'lov turi: ${payment}\n📞 Telefon: ${user.phone_number}\n🏠Manzil:${order.address || 'geolocation'}\n\n`
                order.meals.map(m => {
                    sum = sum + (m.price * m.count);
                    msg += `${m.name}\n${m.count} x ${m.price} = ${prettify(m.count * m.price)}\n`
                })
                if (order.mess) {
                    msg += `📋Comment:\n${order.mess}\n`
                }
                if (agent[0]) {
                    agent.map(p => {
                        sum > Number(p.videourl) ? persent = Number(p.button) : persent = 0;
                    })
                }
                // if (dos > 0) {
                //     msg += `\nYetkazib berish narxi: ${dos}\n`
                // }
                if (persent > 0) {
                    let i = (sum / 100) * persent
                    msg += `\n% Chegirma ${persent}% = ${i}`
                    msg += `📎 Umumiy: ${prettify(sum)} - ${prettify(i)} = ${prettify((sum - i))}`
                    order.count = sum + dos;
                    order.percent = persent;
                    order.percentsum = i;
                    await order.save()
                } else {
                    //msg += `📎 Umumiy: ${prettify(sum+dos)}`
                    msg += `📎 Umumiy: ${prettify(sum)}`
                    //order.count = sum + dos;
                    order.count = sum;
                    order.dos = dos;
                    await order.save()
                }
            }


            // if (payment === '💳 Payme' || '💳 Click') {
            //     let prices = []
            //     if (order.percent > 0) {
            //         await order.meals.map(m => {
            //             let label = m.name;
            //             let amount = (m.price * m.count * 100)-(((m.price * m.count * 100)/100)*order.percent)
            //             prices.push({label, amount})
            //         })
            //     } else {
            //         await order.meals.map(m => {
            //             let label = m.name;
            //             let amount = m.price * m.count * 100
            //             prices.push({label, amount})
            //         })
            //     }
            //     return {
            //         prices: prices,
            //         orderId: order.id,
            //         msg: msg
            //     }
            // } else {
            return {
                msg: msg,
                orderId: order.id
            }
            // }

        } else {
            return msg
        }
    }


    async applyToAdmin(userId) {
        const order = await Order.findOne({telegramId: userId, served: "waiting"})
        const user = await User.findOne({telegramId: userId})
        let msg = "Вы еще ничего не заказали"

        // проверка на наличие заказа
        if (order) {
            // проверка на содержание в заказе блюд
            order.served = "Served";
            order.orderdate = Date.now()
            await order.save();
            let sum = 0;
            let usermsg;
            if (user.language_code === 'ru') {
                usermsg = `✅ Заказ передан на обработку!\nЖдите звонка оператора!`;
            } else {
                usermsg = `✅ Buyurtma qayta ishlashga yuborildi!\nOperator qo'ng'irog'ini kuting!`
            }

            msg = `📄Заказ: #${order.id}\n📲Телефон:${user.phone_number}\nСпособ оплаты: ${order.payment}\n🙎‍♂️ Имя:${user.first_name}\nТип заказа: ${order.typeorder}\nАдрес: ${order.address || 'geolocation'}\n`
            order.meals.map(m => {
                sum = sum + (m.price * m.count);
                msg += `${m.name}\n${m.count} x ${m.price} = ${prettify(m.count * m.price)}\n`
            })
            if (order.mess) {
                msg += `📋Комментарий:\n${order.mess}\n`
            }
            // msg += `\n Стоимость доставки: ${order.dos}\n`
            if (order.percent > 0) {
                msg += `\n% Скидка ${order.percent}% = ${order.percentsum}`
                msg += `\n📎 Итого: ${prettify(sum)} - ${prettify(order.percentsum)} = ${prettify(sum - order.percentsum)}`
            } else {
                // msg += `\n\nИтого: ${prettify(sum + order.dos)}`
                msg += `\n\nИтого: ${prettify(sum)}`
            }
            return {
                msg: msg,
                usermsg: usermsg,
                location: order.location,
                address: order.address,
                data: order.id
            }
        } else {
            return msg
        }
    }

    async applyToAdminPayment(userId, provider_payment_charge_id) {
        const order = await Order.findOne({telegramId: userId, served: "apply"})
        const user = await User.findOne({telegramId: userId})
        let msg = "Вы еще ничего не заказали"

        // проверка на наличие заказа
        if (order) {
            // проверка на содержание в заказе блюд
            order.served = "Served";
            order.status = "Оплачен"
            order.provider_payment_charge_id = provider_payment_charge_id;
            order.orderdate = Date.now()
            await order.save();
            return order
        } else {
            return false
        }
    }

    // заказ пользователя для менеджера
    async orderList(userId) {
        // получение заказа из БД
        const order = await Order.findOne({telegramId: userId, served: "waiting"})
        const user = await User.findOne({telegramId: userId})

        let orderList = `Пользователь ${userId} ${user.phone_number} заказал:\n`
        // формирование списка заказа
        order.meals.map(m => {
            orderList = orderList + m.name + " " + m.price + "\n"
        })


        return orderList
    }


    // подтверждение заказа
    async orderStatus(userId, status) {
        // получение заказа из БД
        const order = await Order.findOne({telegramId: userId, served: "Served"})

        // отметка о выполнении заказа
        order.served = status
        if (order) {
            order.served = status
            await order.save()
            return order
        }
        return false
        // сохранение изменений

    }

    async orderStatusGet(userId, status) {
        // получение заказа из БД
        const order = await Order.findOne({telegramId: userId, served: "apply"})
        if (order) {
            order.served = status
            await order.save()
        } else {
            return false
        }
        // отметка о выполнении заказа

        // сохранение изменений

        // mid// telegramId// mealname// mealcount// mealprice// mealsum// served// location// count
        // payment// photo// orderdate
        // name// typeorder// address
        // database// mess// percent// default// percentsum// default// status// provider_payment_charge_id// phone_number


    }

    async orderStatusState(userId, status) {
        // получение заказа из БД
        const order = await Order.findOne({telegramId: userId, served: "apply"})

        // отметка о выполнении заказа
        if (order) {
            order.served = status
            await order.save()
        } else {
            console.log(false)
        }

        // сохранение изменений

    }
}


function prettify(num) {
    var n = num.toString();
    return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

module
    .exports = new OrderController()
