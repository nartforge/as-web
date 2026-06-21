# NartForge

NartForge artık React/Vite frontend ve Node.js/Express backend içeren workspace tabanlı bir projedir.

## Mimari

```text
nartforge/
├─ frontend/  # React 18 + TypeScript + Vite 5, HashRouter
├─ backend/   # Node.js + Express + TypeScript + Prisma
├─ package.json
├─ .env.example
└─ README.md
```

Frontend mevcut sayfa, component ve global CSS yapısını korur. Backend; auth, ürün, yorum, sipariş, sepet, Shopier placeholder ödeme, Discord OAuth ve admin API altyapısını sağlar.

## Kurulum

```bash
npm install
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Frontend env:

```env
VITE_API_URL=http://localhost:4000/api
VITE_SITE_URL=http://localhost:3000
```

Backend env:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000
DATABASE_URL="mysql://root:password@localhost:3306/nartforge"
JWT_SECRET=change-this-secret-in-production
```

Shopier ve Discord secret değerleri yalnızca backend env içinde tutulmalıdır.

## Veritabanı

Prisma varsayılan datasource provider değeri `mysql` olarak ayarlı. PostgreSQL kullanacaksanız `backend/prisma/schema.prisma` içindeki datasource provider değerini `postgresql` yapıp `DATABASE_URL` değerini PostgreSQL formatında verin.

```bash
npm run prisma:migrate
npm run prisma:seed
```

Seed ürünleri: `asVerifyDC`, `asGiveAway`, `asKingdomX`, `asAPI`, `asModeration`. `asKingdomX` premium, flagship ve best seller ürün olarak hazırlanmıştır.

## Development

```bash
npm run dev
```

Alternatif:

```bash
npm run dev:frontend
npm run dev:backend
```

Portlar:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- API: `http://localhost:4000/api`

## Build ve Start

```bash
npm run build
npm run start
```

`npm run build` frontend dist çıktısını üretir ve backend TypeScript build alır. `npm run start` production backend’i `backend/dist/index.js` üzerinden başlatır.

## API

Ana endpoint grupları:

- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/discord`
- Products: `/api/products`, `/api/products/:slug`
- Reviews: `/api/products/:productId/reviews`, `/api/reviews/:id`
- Orders: `/api/orders`, `/api/orders/me`, `/api/orders/:id/cancel`
- Cart: `/api/cart`, `/api/cart/add`, `/api/cart/remove`, `/api/cart/clear`
- Payments: `/api/payments/shopier/create`, `/api/payments/shopier/callback`
- Admin: `/api/admin/products`, `/api/admin/orders`, `/api/admin/reviews`, `/api/admin/users`

## Shopier

Gerçek Shopier bilgileri yoksa backend placeholder ödeme linki döndürür. Production için:

```env
SHOPIER_PAYMENT_URL=
SHOPIER_API_KEY=
SHOPIER_API_SECRET=
SHOPIER_CALLBACK_URL=
SHOPIER_SUCCESS_URL=
SHOPIER_FAIL_URL=
```

Akış: frontend order oluşturur, `/api/payments/shopier/create` çağrılır, backend ödeme URL’i döndürür, kullanıcı Shopier’e yönlendirilir. Callback endpoint’i ileride imza doğrulama ve `paid/failed` status güncellemesi için hazırdır.

## Discord OAuth

```env
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=http://localhost:4000/api/auth/discord/callback
DISCORD_SCOPES=identify email
```

Frontend Discord secret içermez. Login butonu backend `/api/auth/discord` endpointine gider. Callback backend’de token/profile alır, kullanıcıyı oluşturur veya eşler ve frontend `/#/auth/callback` rotasına döndürür.

## CloudPanel Notları

1. MySQL veya PostgreSQL veritabanı oluşturun.
2. Backend için Node.js app tanımlayın ve environment değerlerini CloudPanel üzerinden girin.
3. `npm install`, `npm run prisma:migrate`, `npm run prisma:seed`, `npm run build` çalıştırın.
4. Backend start komutu: `npm run start`.
5. Frontend için `frontend/dist/` dizinini statik site olarak yayınlayın.
6. API aynı domain altında kullanılacaksa reverse proxy ile `/api` isteklerini backend portuna yönlendirin.
7. Ayrı subdomain tercih edilirse `api.nartforge.com` backend’e, ana domain frontend dist’e bakmalıdır.
8. `FRONTEND_URL`, `BACKEND_URL`, `VITE_API_URL`, Discord redirect ve Shopier callback/success/fail URL’lerini production domainlerine göre güncelleyin.
