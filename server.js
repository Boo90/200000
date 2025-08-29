const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(Server is running on port );
});
