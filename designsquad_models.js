const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// نموذج المستخدم
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم المستخدم مطلوب'],
    trim: true,
    minlength: [2, 'اسم المستخدم يجب أن يكون حرفين على الأقل'],
    maxlength: [50, 'اسم المستخدم لا يمكن أن يتجاوز 50 حرفاً']
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'البريد الإلكتروني غير صحيح']
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل']
  },
  plan: {
    type: String,
    enum: {
      values: ['beginner', 'professional', 'enterprise'],
      message: 'نوع الاشتراك غير صحيح'
    },
    default: 'beginner'
  },
  planExpiry: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 يوم افتراضياً
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPasswordReset: {
    type: Boolean,
    default: false
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  profilePicture: String,
  bio: String,
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
    github: String
  },
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification'
    }
  ],
  activityLog: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ActivityLog'
    }
  ]
}, { timestamps: true });

// تشفير كلمة المرور قبل الحفظ
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// مقارنة كلمة المرور
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// نموذج المشروع
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم المشروع مطلوب'],
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  htmlCode: {
    type: String,
    default: ''
  },
  cssCode: {
    type: String,
    default: ''
  },
  jsCode: {
    type: String,
    default: ''
  },
  preview: String,
  status: {
    type: String,
    enum: ['draft', 'development', 'completed', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private'
  },
  isShared: {
    type: Boolean,
    default: false
  },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  deployment: {
    isDeployed: { type: Boolean, default: false },
    url: String,
    provider: String
  },
  versionHistory: [
    {
      version: Number,
      changes: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  },
  usedFeatures: [String],
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 }
    }
  ]
}, { timestamps: true });

// نموذج القالب
const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم القالب مطلوب'],
    trim: true
  },
  description: String,
  category: {
    type: String,
    required: [true, 'فئة القالب مطلوبة'],
    trim: true
  },
  preview: {
    type: String,
    default: ''
  },
  htmlCode: {
    type: String,
    default: ''
  },
  cssCode: {
    type: String,
    default: ''
  },
  jsCode: {
    type: String,
    default: ''
  },
  tags: [String],
  isPremium: {
    type: Boolean,
    default: false
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  }
}, { timestamps: true });

// نموذج الاشتراك في النشرة البريدية
const SubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'البريد الإلكتروني غير صحيح']
  },
  isSubscribed: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// نموذج رسالة التواصل
const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب']
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب']
  },
  subject: {
    type: String,
    required: [true, 'الموضوع مطلوب']
  },
  message: {
    type: String,
    required: [true, 'الرسالة مطلوبة']
  },
  status: {
    type: String,
    enum: ['جديدة', 'قيد المعالجة', 'مغلقة'],
    default: 'جديدة'
  }
}, { timestamps: true });

// نموذج الإعدادات
const SettingsSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'global',
    unique: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  signupEnabled: {
    type: Boolean,
    default: true
  },
  freeTrialDuration: {
    type: Number,
    default: 30
  },
  defaultPlan: {
    type: String,
    default: 'beginner'
  }
}, { timestamps: true });

// إنشاء الإعدادات الافتراضية
const createDefaultSettings = async () => {
  const existingSettings = await Settings.findOne({ name: 'global' });
  if (!existingSettings) {
    const defaultSettings = new Settings({});
    await defaultSettings.save();
    console.log('⚙️ تم إنشاء الإعدادات الافتراضية');
  }
};

// نموذج سجل الأنشطة
const ActivityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String
}, { timestamps: true });

// نموذج الإشعارات
const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: {
    type: String,
    enum: ['system', 'project', 'billing', 'message'],
    default: 'system'
  }
}, { timestamps: true });

// نموذج الملفات
const FileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: String,
  size: Number
}, { timestamps: true });

// نموذج الفواتير
const InvoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  paymentDate: Date,
  invoiceNumber: String
}, { timestamps: true });

// نموذج الكوبون
const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  expiryDate: Date,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// نموذج البحث المحفوظ
const SavedSearchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  query: { type: String, required: true },
  filter: mongoose.Schema.Types.Mixed
}, { timestamps: true });

// تصدير النماذج
const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Template = mongoose.model('Template', TemplateSchema);
const Subscription = mongoose.model('Subscription', SubscriptionSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const Settings = mongoose.model('Settings', SettingsSchema);
const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);
const Notification = mongoose.model('Notification', NotificationSchema);
const File = mongoose.model('File', FileSchema);
const Invoice = mongoose.model('Invoice', InvoiceSchema);
const Coupon = mongoose.model('Coupon', CouponSchema);
const SavedSearch = mongoose.model('SavedSearch', SavedSearchSchema);

// تصدير دوال المساعدة
const getDashboardStats = {
  async users() {
    return {
      total: await User.countDocuments(),
      active: await User.countDocuments({ isActive: true }),
      verified: await User.countDocuments({ isEmailVerified: true }),
      byPlan: {
        beginner: await User.countDocuments({ plan: 'beginner' }),
        professional: await User.countDocuments({ plan: 'professional' }),
        enterprise: await User.countDocuments({ plan: 'enterprise' })
      }
    };
  },
  async projects() {
    return {
      total: await Project.countDocuments(),
      byStatus: {
        draft: await Project.countDocuments({ status: 'draft' }),
        development: await Project.countDocuments({ status: 'development' }),
        completed: await Project.countDocuments({ status: 'completed' })
      },
      public: await Project.countDocuments({ visibility: 'public' }),
      deployed: await Project.countDocuments({ 'deployment.isDeployed': true })
    };
  },
  async templates() {
    return {
      total: await Template.countDocuments(),
      published: await Template.countDocuments({ status: 'published' }),
      premium: await Template.countDocuments({ isPremium: true }),
      free: await Template.countDocuments({ isPremium: false }),
      byCategory: await Template.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    };
  }
};

module.exports = {
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
  Coupon,
  SavedSearch,
  getDashboardStats,
  createDefaultSettings
};