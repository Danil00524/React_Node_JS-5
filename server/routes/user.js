const express = require('express');
const router = express.Router();
const controllerUser = require('../controllers/user');
const User = require('../db').models.users;
const jwt = require('jsonwebtoken');
const constants = require('../../constans');
// const auth = require('../helpers/auth');

// const passport = require("passport");
// passport.authenticate('jwt', { session: false })

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log(token);

        user = jwt.verify(token, constants.secretKey);
        next();
    } catch (error) {
        res.json({
            success: false,
            text: 'Срой действия токена истек.'
        })
    };
};

router.post('/login', controllerUser.authenticate);
router.get('/profile', auth, controllerUser.authorization);
router.post('/refresh-token', controllerUser.refreshToken);
router.get('/signout', controllerUser.logout);
router.post('/registration', controllerUser.create);
router.patch('/:id', controllerUser.update);
router.delete('/users/:id', controllerUser.delete);

module.exports = router;
