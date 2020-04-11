// const passport = require('passport');
// var _ = require('lodash');
// var jwt = require('jsonwebtoken');

// var passportJWT = require("passport-jwt");

// var ExtractJwt = passportJWT.ExtractJwt;
// var JwtStrategy = passportJWT.Strategy;

// var jwtOptions = {}
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();;
// jwtOptions.secretOrKey = 'tasmanianDevil';

// var users = [
//     {
//         id: 1,
//         name: 'jonathanmh',
//         password: '%2yx4'
//     },
//     {
//         id: 2,
//         name: 'test',
//         password: 'test'
//     }
// ];

// var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
//     console.log('payload received', jwt_payload);
//     // usually this would be a database call:
//     var user = users[_.findIndex(users, { id: jwt_payload.id })];
//     if (user) {
//         next(null, user);
//     } else {
//         next(null, false);
//     }
// });

// passport.use(strategy);

// module.exports = passport;




















// const LocalStrategy = require('passport-local').Strategy;

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   // здесь необходимо найти пользователя с данным id в БД
//   // но он у нас один и мы просто сравниваем
//   const _user = user.id === id ? user : false;
//   done(null, _user);
// });

// const user = {
//   id: 1,
//   email: 'email@gmail.com',
//   password: '123',
// };

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'email'
//     },
//     (email, password, done) => {
//       if (email === user.email && password === user.password) {
//         return done(null, user);
//       } else {
//         return done(null, false);
//       }
//     }
//   )
// )
