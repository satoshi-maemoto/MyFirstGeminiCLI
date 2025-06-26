const express = require('express');

module.exports = function(User) {
  const router = express.Router();

  router.get('/login', (req, res) => {
    res.render('login', { error: req.query.error, username: req.query.username });
  });

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      req.session.user = user;
      res.redirect('/');
    } else {
      res.redirect('/login?error=1&username=' + username);
    }
  });

  router.get('/register', (req, res) => {
    res.render('register');
  });

  router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
      const newUser = new User({ username, password });
      await newUser.save();
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.redirect('/register?error=1'); // エラーハンドリングを追加
    }
  });

  router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

  return router;
};