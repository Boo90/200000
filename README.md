DesignSquad Backend 🚀
منصة DesignSquad هي واجهة خلفية شاملة لتطبيق تصميم الويب باستخدام الذكاء الاصطناعي. تم بناؤها باستخدام Node.js و Express و MongoDB مع دعم كامل للغة العربية.
🌟 المميزات الرئيسية
🔐 نظام المصادقة والأمان
تسجيل دخول آمن مع JWT
تشفير كلمات المرور باستخدام bcrypt
حماية من محاولات الدخول المتكررة
تحديد معدل الطلبات (Rate Limiting)
Middleware للأمان شامل
📁 إدارة المشاريع
إنشاء وتحرير المشاريع
دعم أكواد HTML/CSS/JavaScript
نظام إصدارات للمشاريع
نشر المشاريع على الإنترنت
البحث والفلترة المتقدمة
🎨 نظام القوالب
مكتبة شاملة من القوالب
قوالب مجانية ومدفوعة
نظام تقييم ومراجعة
تصنيف حسب الفئات
إحصائيات التحميل
📊 التحليلات والإحصائيات
تتبع استخدام المنصة
إحصائيات المشاريع
تحليل سلوك المستخدمين
تقارير مفصلة
🛠️ التقنيات المستخدمة
Backend: Node.js, Express.js
Database: MongoDB with Mongoose
Authentication: JSON Web Tokens (JWT), bcryptjs
Middleware: helmet, express-rate-limit
Utilities: dotenv, multer
🚀 دليل البدء السريع
اتبع هذه الخطوات لتشغيل المشروع محلياً.
1. المتطلبات الأساسية
تأكد من تثبيت البرامج التالية:
Node.js (v16.0.0 أو أحدث)
MongoDB (محلياً أو سحابياً مثل MongoDB Atlas)
2. التثبيت
# استنساخ المستودع
git clone https://github.com/your-username/designsquad-backend.git

# الانتقال إلى مجلد المشروع
cd designsquad-backend

# تثبيت المكتبات
npm install


3. إعداد متغيرات البيئة
قم بإنشاء ملف باسم .env في مجلد المشروع.
انسخ محتويات ملف .env.example والصقها في ملف .env.
قم بتعديل قيمة MONGODB_URI و JWT_SECRET والبيانات الأخرى.
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
# ... والمزيد


4. تشغيل الخادم
لتشغيل الخادم في وضع التطوير (مع إعادة التشغيل التلقائية):
npm run dev


للوصول إلى الواجهة الخلفية، افتح متصفحك على http://localhost:5000.
5. إضافة بيانات تجريبية (اختياري)
إذا كنت ترغب في ملء قاعدة البيانات ببيانات وهمية للاختبار:
npm run seed


🗄️ هيكل قاعدة البيانات
Users Collection
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // مشفر
  plan: "beginner" | "professional" | "enterprise",
  role: "user" | "admin",
  isActive: Boolean,
  createdAt: Date
}


Projects Collection
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: ObjectId, // ref: User
  code: {
    html: String,
    css: String,
    js: String
  },
  status: "draft" | "development" | "completed",
  createdAt: Date
}


Templates Collection
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  preview: String,
  htmlCode: String,
  cssCode: String,
  jsCode: String,
  tags: [String],
  isPremium: Boolean,
  downloads: Number,
  rating: Number,
  createdAt: Date
}


🗺️ نقاط النهاية (API Endpoints)
Method
Endpoint
Description
POST
/api/auth/register
تسجيل مستخدم جديد
POST
/api/auth/login
تسجيل دخول المستخدم
GET
/api/users/profile
جلب الملف الشخصي للمستخدم
GET
/api/projects
قائمة المشاريع
POST
/api/projects
إنشاء مشروع جديد
GET
/api/templates
قائمة القوالب
GET
/api/templates/:id
جلب قالب محدد
POST
/api/templates/:id/download
تحميل قالب
PUT
/api/templates/:id/review
إضافة تقييم لقالب
GET
/api/stats/user
إحصائيات المستخدم


