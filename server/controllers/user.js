const Joi = require('@hapi/joi');
const bcrypt = require("bcryptjs");

const jwt = require('jsonwebtoken');
const jwtOptions = require('../config-passport');

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
        const payload = { id: user.id };
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ success: true, message: "Аутентификация прошла успешно.", token: token, user });
      } else {
        res.status(401).json({ success: false, message: "Пароль не верный." });
      }
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error })
    }
  },
  authorization: async (req, res) => {
    // TODO? Как тут достать данные нужного пользователя?
    // TODO! При попытке входа, сразу вызывается 'else'. Хотя login произошел.
    if (req.isAuthenticated()) {
      res.json({ success: true, message: 'Доступ разрешен.' })
    } else {
      res.status(403).json({ success: false, message: 'У пользователя нету прав для просмотра данной страницы.' });
    }
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
