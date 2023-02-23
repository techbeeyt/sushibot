const mongoose = require('mongoose')
const _ = require('lodash')

require('../models/meal.model')
require('../models/category.model')
require('../models/main.model')
const Meal = mongoose.model('meals')
const Category = mongoose.model('categorys')
const Main = mongoose.model('mains')

class MealController {

    // Поиск блюда по uuid
    findMealByUuid(query) {
        return Meal.findOne({uuid: query})
    }

    async findMealByName(query) {
        const meals = await Meal.findOne({name: query}).sort({sort: 1});
        return meals;
    }

    async findUrl(query) {
        const meals = await Category.findOne({button: query})
        if (meals) {
            if (meals.videourl) {
                return meals.videourl;
            } else return null
        } else {
            return null
        }
    }

    // Поиск блюд по типу
    async findMealsByTypeQuery(query, lang) {
        const meals = await Meal.find({
            $or: [{type: query, lang: lang}, {
                subcategory: query,
                lang: lang
            }]
        }).sort({sort: 1});
        let types = []
        let type = []

        // формирование массива типов блюд
        meals.map(m => types.push(m.name))
        // удаление повторяющихся типов
        types = _.uniq(types);

        for (var i = 0; i < types.length; i += 2) {
            types[i + 1] ? type.push([{text: types[i]}, {text: types[i + 1]}]) : type.push([{text: types[i]}])
        }
        // добавление кнопки "назад"
        if (lang === 'uz') {
            type.unshift([{text: '📥 Savat'},{text: '⏫'}])
            type.push([{text: '⬅️ Menyu'}, {text: '⬅️ Orqaga'}])
        } else {
            type.unshift([{text: '📥 Корзина'},{text: '⏫ Список'}])
            type.push([{text: '🏠 На главную'}, {text: '⬅️ назад'}])
        }
        // добавление кнопки "назад"


        // формирование клавиатуры
        type = {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: type
        }

        // возврат клавиатуры типов
        return type
    }

    async findAllMealsByTypeQuery(query, lang) {
        const meals = await Meal.find({
            $or: [{type: query, lang: lang, isIsset: true}, {
                subcategory: query,
                lang: lang
            }]
        }).sort({sort: 1});
        let types = []
        // формирование массива типов блюд
        meals.map(m => {
            types.push(m)
        })
        // удаление повторяющихся типов
        types = _.uniq(types);

        // возврат клавиатуры типов
        return types
    }
    async findContacts(lang) {
        const meals = await Category.findOne({button: 'about', lang: lang})
        return meals
    }
    async searchAllMealsByTypeQuery(query, lang) {
        const meals = await Meal.find({name: {$regex: query, $options: "i"}, lang: lang}).sort({sort: 1});
        let types = []
        // формирование массива типов блюд
        meals.map(m => {
            types.push(m)
        })
        // удаление повторяющихся типов
        types = _.uniq(types);

        // возврат клавиатуры типов
        return types
    }

    async searchMealsByTypeQuery(query, lang) {
        const meals = await Meal.find({name: {$regex: query, $options: "i"}, lang: lang})
        let types = []
        let type = []
        if (meals[0]) {

            // формирование массива типов блюд
            meals.map(m => types.push(m.name))
            // удаление повторяющихся типов
            types = _.uniq(types);
            if (lang === 'uz') {
                types.unshift('⏫')
                types.unshift('📥 Savat')
            } else {
                types.unshift('⏫ Список')
                types.unshift('📥 Корзина')
            }
            for (var i = 0; i < types.length; i += 2) {
                types[i + 1] ? type.push([{text: types[i]}, {text: types[i + 1]}]) : type.push([{text: types[i]}])
            }
            // добавление кнопки "назад"
            if (lang === 'uz') {
                type.push([{text: '⬅️ Menyu'}, {text: '⬅️ Orqaga'}])
            } else {
                type.push([{text: '🏠 На главную'}, {text: '⬅️ назад'}])
            }
            // добавление кнопки "назад"


            // формирование клавиатуры
            type = {
                resize_keyboard: true,
                one_time_keyboard: false,
                keyboard: type
            }


            // возврат клавиатуры типов
            return {type, types}
        } else {
            return false
        }
    }

