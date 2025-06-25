const express = require('express');

module.exports = function(products) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('index', { products, user: req.session.user });
  });

  router.get('/cart', (req, res) => {
    res.render('cart', { cart: req.session.cart || [], user: req.session.user });
  });

  router.post('/cart', (req, res) => {
    const productId = parseInt(req.body.productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      if (!req.session.cart) {
        req.session.cart = [];
      }
      req.session.cart.push(product);
    }
    res.redirect('/');
  });

  router.post('/checkout', (req, res) => {
    req.session.cart = [];
    res.redirect('/');
  });

  return router;
};
