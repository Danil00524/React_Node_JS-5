var express = require('express');
var router = express.Router();
const passport = require('passport');

const User = require('../db').models.user;

var users = [
  {
    id: 1,
    name: 'jonathanmh',
    password: '%2yx4'
  },
  {
    id: 2,
    name: 'test',
    password: 'test'
  }
];

router.post('/login', async (req, res, next) => {
  const { name = '', password = '' } = req.body;

  // usually this would be a database call:
  const user = users[_.findIndex(users, { name: name })];

  if (!user) {
    res.status(401).json({ message: 'Пользователь не найден.' })
  }

  if (user.password === password) {
    const payload = { id: user.id };
    const token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({ message: 'ok', token: token });
  } else {
    res.status(401).json({message: 'Неверный пароль.'})
  }
  // passport.authenticate('jwt', (err, user, info) => {
  //   if (err) next(err);

  //   if (!user) res.send('Укажите правильный email и пароль!');

  //   req.login(user, err => {
  //     return res.send('Вы удачно прошли аутентификацию!')
  //   })
  // })(req, res, next);
  // try {
  //   const result = await User.findAll();
  //   res.json({ success: true, data: result });
  // } catch (err) {
  //   console.error(err);
  //   res.json({ success: false, err });
  // }
});

router.get('/secret', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('Вы ок.')
  } else {
    res.status(403).send('Все не ок.');
  }
});

router.get('/signout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// router.post('/registration', async (req, res, next) => {
//   try {
//     const { username, surName, firstName, middleName, password } = req.body;
//     const data = {
//       username, surName, firstName, middleName, password
//     }

//     const result = await User.create(data);
//     res.json({ success: true, data: result });
//   } catch (err) {
//     console.error(err);
//     res.json({ success: false, err });
//   }
// });

// router.put('/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { username, email, password } = req.body;
//     const data = {
//       username,
//       email,
//       password
//     }

//     const result = await User.update(data, { where: { id } });
//     res.json({ success: true, data: result });
//   } catch (err) {
//     console.error(err);
//     res.json({ success: false, err });
//   }
// });

// router.delete('/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const result = await User.destroy({ where: { id } });
//     res.json({ success: true, data: result });
//   } catch (err) {
//     console.error(err);
//     res.json({ success: false, err });
//   }
// });

module.exports = router;