    async findMaincategory(query, lang) {
        const meals = await Category.find({maincategory: query, lang: lang}).sort({sort: 1});
        if (meals[0]) {
            return true
        } else {
            return false
        }
    }

    // Формирование клавиатуры с типами блюд
    async inlineMealTypesKeyboard(query, lang) {
        // получение полного списка блюд
        const meals = await Category.find({maincategory: query, lang: lang}).sort({sort: 1});
        let types = []
        let type = []
        if (meals[0].sort === 10000) {
            meals.map(m => types.push(m.button))
            for (var i = 0; i < types.length; i += 2) {
                types[i + 1] ? type.push([{text: types[i]}, {text: types[i + 1]}]) : type.push([{text: types[i]}])
            }
            if (lang === 'uz') {
                type.push([{text: '⬅️ Orqaga'}])
            } else {
                type.push([{text: '⬅️ назад'}])
            }
        } else {
            // формирование массива типов блюд
            meals.map(m => types.push(m.button))

            for (var i = 0; i < types.length; i += 2) {
                types[i + 1] ? type.push([{text: types[i]}, {text: types[i + 1]}]) : type.push([{text: types[i]}])
            }
            // добавление кнопки "назад"
            if (lang === 'uz') {
                type.push([{text: '🚖 Buyurtma berish'}])
                type.push([{text: '📥 Savat'}, {text: '⬅️ Orqaga'}])
            } else {
                type.push([{text: '🚖 Оформить заказ'}])
                type.push([{text: '📥 Корзина'}, {text: '⬅️ назад'}])
            }
        }
        // формирование клавиатуры
        type = {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: type
        }

        // возврат клавиатуры типов
        return type


    }


    async inlineMealMainKeyboard(lang) {
        // получение полного списка блюд
        const meals = await Main.find({lang: lang}).sort({sort: 1});
        let types = []
        let type = []

        // формирование массива типов блюд
        meals.map(m => types.push(m.button))

        // for (var i = 0; i < types.length; i += 2) {
        //     types[i + 1] || i !==0 ? type.push([{text: types[i]}, {text: types[i + 1]}]) : type.push([{text: types[i]}])
        // }
        meals.map(t => {
            if (!type[t.sort]) {
                type[t.sort] = []
            }
            type[t.sort].push({text: t.button})
        })
        // добавление кнопки "назад"


        // формирование клавиатуры
        type = {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: type
        }

        // возврат клавиатуры типов
        return type
    }

    async inlineMealSubtypesKeyboard(query, lang) {
        // получение полного списка блюд
        const meals = await Category.findOne({button: query, lang: lang}).sort({sort: 1});
        ;

        let types = []
        let type = []
        if (~meals.subcategory.length) {
            // формирование массива типов блюд
            meals.subcategory.map(m => types.push(m))
            for (var i = 0; i < types.length; i += 2) {
                types[i + 1] ? type.push([{text: types[i]}, {text: types[i + 1]}]) : type.push([{text: types[i]}])
            }
            // добавление кнопки "назад"
            if (lang === 'uz') {
                type.unshift([{text: '📥 Savat'}])
                type.push([{text: '⬅️ Menyu'}, {text: '⬅️ Orqaga'}])
            } else {
                type.unshift([{text: '📥 Корзина'}])
                type.push([{text: '🏠 На главную'}, {text: '⬅️ назад'}])
            }


            // добавление кнопки "назад"

            // формирование клавиатуры
            type = {
                resize_keyboard: true,
                one_time_keyboard: false,
                keyboard: type
            }

            // возврат клавиатуры типов
            return type
        } else {
            return false;
        }
    }


    async searchSubtypesKeyboard(query, lang) {
        // получение полного списка блюд
        const meals = await Category.findOne({button: query, lang: lang});
        if (meals) {
            if (meals.subcategory[1]) {
                return true
            } else {
                return false;
            }
        } else return false
    }

}

module.exports = new MealController()
