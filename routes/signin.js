require('dotenv').config();

const express = require('express');
const router = express.Router();

const { user } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { JWT_SECRET_KET } = process.env;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const User = await user.findOne({ email });
    const inPasswordCorrect = await bcrypt.compare(password, User.password);

    if (!User || !inPasswordCorrect) {
      return res
        .status(400)
        .json({ message: '이메일이나 비밀번호가 틀렸습니다!.' });
    }
    const userId = await User.dataValues.id;

    res.json({ token: jwt.sign({ userId }, JWT_SECRET_KET) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
