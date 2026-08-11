const path = require('path');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({}).lean();
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const response = await axios.get('http://localhost:5000/api/ai/yearly-report', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('STATUS', response.status);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('ERROR_STATUS', error.response?.status);
    console.error('ERROR_BODY', JSON.stringify(error.response?.data || error.message, null, 2));
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
