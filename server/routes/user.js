const express = require('express');
const router = express.Router();
const controllerUser = require('../controllers/user');

const User = require('../db').models.users;
const jwt = require('jsonwebtoken');
const constants = require('../../constans');

const auth = (req, res, next) => {
    try {
        let userId = null;
        const token = req.headers.authorization;

        userId = jwt.verify(token, constants.secretKey).user.id;
        const user = User.findOne({ where: { id: userId } });

        if (!user) {
            res.json({ success: false, message: 'Пользователь не существует.' });
        };

        req.user = user;
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
router.get('/signout', auth, controllerUser.logout);
router.post('/registration', controllerUser.create);
router.patch('/:id', auth, controllerUser.update);
router.delete('/users/:id', auth, controllerUser.delete);

module.exports = router;
