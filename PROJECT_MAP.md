# PROJECT MAP — نظام إدارة الديون

## TECH_STACK

| الطبقة | التقنية | الإصدار |
|--------|---------|---------|
| Backend | Flask + Gunicorn | 3.1.3 / 26.0.0 |
| ORM | SQLAlchemy + Alembic | 2.0.50 / 1.18.4 |
| Validation | Pydantic + Pydantic-Settings | 2.13.4 / 2.14.1 |
| Auth | Flask-JWT-Extended + bcrypt | 4.7.4 / 5.0.0 |
| Database | SQLite (dev) → PostgreSQL (prod) | — |
| Frontend | React + Vite | 19.2.7 / 8.0.16 |
| Routing | React Router DOM | 7.17.0 |
| Server State | TanStack React Query | 5.101.0 |
| HTTP | Axios | 1.17.0 |
| Forms | React Hook Form + Zod | 7.79.0 / 4.4.3 |
| CSS | Tailwind CSS | 4.3.1 |
| Analytics | @vercel/analytics | 2.0.1 |
| Deployment | Render + Vercel | — |

## SYSTEM_FLOW

```
[عامة]                  [مصادقة]
  /blog ← ← ← ← ← ← ← ← ← ← ← تسجيل الدخول ← لوحة التحكم
  /blog/:slug                                ├── العملاء ← إضافة / بحث / تعديل / حذف
  /sitemap.xml                               │               └── الديون ← إضافة دين / تسجيل دفعة / عرض السجل
                                              └── لوحة التحكم ← إجمالي الديون / المدفوعات / الأرصدة
```

**تدفق البيانات (Data Flow):**
```
[React SPA] → Axios (JWT للخاص / مباشر للعام) → Flask Blueprint → Service Layer → SQLAlchemy → DB
     ↕                                ↕
TanStack Query                 Pydantic Validation
```

## ARCHITECTURE

```
debtdz/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # create_app() factory
│   │   ├── core/
│   │   │   ├── config.py        # Pydantic Settings (env)
│   │   │   ├── database.py      # SQLAlchemy engine + session
│   │   │   ├── security.py      # JWT + bcrypt
│   │   │   └── logging.py       # QueueHandler async logging
│   │   ├── models/              # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── customer.py
│   │   │   ├── debt.py
│   │   │   ├── payment.py
│   │   │   └── article.py       # Blog articles
│   │   ├── schemas/             # Pydantic request/response
│   │   │   ├── auth.py
│   │   │   ├── customer.py
│   │   │   ├── debt.py
│   │   │   ├── payment.py
│   │   │   └── article.py       # Article schemas
│   │   ├── services/            # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── customer_service.py
│   │   │   ├── debt_service.py
│   │   │   ├── payment_service.py
│   │   │   └── article_service.py  # Blog service
│   │   └── routes/              # Flask Blueprints (REST API)
│   │       ├── auth.py
│   │       ├── customers.py
│   │       ├── debts.py
│   │       ├── payments.py
│   │       ├── dashboard.py
│   │       ├── articles.py      # Blog API (public)
│   │       └── sitemap.py       # Sitemap XML (public)
│   ├── run.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Procfile
├── frontend/
│   ├── src/
│   │   ├── api/client.ts        # Axios + JWT interceptor
│   │   ├── components/          # Layout, ProtectedRoute
│   │   ├── pages/               # Login, Register, Dashboard, Customers, Debts,
│   │   │                          BlogList, BlogPost
│   │   ├── hooks/               # useAuth, useCustomers, useDebts
│   │   └── lib/arabic.ts        # Arabic text dictionary
│   ├── vercel.json
│   └── vite.config.ts
├── .gitignore
├── README.md
└── PROJECT_MAP.md
```

## API ENDPOINTS

| الطريقة | المسار | المصادقة | الوصف |
|---------|--------|----------|-------|
| POST | `/api/auth/register` | لا | تسجيل مستخدم |
| POST | `/api/auth/login` | لا | تسجيل الدخول |
| GET | `/api/auth/me` | نعم | بيانات المستخدم |
| GET | `/api/customers` | نعم | قائمة العملاء |
| POST | `/api/customers` | نعم | إضافة عميل |
| PUT | `/api/customers/:id` | نعم | تعديل عميل |
| DELETE | `/api/customers/:id` | نعم | حذف عميل |
| GET | `/api/customers/search?q=` | نعم | بحث |
| POST | `/api/debts` | نعم | إضافة دين |
| GET | `/api/debts/:id` | نعم | تفاصيل دين |
| GET | `/api/debts/by-customer/:id` | نعم | ديون عميل |
| POST | `/api/payments` | نعم | تسجيل دفعة |
| GET | `/api/payments/by-debt/:id` | نعم | دفعات دين |
| GET | `/api/dashboard/summary` | نعم | ملخص لوحة التحكم |
| **GET** | **`/api/articles`** | **لا** | **قائمة المقالات** |
| **GET** | **`/api/articles/:slug`** | **لا** | **تفاصيل مقال** |
| **GET** | **`/sitemap.xml`** | **لا** | **خريطة الموقع SEO** |

## ORPHANS & PENDING

- [x] Backend Core (Flask app, config, DB, models, JWT, logging)
- [x] Backend API (auth, customers, debts, payments, dashboard)
- [x] Frontend Scaffold (Vite, React, Tailwind, RTL, Router)
- [x] Frontend Pages (Login, Register, Dashboard, Customers, Debts)
- [x] Production Config (Procfile, vercel.json, .env.example)
- [x] Git Repository + GitHub Push
- [x] **Blog System** (Article model, API, BlogList + BlogPost pages)
- [x] **Sitemap XML** (auto-generated at /sitemap.xml)
- [ ] PostgreSQL migration (Alembic migration script, optional for MVP)
- [ ] Multi-language support (future)
- [ ] Unit tests (backend pytest, frontend vitest)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Custom domain configuration
- [ ] Blog admin panel (create/edit articles via API)
- [ ] Markdown rendering in blog content
