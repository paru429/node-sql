const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
    User.findByPk(1).then(user => {
        // the user here is an instance of sequelize object
        req.user = user;
        next();
    }).catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
//Reverse dont need to be mentioned one direction is enough
User.hasMany(Product);

User.hasOne(Cart);
//Reverse dont need to be mentioned one direction is enough
Cart.belongsTo(User);

Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// sync({force: true})
sequelize.sync().then(() => {
    return User.findByPk(1);
}).then(user => {
    console.log('user',user);
    if(!user) {
        return User.create({name: 'Paru', email: 'xyz@abc.com'});
    }
    return user;
}).then(user => {
    return user.createCart();
}).then(() => {
    app.listen(3000, () => {console.log('server started')});
}).catch(err => console.log(err));
