Структура проекта travel-agency-frontend полностью соответствует современному React+Vite+Supabase стеку для сайта турагенства.

# Thai Guru 🌍✈️

Современный многоязычный фронтенд туристического агентства на **React 18 + TypeScript + Vite**. Интеграция с **Supabase**, чат-бот, виджет погоды, WhatsApp/Telegram. Полностью адаптивный дизайн с **Tailwind CSS**.

![Travel Agency](https://iili.io/BERp6jS.md.jpg)
![Travel Agency](https://iili.io/BEAUqjp.md.jpg)

## ✨ Основные возможности

- **18+ страниц и компонентов**: Home, Services, Blog, About, Contacts, ServiceDetail (RentService, VillaRental, ShoppingService)
- **Многоязычность**: RU/EN через i18n (src/i18n/locales)
- **Supabase интеграция**: БД, аутентификация, чат-бот функции (supabase/functions/chat-bot)
- **Интерактивные сервисы**: Фильтры цен/локаций, пагинация, поиск туров
- **Коммуникация**: WhatsApp/Telegram интеграция, ContactFormModal
- **AI/ML**: Cohere AI (src/lib/cohere.ts), чат-бот, перевод контента
- **Виджеты**: WeatherWidget, SpecialOfferWidget, RecentBookings

## 🏗️ Структура проекта

```
travel-agency-frontend/
├── src/
│   ├── components/
│   │   ├── layout/Header/          # Header + Navigation + MobileMenu + LanguageSwitcher
│   │   ├── services/               # ServiceCard, ServiceGrid, Filters, CategoryTabs
│   │   ├── modals/                 # ContactFormModal, TestimonialFormModal
│   │   ├── chat/ChatBot.tsx        # AI чат-бот
│   │   └── weather/WeatherWidget.tsx
│   ├── pages/                      # Home, Services, Blog, About, Contacts + ServiceDetail/*
│   ├── lib/                        # supabase.ts, cohere.ts, whatsapp.ts, telegram.ts
│   ├── data/                       # services.ts, blog.ts, countryCodes.ts
│   └── i18n/                       # en.ts, ru.ts
├── supabase/functions/chat-bot/    # Edge Functions для чат-бота
├── supabase/migrations/            # 6 миграций БД (2025)
└── .yarn/                          # Yarn 4.6.0
```

## 🚀 Быстрый старт

```bash
git clone https://github.com/FedoseevSM/travel-agency-frontend.git
cd travel-agency-frontend
yarn install
cp .env.example .env  # Настрой Supabase URL + ключи
yarn dev
```

## 🛠️ Технологический стек

```
├── Frontend: React 18 + TypeScript + Vite + Tailwind CSS
├── Backend: Supabase (Postgres + Edge Functions)
├── AI: Cohere + ChatBot
├── Comms: WhatsApp/Telegram Webhooks
├── i18n: react-i18next
└── Build: Yarn 4 + PostCSS
```

## 🌐 Демо
- **Live**: https://thai.guru
- **Supabase**: Проект с 6 миграциями (rentals, services, testimonials)

## 📄 Лицензия
MIT - используй для своих travel-проектов!

---

**⭐ Fork & добавь в избранные, если полезно!**

Эта структура показывает **профессиональный enterprise-уровень**: Supabase Edge Functions, AI чат-бот, полная локализация, продвинутые фильтры услуг. 

Идеально для фриланса!
