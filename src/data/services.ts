import { Service } from '@/types/service';

export const services: Service[] = [
  {
    id: '1',
    title: 'Экскурсия на острова Пхи-Пхи',
    description: 'Незабываемое путешествие на знаменитые острова Пхи-Пхи с белоснежными пляжами и кристально чистой водой.',
    imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80',
    categories: ['sea-oneday'],
    location: 'thailand',
    city: 'phuket',
    duration: {
      days: 1,
      nights: 0
    },
    price: {
      adult: 1800,
      child: 1300,
      amount: 1800,
      currency: '฿'
    },
    pricingOptions: [
      {
        id: 'standard',
        name: 'Стандартная лодка',
        description: 'Комфортабельная лодка с кондиционером в салоне',
        price: {
          adult: 1800,
          child: 1300,
          currency: '฿'
        }
      },
      {
        id: 'premium',
        name: 'Двухярусный катамаран',
        description: 'Просторный катамаран с верхней палубой для загара',
        price: {
          adult: 2100,
          child: 1600,
          currency: '฿'
        }
      }
    ],
    included: [
      'Трансфер из отеля',
      'Обед',
      'Снаряжение для снорклинга',
      'Страховка'
    ],
    notIncluded: [
      'Алкогольные напитки',
      'Сувениры'
    ],
    requirements: [
      'Солнцезащитный крем',
      'Купальные принадлежности',
      'Полотенце'
    ],
    itinerary: [
      {
        day: 1,
        activities: [
          '07:00 - Выезд из отеля',
          '09:00 - Прибытие на острова',
          '10:00 - Снорклинг',
          '12:00 - Обед',
          '15:00 - Возвращение'
        ]
      }
    ],
    testimonials: [
      {
        id: '1-1',
        author: 'Анна Петрова',
        rating: 5,
        comment: 'Потрясающая экскурсия! Вода кристально чистая, пляжи великолепные. Отдельное спасибо гиду за интересный рассказ об островах.',
        date: '15 января 2024'
      },
      {
        id: '1-2',
        author: 'Михаил Иванов',
        rating: 4,
        comment: 'Очень понравилась организация поездки. Единственный минус - много туристов на пляжах, но это не вина организаторов.',
        date: '10 января 2024'
      },
      {
        id: '1-3',
        author: 'Елена Сидорова',
        rating: 5,
        comment: 'Замечательная экскурсия! Красивейшие места, профессиональные гиды, вкусный обед. Обязательно приеду еще раз!',
        date: '5 января 2024'
      }
    ]
  },
  {
    id: '2',
    title: 'Вечернее шоу Сиам Нирамит',
    description: 'Грандиозное театрализованное представление об истории и культуре Таиланда.',
    imageUrl: 'https://images.unsplash.com/photo-1581972411911-4b8e81270ae9?auto=format&fit=crop&q=80',
    categories: ['evening-show'],
    location: 'thailand',
    city: 'phuket',
    duration: {
      days: 1,
      nights: 0
    },
    price: {
      adult: 2500,
      child: 1250,
      amount: 2500,
      currency: '฿'
    },
    pricingOptions: [
      {
        id: 'standard',
        name: 'Стандартный билет',
        description: 'Места в середине зала',
        price: {
          adult: 2500,
          child: 1250,
          currency: '฿'
        }
      },
      {
        id: 'vip',
        name: 'VIP билет',
        description: 'Лучшие места в первых рядах + приветственный напиток',
        price: {
          adult: 3500,
          child: 1750,
          currency: '฿'
        }
      }
    ],
    included: [
      'Билет на шоу',
      'Трансфер',
      'Ужин'
    ],
    notIncluded: [
      'Напитки',
      'Фото/видео съемка'
    ],
    requirements: [
      'Вечерняя одежда'
    ],
    itinerary: [
      {
        day: 1,
        activities: [
          '17:00 - Выезд из отеля',
          '18:00 - Ужин',
          '19:30 - Начало шоу',
          '22:00 - Возвращение'
        ]
      }
    ],
    testimonials: [
      {
        id: '2-1',
        author: 'Дмитрий Козлов',
        rating: 5,
        comment: 'Великолепное шоу! Костюмы, декорации, музыка - все на высшем уровне. Погружаешься в атмосферу древнего Таиланда.',
        date: '12 января 2024'
      },
      {
        id: '2-2',
        author: 'Ольга Смирнова',
        rating: 5,
        comment: 'Потрясающее представление! VIP места того стоят - прекрасный вид на сцену. Ужин тоже порадовал разнообразием блюд.',
        date: '8 января 2024'
      }
    ]
  }
];