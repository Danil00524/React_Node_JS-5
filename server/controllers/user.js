const Joi = require('@hapi/joi');
const bcrypt = require("bcryptjs");

const jwt = require('jsonwebtoken');
const auth = require('../helpers/auth');
const constants = require('../../constans');

// ========== VALIDATION ==========

const schemaRegistration = Joi.object().keys({
  name: Joi.string().required(),
  price: Joi.number().required(),
  photo: Joi.required(),
});
const schemaUpdateProfileInfo = Joi.object().keys({
  age: Joi.number().required(),
  concerts: Joi.number().required(),
  cities: Joi.number().required(),
  years: Joi.number().required(),
});

// ========== VALIDATION ==========

const User = require('../db').models.users;

module.exports = {
  authenticate: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) throw 'Заполните все поля!'

      const user = await User.findOne({ where: { username } });
      if (!user) {
        res.status(401).json({ success: false, message: "Пользователь не найден." });
      }

      const statusValidate = await bcrypt.compare(password, user.password)

      if (statusValidate) {
        const tokens = await auth.createTokens(user);
        const { username, password, surName, firstName, middleName } = user;
        // const CRUD = await User.findOne({ where: { username } });
        // TODO! CRUD

        res.json({
          success: true,
          message: "Аутентификация прошла успешно.",
          username,
          password,
          surName,
          firstName,
          middleName,
          permission: {
            chat: { C: true, R: true, U: true, D: true },
            news: { C: true, R: true, U: true, D: true },
            settings: { C: true, R: true, U: true, D: true }
          },
          ...tokens
        });
      } else {
        res.status(401).json({ success: false, message: "Пароль не верный." });
      }
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error })
    }
  },
  authorization: async (req, res) => {
    const token = req.headers['authorization'];
    let userId = -1;

    try {
      userId = jwt.verify(token, constants.secretKey).user.id;
      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        res.json({ success: false, message: 'Пользователь не существует.' });
      }

      const { username, password, surName, firstName, middleName } = user;

      res.json({
        success: true,
        username,
        password,
        surName,
        firstName,
        middleName
      });
    } catch (error) {
      res.json({
        success: false,
        text: 'Access token устаревший.',
        error: error.message,
      });
    }
  },
  refreshToken: async (req, res) => {
    s
  },
  logout: async (req, res) => {
    try {
      req.logout();
      res.json({ success: true, message: 'Выход произошел успешно.' })
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error })
    }
  },
  create: async (req, res) => {
    try {
      const { username, surName, firstName, middleName, password } = req.body;
      if (!username || !surName || !firstName || !middleName || !password) throw 'Заполните все поля!'

      const hashPassword = await bcrypt.hash(password, 12);
      const data = {
        username, surName, firstName, middleName, password: hashPassword
      }

      const checkTheSameUsername = await User.findOne({ where: { username } });

      if (checkTheSameUsername) {
        res.json({ success: false, message: 'Пользователь с таким ником уже существует.' })
      } else {
        const result = await User.create(data);
        res.json({ success: true, data: result });
      }
    } catch (err) {
      console.error(err);
      res.json({ success: false, err });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, middleName, surName, oldPassword, newPassword, avatar } = req.body;
      const data = { firstName, middleName, surName, oldPassword, newPassword, avatar };

      const result = await User.update(data, { where: { id } });
      res.json({ success: true, data });
    } catch (err) {
      console.error(err);
      res.json({ success: false, err });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await User.destroy({ where: { id } });
      res.json({ success: true, data: result });
    } catch (err) {
      console.error(err);
      res.json({ success: false, err });
    }
  },
}
