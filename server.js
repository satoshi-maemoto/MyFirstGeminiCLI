const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/shop_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Define Mongoose Schemas and Models
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});
const CartItem = mongoose.model('CartItem', cartItemSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
}));

// In-memory data stores (will be replaced by DB)
const products = [
  { id: 1, name: 'クッキー', price: 100, image: '/images/cookie.png' },
  { id: 2, name: 'チョコレート', price: 150, image: '/images/chocolate.png' },
  { id: 3, name: 'キャンディー', price: 80, image: '/images/candy.png' },
];

// Routes
const authRoutes = require('./routes/auth')(User);
const shopRoutes = require('./routes/shop')(products, CartItem);

app.use(authRoutes);
app.use(shopRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});