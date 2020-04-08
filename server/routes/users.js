var express = require('express');
var router = express.Router();

const User = require('../db').models.user;

router.get('/', async (req, res, next) => {
  try {
    const result = await User.findAll();
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.json({ success: false, err });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const data = {
      username,
      email,
      password
    }

    const result = await User.create(data);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.json({ success: false, err });
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const data = {
      username,
      email,
      password
    }

    const result = await User.update(data, { where: { id } });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.json({ success: false, err });
  }
});

router.delete('/:id', async (req, res, next) => {
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
