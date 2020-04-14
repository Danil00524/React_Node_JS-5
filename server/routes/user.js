const express = require('express');
const router = express.Router();
const controllerUser = require('../controllers/user');
const { authenticate } = require('../helpers/auth');

router.post('/login', controllerUser.authenticate);
router.get('/profile', authenticate, controllerUser.authorization);
router.post('/refresh-token', controllerUser.refreshToken);
router.get('/signout', authenticate, controllerUser.logout);
router.post('/registration', controllerUser.create);
router.patch('/:id', authenticate, controllerUser.update);
router.delete('/users/:id', authenticate, controllerUser.delete);

module.exports = router;
