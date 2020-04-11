var express = require('express');
var router = express.Router();
var controllerUser = require('../controllers/user');

router.post('/login', controllerUser.authenticate);
router.get('/signout', controllerUser.logout);
router.post('/registration', controllerUser.create);
router.get('/profile', controllerUser.read);
router.patch('/:id', controllerUser.update);
router.delete('/:id', controllerUser.delete);

module.exports = router;
