var express = require('express');
var passport = require("passport");
var router = express.Router();
var bcrypt = require("bcryptjs");

const User = require('../db').models.users;


// ========== PASSPORT JS ==========
var jwt = require('jsonwebtoken');
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'danil00524';

var strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  console.log('payload received', jwt_payload);

  const user = await User.findOne({ where: { id: jwt_payload.id } });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

// TODO? ^^^ Как его вынести в отдельный модуль??? ^^^
// ========== PASSPORT JS ==========



router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) throw 'Заполните все поля!'

    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ success: false, message: "Пользователь не найден." });
    }

    const statusValidate = await bcrypt.compare(password, user.password)

    if (statusValidate) {
      var payload = { id: user.id };
      var token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ success: true, message: "Аутентификация прошла успешно.", token: token, user });
    } else {
      res.status(401).json({ success: false, message: "Пароль не верный." });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error })
  }
});

router.get('/profile', (req, res) => {
  // TODO? Как тут достать данные нужного пользователя?
  // TODO! При попытке входа, сразу вызывается 'else'. Хотя login произошел.
  if (req.isAuthenticated()) {
    res.json({ success: true, message: 'Доступ разрешен.' })
  } else {
    res.status(403).json({ success: false, message: 'У пользователя нету прав для просмотра данной страницы.' });
  }
});

router.get('/signout', (req, res) => {
  try {
    req.logout();
    res.json({ success: true, message: 'Выход произошел успешно.' })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error })
  }
});

router.post('/registration', async (req, res, next) => {
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
});

router.patch('/user/:id', async (req, res, next) => {
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
});

router.delete('/user/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await User.destroy({ where: { id } });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.json({ success: false, err });
  }
});

module.exports = router;
