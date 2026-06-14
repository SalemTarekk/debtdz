# نظام إدارة الديون (Debt Management System)

منصة B2B SaaS لإدارة ديون العملاء والمدفوعات للتجار الجزائريين.

## التقنيات المستخدمة (Tech Stack)

- **Backend:** Python Flask 3.1.3 + SQLAlchemy 2.0 + JWT + Gunicorn
- **Frontend:** React 19 + Vite 8 + Tailwind CSS 4 + TanStack Query 5
- **Database:** SQLite (تطوير) / PostgreSQL (إنتاج)
- **Deployment:** Render (Backend) + Vercel (Frontend)

## متطلبات التشغيل

- Python 3.11+
- Node.js 20+

## التشغيل المحلي

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or .\venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env
# عدل .env حسب الحاجة
python run.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

⚠️ تأكد أن الـ Backend يعمل على `http://localhost:5000` قبل تشغيل الـ Frontend.

## النشر (Deployment)

### Render (Backend)

1. اربط مستودع GitHub بـ Render
2. اختر **Web Service**
3. الإعدادات:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn run:app --worker-class sync --workers 2 --timeout 120 --access-logfile -`
4. أضف المتغيرات البيئية (انظر `.env.example`)

### Vercel (Frontend)

1. اربط مستودع GitHub بـ Vercel
2. الإعدادات:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. أضف متغير البيئة:
   - `VITE_API_URL`: رابط Backend على Render

## المتغيرات البيئية

| المتغير | الشرح | مثال |
|---------|-------|------|
| `SECRET_KEY` | مفتاح Flask السري | `min-32-character-random-string` |
| `JWT_SECRET_KEY` | مفتاح JWT السري | `min-32-character-random-string` |
| `DATABASE_URL` | رابط قاعدة البيانات | `sqlite:///debtdz.db` أو `postgresql://...` |
| `FLASK_CORS_ORIGINS` | النطاقات المسموح بها | `https://your-app.vercel.app` |
| `LOG_LEVEL` | مستوى التسجيل | `DEBUG`, `INFO`, `WARNING`, `ERROR` |

## API Endpoints

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/api/auth/register` | تسجيل مستخدم جديد |
| POST | `/api/auth/login` | تسجيل الدخول |
| GET | `/api/auth/me` | بيانات المستخدم الحالي |
| GET | `/api/customers` | قائمة العملاء |
| POST | `/api/customers` | إضافة عميل |
| PUT | `/api/customers/:id` | تعديل عميل |
| DELETE | `/api/customers/:id` | حذف عميل |
| GET | `/api/customers/search?q=` | بحث عن عميل |
| POST | `/api/debts` | إضافة دين |
| GET | `/api/debts/:id` | تفاصيل دين |
| GET | `/api/debts/by-customer/:id` | ديون عميل |
| POST | `/api/payments` | تسجيل دفعة |
| GET | `/api/payments/by-debt/:id` | دفعات دين |
| GET | `/api/dashboard/summary` | ملخص لوحة التحكم |
