const express = require('express');
const router = express.Router();
const controllerUser = require('../controllers/user');

router.post('/login', controllerUser.authenticate);
router.get('/profile', controllerUser.authorization);
router.get('/signout', controllerUser.logout);
router.post('/registration', controllerUser.create);
router.patch('/:id', controllerUser.update);
router.delete('/users/:id', controllerUser.delete);

module.exports = router;
