require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');

const connectDB = require('./server/config/db');
const { isactiveRoute } = require('./server/helpers/routeHelpers');

const app = express();
const port = 5000 || process.env.PORT;

//connect to DB
connectDB();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUri: process.env.MONGODB_URI
    }),
}));

app.use(express.static('public'));

//Templating engine
app.use(expressLayout);
app.set('layout','.layouts/main');
app.set('view engine', 'ejs');

app.locals.isactiveRoute = isactiveRoute;

//Routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));



app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`);
});