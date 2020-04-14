const bcrypt = require("bcryptjs");
const auth = require('../helpers/auth');
const User = require('../db').models.users;
const { schemaRegistration, schemaUpdateProfileInfo } = require('../helpers/schemas');

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
    try {
      const { username, password, surName, firstName, middleName } = req.user;

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
        error: error.message,
      });
    }
  },
  refreshToken: async (req, res) => {
    const refreshToken = req.headers.authorization;
    const data = await auth.refreshTokens(refreshToken);

    res.json(data);
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
  list: async (req, res) => {
    try {
      const users = await User.findAll();

      const shortUsersInfo = users.map((user) => {
        return {
          username: user.username,
          middleName: user.middleName,
          surName: user.surName,
          firstName: user.firstName
        }
      })

      res.json({
        success: true,
        users: shortUsersInfo,
      })
    } catch (error) {
      res.json({
        success: false,
        error
      })
    }
  },
  create: async (req, res) => {
    try {
      const { username, surName, firstName, middleName, password } = req.body;
      const value = await schemaRegistration.validateAsync({ username, surName, firstName, middleName, password });

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
      const value = schemaUpdateProfileInfo.validateAsync(req.body);
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
