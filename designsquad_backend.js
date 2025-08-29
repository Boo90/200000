/**
 * DesignSquad Backend - منصة تصميم الويب بالذكاء الاصطناعي
 * الإصدار: 1.0.0
 * التاريخ: 2025
 * حقوق النشر: © 2025 DesignSquad. جميع الحقوق محفوظة.
 * الترخيص: MIT
 * المؤلف: Abdullah Khamis
 * وثائق API: https://api.designsquad.com/docs
 */

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// إعدادات الأمان
app.use(helmet());
app.use(cors());

// تحديد معدل الطلبات
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100 // حد كل IP إلى 100 طلب لكل نافذة
});
app.use(limiter);

// middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// إعداد تحميل الملفات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760
  }
});

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/designsquad', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
})
.catch((error) => {
  console.error('❌ فشل الاتصال بقاعدة البيانات:', error.message);
});

// استيراد النماذج
const {
  User,
  Project,
  Template,
  Subscription,
  Contact,
  Settings,
  ActivityLog,
  Notification,
  File,
  Invoice,
  createDefaultSettings
} = require('./designsquad_models');

// استيراد المسارات
const apiRoutes = require('./designsquad_routes');
app.use('/api', apiRoutes);

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'حدث خطأ غير متوقع',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Route افتراضي
app.get('/', (req, res) => {
  res.json({ 
    message: 'مرحبا بك في خادم DesignSquad API',
    version: process.env.APP_VERSION || '1.0.0',
    author: process.env.APP_AUTHOR || 'DesignSquad Team',
    copyright: process.env.APP_COPYRIGHT || '© 2025 DesignSquad',
    endpoints: [
      'POST /api/auth/register - تسجيل مستخدم جديد',
      'POST /api/auth/login - تسجيل دخول',
      'GET /api/users/profile - الملف الشخصي',
      'GET /api/projects - قائمة المشاريع',
      'POST /api/projects - إنشاء مشروع جديد',
      'GET /api/templates - قائمة القوالب',
      'POST /api/subscriptions - الاشتراك في النشرة',
      'POST /api/contact - إرسال رسالة'
    ]
  });
});

// إنشاء مجلد التحميلات إذا لم يكن موجوداً
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('📁 تم إنشاء مجلد التحميلات');
}

// إنشاء الإعدادات الافتراضية
createDefaultSettings().catch(console.error);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
  console.log(`📱 الواجهة الأمامية: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`⚡ واجهة برمجة التطبيقات: http://localhost:${PORT}/api`);
  console.log(`📄 الوثائق: http://localhost:${PORT}/api/docs`);
  console.log(`© ${process.env.APP_COPYRIGHT || '2025 DesignSquad'}`);
});