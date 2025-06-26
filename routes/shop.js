const express = require('express');

module.exports = function(products, CartItem) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('index', { products, user: req.session.user, added: req.query.added });
  });

  router.get('/cart', async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    const cart = await CartItem.find({ userId: req.session.user._id });
    res.render('cart', { cart, user: req.session.user });
  });

  router.post('/cart', async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    const productId = parseInt(req.body.productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      const cartItem = new CartItem({
        userId: req.session.user._id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      await cartItem.save();
    }
    res.redirect('/?added=1');
  });

  router.post('/checkout', async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    await CartItem.deleteMany({ userId: req.session.user._id });
    res.redirect('/thankyou');
  });

  router.get('/thankyou', (req, res) => {
    res.render('thankyou');
  });

  router.post('/cart/delete/:itemId', async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    const itemId = req.params.itemId;
    await CartItem.findByIdAndDelete(itemId);
    res.redirect('/cart');
  });

  router.post('/cart/clear', async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    await CartItem.deleteMany({ userId: req.session.user._id });
    res.redirect('/cart');
  });

  return router;
};