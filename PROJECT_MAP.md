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
تسجيل الدخول ← لوحة التحكم
                  ├── العملاء ← إضافة / بحث / تعديل / حذف
                  │               └── الديون ← إضافة دين / تسجيل دفعة / عرض السجل
                  └── لوحة التحكم ← إجمالي الديون / المدفوعات / الأرصدة
```

**تدفق البيانات (Data Flow):**
```
[React SPA] → Axios (JWT) → Flask Blueprint → Service Layer → SQLAlchemy → DB
     ↕                          ↕
TanStack Query           Pydantic Validation
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
│   │   │   └── payment.py
│   │   ├── schemas/             # Pydantic request/response
│   │   ├── services/            # Business logic
│   │   └── routes/              # Flask Blueprints (REST API)
│   ├── run.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Procfile
├── frontend/
│   ├── src/
│   │   ├── api/client.ts        # Axios + JWT interceptor
│   │   ├── components/          # Layout, ProtectedRoute
│   │   ├── pages/               # Login, Register, Dashboard, Customers, Debts
│   │   ├── hooks/               # useAuth, useCustomers, useDebts
│   │   └── lib/arabic.ts        # Arabic text dictionary
│   ├── vercel.json
│   └── vite.config.ts
├── .gitignore
├── README.md
└── PROJECT_MAP.md
```

## ORPHANS & PENDING

- [x] Backend Core (Flask app, config, DB, models, JWT, logging)
- [x] Backend API (auth, customers, debts, payments, dashboard)
- [x] Frontend Scaffold (Vite, React, Tailwind, RTL, Router)
- [x] Frontend Pages (Login, Register, Dashboard, Customers, Debts)
- [x] Production Config (Procfile, vercel.json, .env.example)
- [x] Git Repository + GitHub Push
- [ ] PostgreSQL migration (Alembic migration script, optional for MVP)
- [ ] Multi-language support (future)
- [ ] Unit tests (backend pytest, frontend vitest)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Custom domain configuration
