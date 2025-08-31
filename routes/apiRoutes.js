const express = require('express');
const router = express.Router();

// يمكنك إضافة نقاط النهاية (endpoints) الخاصة بالـ API هنا
router.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

module.exports = router;