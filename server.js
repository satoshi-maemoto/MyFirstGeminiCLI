const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
}));

// In-memory data stores
const users = [];
const products = [
  { id: 1, name: 'クッキー', price: 100, image: '/images/cookie.png' },
  { id: 2, name: 'チョコレート', price: 150, image: '/images/chocolate.png' },
  { id: 3, name: 'キャンディー', price: 80, image: '/images/candy.png' },
];

// Routes
const authRoutes = require('./routes/auth')(users);
const shopRoutes = require('./routes/shop')(products);

app.use(authRoutes);
app.use(shopRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
