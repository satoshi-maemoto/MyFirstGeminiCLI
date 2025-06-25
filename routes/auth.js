const express = require('express');

module.exports = function(users) {
  const router = express.Router();

  router.get('/login', (req, res) => {
    res.render('login');
  });

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      req.session.user = user;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });

  router.get('/register', (req, res) => {
    res.render('register');
  });

  router.post('/register', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    res.redirect('/login');
  });

  router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

  return router;
};
