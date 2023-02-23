// module.exports = {
//     langregister:{
//         resize_keyboard: true,
//         one_time_keyboard: true,
//         keyboard: [
//             [
//                 {
//                     text: '🇷🇺 Русский'
//                 },
//                 {
//                     text: '🇺🇿 O\'zbekcha'
//                 }
//             ]
//         ]
//     },
//
//     contactReques:{
//         resize_keyboard: true,
//         one_time_keyboard: true,
//         keyboard: [
//             [
//                 {
//                     text: '☎️ Отправить контакт',
//                     request_contact: true
//                 }
//             ]
//         ]
//     },
//     // Клавиатура для главного меню
//     mainKeyboard: {
//         inline_keyboard: [
//             [
//                 {
//                     text: '🧾Меню',
//                     callback_data: JSON.stringify({
//                         query: 'menu'
//                     })
//                 }
//             ],
//             [
//                 {
//                     text: '🛒 Ваш заказ',
//                     callback_data: JSON.stringify({
//                         query: 'yourOrder'
//                     })
//                 }
//             ],
//             [
//                 {
//                     text: '🍽 Бронь столиков',
//                     callback_data: JSON.stringify({
//                         query: 'table'
//                     })
//                 }
//             ],
//             // [
//             //     {
//             //         text: 'интерьер',
//             //         callback_data: JSON.stringify({
//             //             query: 'interier'
//             //         })
//             //     }
//             // ],
//             [
//                 {
//                     text: '☎️ Kонтакты',
//                     callback_data: JSON.stringify({
//                         query: 'contacts'
//                     })
//                 }
//             ]
//         ]
//     },
//
//     // Клавиатура для заказа
//     orderKeyboard:{
//         inline_keyboard: [
//             [
//                 {
//                     text: 'подтвердить',
//                     callback_data: JSON.stringify({
//                         query: 'applyOrder'
//                     })
//                 }
//             ],
//             [
//                 {
//                     text: 'Посмотреть',
//                     callback_data: JSON.stringify({
//                         query: 'displayOrder'
//                     })
//                 }
//             ]
//         ]
//     },
//
//     // Клавиатура для брони столиков
//     tableKeyboard:{
//         inline_keyboard: [
//             [
//                 {
//                     text: 'завтра',
//                     callback_data: JSON.stringify({
//                         query: 'tableTomorrow'
//                     })
//                 }
//             ],
//             [
//                 {
//                     text: 'послезавтра',
//                     callback_data: JSON.stringify({
//                         query: 'tableAfterTomorrow'
//                     })
//                 }
//             ]
//         ]
//     },
//
//     // Клавиатура для выбора времени
//     timeKeyboard:{
//         inline_keyboard: [
//             [
//                 {
//                     text: '10:00',
//                     callback_data: JSON.stringify({
//                         query: '10'
//                     })
//                 }
//             ],
//             [
//                 {
//                     text: '12:00',
//                     callback_data: JSON.stringify({
//                         query: '12'
//                     })
//                 }
//             ],
//             [
//                 {
//                     text: '14:00',
//                     callback_data: JSON.stringify({
//                         query: '14'
//                     })
//                 }
//             ],
//             [
//                 {
//                     text: '16:00',
//                     callback_data: JSON.stringify({
//                         query: '16'
//                     })
//                 }
//             ]
//         ]
//     },
//
//     // Клавиатура для отмены брони
//     tableDeleteKeyboard:{
//         inline_keyboard: [
//             [
//                 {
//                     text: 'Отменить бронь',
//                     callback_data: JSON.stringify({
//                         query: 'deleteTable'
//                     })
//                 }
//             ]
//         ]
//     }
// }
var keys = {
    ru: {
        langregister: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🇺🇿 O\'zbekcha'
                    },
                    {
                        text: '🇷🇺 Русский'
                    }
                ]
            ]
        },
        payment: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '💵 Наличные'
                    }
                ],

                [
                    {
                        text: '💳 Click'
                    }
                ],
                [
                    {
                        text: '⬅️ назад'
                    }
                ]
            ]
        },
        langsettings: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🇷🇺 Русский'
                    },
                    {
                        text: '🇺🇿 O\'zbekcha'
                    }
                ], [
                    {
                        text: '⬅️ назад'
                    }
                ]
            ]
        },
        settings: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🇷🇺Изменить язык'
                    },
                    {
                        text: 'Изменить номер'
                    }
                ],
                [
                    {
                        text: '🏠 На главную'
                    }
                ]
            ]
        },
        phonesettings: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '☎️ Отправить контакт',
                        request_contact: true
                    }
                ],
                [
                    {
                        text: '⬅️ назад'
                    }
                ]
            ]
        },
        numbers: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '1'
                    },
                    {
                        text: '2'
                    },
                    {
                        text: '3'
                    }
                ],
                [
                    {
                        text: '4'
                    },
                    {
                        text: '5'
                    },
                    {
                        text: '6'
                    }
                ],
                [
                    {
                        text: '7'
                    },
                    {
                        text: '8'
                    },
                    {
                        text: '9'
                    }
                ],
                [
                    {
                        text: '📥 Корзина'
                    },
                    {
                        text: '⬅️ назад'
                    }
                ]
            ]
        },

        contactReques: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '☎️ Отправить контакт',
                        request_contact: true
                    },
                ],
                [
                    {
                        text: '⬅️ назад'
                    }
                ]
            ]
        },
        mainmenu: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🛍 Заказать',
                    }
                ],
                [
                    {
                        text: '📥 Корзина'
                    }
                ],

                [
                    {
                        text: '☎️ Наши контакты',
                    }
                ],

                [
                    {
                        text: '⚙️ Настройки',
                    }
                ]
            ]
        },
        mainstart: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🍽 ️ Заказать еду',
                    }
                ],
                [
                    {
                        text: '📥 Позвать специалиста'
                    }
                ],

                [
                    {
                        text: '☎️ Продать купить квартиру',
                    }
                ],

                [
                    {
                        text: '⚙️ Настройки',
                    }
                ]
            ]
        },
        aplyorder: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🚖 Доставка',
                    },
                    {
                        text: '🏃 Самовывоз',
                    },
                ],
                [
                    {
                        text: '⬅️ назад'
                    }
                ]
            ]
        },
        requestaddress: {
            resize_keyboard: true,
            one_time_keyboard: true,
            keyboard: [
                [
                    {
                        text: '🗺 Отправить геолокацию',
                        request_location: true
                    }
                ],
                [
                    {
                        text: '⬅️ назад',
                    }
                ]

            ]
        },
        agree: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '✅ Заказываю!'
                    }
                ],
                [
                    {
                        text: '❌ Отменить'
                    }
                ]
            ]
        },
        commentstar: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🌟🌟🌟🌟🌟'
                    }
                ],
                [
                    {
                        text: '🌟🌟🌟🌟'
                    }
                ],
                [
                    {
                        text: '🌟🌟🌟'
                    }
                ],
                [
                    {
                        text: '🌟🌟'
                    }
                ],
                [
                    {
                        text: '🌟'
                    }
                ],
                [
                    {
                        text: '⬅️ назад'
                    }
                ]
            ]
        },
        comment: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '⬅️ назад'
                    }
                ]
            ]
        },
        apply: (ctx, data) => {
            return {
                inline_keyboard: [
                    [
                        {
                            text: 'Подтвердить',
                            callback_data: JSON.stringify({
                                query: 'apply',
                                userId: ctx.message.from.id,
                                data: data
                            })
                        },
                        {
                            text: 'Отказать',
                            callback_data: JSON.stringify({
                                query: 'reject',
                                userId: ctx.message.from.id,
                                data: data
                            })
                        }
                    ]
                ]
            }
        },
        basket: (ctx, data, num) => {
            return {
                inline_keyboard: [
                    [
                        {
                            text: '-',
                            callback_data: JSON.stringify({
                                query: 'del',
                                userId: ctx,
                                data: `${data},${num}`
                            })
                        },
                        {
                            text: num,
                            callback_data: JSON.stringify({
                                query: 'num',
                                userId: ctx,
                                data: `${data},${num}`
                            })
                        },
                        {
                            text: '+',
                            callback_data: JSON.stringify({
                                query: '+',
                                userId: ctx,
                                data: `${data},${num}`
                            })
                        }
                    ],
                    [
                        {
                            text: '📥 Добавить в корзину',
                            callback_data: JSON.stringify({
                                query: 'addtobasket',
                                userId: ctx,
                                data: `${data},${num}`
                            })
                        }
                    ]
                ]
            }
        }

        // Клавиатура для главного меню
    },
    uz: {
        basket: (ctx, data, num) => {
            return {
                inline_keyboard: [
                    [
                        {
                            text: '-',
                            callback_data: JSON.stringify({
                                query: 'del',
                                userId: ctx,
                                data: data+','+num
                            })
                        },
                        {
                            text: num,
                            callback_data: JSON.stringify({
                                query: 'num',
                                userId: ctx,
                                data: data+','+num
                            })
                        },
                        {
                            text: '+',
                            callback_data: JSON.stringify({
                                query: '+',
                                userId: ctx,
                                data: data+','+num
                            })
                        }
                    ],
                    [
                        {
                            text: '📥 Добавить в корзину',
                            callback_data: JSON.stringify({
                                query: 'addtobasket',
                                userId: ctx,
                                data: data+','+num
                            })
                        }
                    ]
                ]
            }
        },
        langregister: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🇺🇿 O\'zbekcha'
                    },
                    {
                        text: '🇷🇺 Русский'
                    }
                ]
            ]
        },
        langsettings: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🇷🇺 Русский'
                    },
                    {
                        text: '🇺🇿 O\'zbekcha'
                    }
                ], [
                    {
                        text: '⬅️ Orqaga'
                    }
                ]
            ]
        },
        settings: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🇺🇿 Tilni tanlang'
                    },
                    {
                        text: 'Raqamni o\'zgartirish'
                    }
                ],
                [
                    {
                        text: '⬅️ Menyu'
                    }
                ]
            ]
        },
        phonesettings: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '☎️ Контактни тушурворинг',
                        request_contact: true
                    }
                ],
                [
                    {
                        text: '⬅️ Orqaga'
                    }
                ]
            ]
        },
        numbers: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '1'
                    },
                    {
                        text: '2'
                    },
                    {
                        text: '3'
                    }
                ],
                [
                    {
                        text: '4'
                    },
                    {
                        text: '5'
                    },
                    {
                        text: '6'
                    }
                ],
                [
                    {
                        text: '7'
                    },
                    {
                        text: '8'
                    },
                    {
                        text: '9'
                    }
                ],
                [
                    {
                        text: '📥 Savat'
                    },
                    {
                        text: '⬅️ Orqaga'
                    }
                ]
            ]
        },

        contactReques: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '☎️ Контактни тушурворинг',
                        request_contact: true
                    }
                ],
                [
                    {
                        text: '⬅️ Orqaga'
                    }
                ]
            ]
        },
        mainmenu: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🛍 Buyurtma berish',
                    }
                ],
                [
                    {
                        text: '📥 Savat'
                    }
                ],

                [
                    {
                        text: '☎️ Bizning aloqalar',
                    }
                ],

                [
                    {
                        text: '⚙️ Sozlamalar',
                    }
                ]
            ]
        },
        mainstart: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🍽 ️ Заказать еду',
                    }
                ],
                [
                    {
                        text: '📥 Позвать специалиста'
                    }
                ],

                [
                    {
                        text: '☎️ Продать купить квартиру',
                    }
                ],

                [
                    {
                        text: '⚙️ Настройки',
                    }
                ]
            ]
        },
        aplyorder: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🚖 Yetkazib berish',
                    },
                    {
                        text: '🏃 Olib ketish',
                    },
                ],
                [
                    {
                        text: '⬅️ Orqaga'
                    }
                ]
            ]
        },
        requestaddress: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🗺 geolokatsiya junatish',
                        request_location: true
                    }
                ],
                [
                    {
                        text: '⬅️ Orqaga',
                    }
                ]
            ]
        },
        agree: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '✅ Tasdiqlash'
                    }
                ],
                [
                    {
                        text: '❌ Bekor Qilish'
                    }
                ]
            ]
        },
        commentstar: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '🌟🌟🌟🌟🌟'
                    }
                ],
                [
                    {
                        text: '🌟🌟🌟🌟'
                    }
                ],
                [
                    {
                        text: '🌟🌟🌟'
                    }
                ],
                [
                    {
                        text: '🌟🌟'
                    }
                ],
                [
                    {
                        text: '🌟'
                    }
                ],
                [
                    {
                        text: '⬅️ Orqaga'
                    }
                ]
            ]
        },
        payment: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '💵 Naqd pul'
                    }
                ],
                [

                    {
                        text: '💳 Click'
                    }
                ],
                [
                    {
                        text: '⬅️ Orqaga'
                    }
                ]
            ]
        },
        comment: {
            resize_keyboard: true,
            one_time_keyboard: false,
            keyboard: [
                [
                    {
                        text: '⬅️ Orqaga'
                    }
                ]
            ]
        }

        // Клавиатура для главного меню
    }


}

module.exports = keys;
