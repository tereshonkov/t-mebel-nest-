# t-mebel API

Backend для сайта **t-mebel** ([t-mebel.com.ua](https://t-mebel.com.ua)): REST API на **NestJS 11**, **PostgreSQL** (Prisma), JWT + httpOnly refresh cookie, загрузка изображений в **Google Cloud Storage**, опциональные уведомления в **Telegram** и метрики **Google Analytics Data API**.

Фронтенд админки и витрины — отдельный репозиторий (`t-mebel-next`).

## Стек

| Компонент | Технология |
|-----------|------------|
| Runtime | Node.js |
| Framework | NestJS |
| ORM | Prisma 6 |
| Auth | Passport JWT, Argon2 |
| Storage | GCS (`@google-cloud/storage`) |
| API docs | Swagger — **`/docs`** |

## Требования

- Node.js 22+ (см. `package.json` / CI)
- PostgreSQL 16+ (локально или облако)
- Для загрузки картинок и части фич — файл **`service-account.json`** (сервисный аккаунт GCP) в корне репозитория на машине/сервере (в git не коммитить)

## Быстрый старт

```bash
npm ci
cp .env.test.example .env   # или свой .env — см. таблицу ниже
# заполнить DATABASE_URL, JWT_SECRET, COOKIE_DOMAIN, TTL JWT
npx prisma migrate deploy
npx prisma generate
npm run start:dev
```

Приложение слушает **`PORT`** (по умолчанию **3000**).

Открыть интерактивную документацию: **http://localhost:3000/docs**

## Переменные окружения

| Переменная | Назначение |
|------------|------------|
| `DATABASE_URL` | PostgreSQL connection string для Prisma |
| `JWT_SECRET` | Секрет подписи access/refresh JWT (HS256) |
| `JWT_ACCESS_TOKEN_TTL` | TTL access token, напр. `15m` |
| `JWT_REFRESH_TOKEN_TTL` | TTL refresh token, напр. `7d` |
| `COOKIE_DOMAIN` | Домен cookie (локально часто `localhost`) |
| `PORT` | Порт HTTP-сервера (необязательно) |
| `NODE_ENV` | `production` влияет на `secure` / `sameSite` у cookie refresh, на способ инициализации GA-клиента |
| `ENABLE_TELEGRAM` | Если `true`, подключается `TelegramModule` |
| `TELEGRAM_BOT_TOKEN` | Токен бота (нужен при `ENABLE_TELEGRAM=true`) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | JSON сервисного аккаунта **строкой** — используется в **не-production** для `AnaliticsService` (в production читается `service-account.json`) |

Пример локального `.env` см. **`.env.test.example`** (там же образец для e2e).

## Скрипты npm

| Команда | Описание |
|---------|----------|
| `npm run start:dev` | Режим разработки с перезапуском |
| `npm run build` | Сборка (перед `build` выполняется `prebuild` → **юнит-тесты**) |
| `npm run build:deploy` | `prisma generate` + сборка — для CI/Render |
| `npm run start:prod` | Старт из `dist/src/main.js` |
| `npm run test` | Юнит-тесты (Jest) |
| `npm run test:e2e` | E2E (нужен `DATABASE_URL`, см. ниже) |
| `npm run seed:translations` | Синхронизация переводов продуктов из messages → `ProductTranslation` |

## Модули и домены

- **Auth** — регистрация, логин, refresh, logout; refresh в httpOnly cookie `refreshToken`.
- **User** — пользователи, роли `USER` / `ADMIN` (защита эндпоинтов через guards).
- **Product** — товары, категории, локализованные поля (`ProductTranslation`, локали `uk` / `ru` / `en`).
- **Reviews** — отзывы к товарам (модерация `isApproved`).
- **Images** — метаданные в БД, файлы — в бакет GCS `t-mebel`.
- **Messages** — заявки/сообщения с сайта.
- **Callclick** — учёт кликов по звонку.
- **Analitics** — отчёты GA4 (Property ID зашит в коде сервиса; для прод/тест различается источник credentials).
- **Telegram** — опционально (`ENABLE_TELEGRAM`).

CORS разрешён для прод-доменов **`t-mebel.com.ua`** и локальных **`localhost:3000` / `3001`** (см. `src/main.ts`).

## База данных

- Схема: **`prisma/schema.prisma`**
- Миграции: **`prisma/migrations/`**

```bash
npx prisma migrate deploy   # применить миграции
npx prisma studio           # GUI к данным (по желанию)
```

## Тесты и E2E

Юнит-тесты: **`npm run test`**.

E2E (`test/app.e2e-spec.ts`, Jest config **`test/jest-e2e.json`**):

1. Поднять PostgreSQL для тестов, например:

   ```bash
   docker compose -f docker-compose.test.yml up -d
   ```

2. Скопировать **`.env.test.example`** → **`.env.test`**, выставить `DATABASE_URL` на тестовую БД (в примере порт **5433**).

3. При `npm run test:e2e` global setup выполнит `prisma migrate deploy` при наличии `DATABASE_URL`.

**Важно:** не использовать боевой `DATABASE_URL` для e2e — тесты создают пользователей вида `e2e-*@test.local`.

## Деплой (Render)

В репозитории есть **`render.yaml`**: сборка `npm ci && npm run build:deploy`, старт `npm run start:prod`. На хостинге нужно задать те же переменные окружения, что и в проде, и обеспечить наличие **`service-account.json`**, если используются загрузка изображений и/или аналитика в production-режиме.

## Скрипт переводов продуктов

```bash
npm run seed:translations
```

Источник JSON с ключами `data_<productId>` (порядок приоритета описан в **`scripts/seed-product-translations-from-messages.ts`**): переменная `T_MEBEL_MESSAGES_DIR`, затем `scripts/i18n-snapshot/`, затем соседний `t-mebel-next/src/messages`.

## Лицензия

`UNLICENSED` (приватный проект).
