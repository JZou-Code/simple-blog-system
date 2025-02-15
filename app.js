// Load a .env file if one exists
require('dotenv').config()

const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const path = require('path');

// JZ: new packages
const session = require("express-session");
const flash = require('connect-flash');

// Listen port will be loaded from .env file, or use 3000
const port = process.env.EXPRESS_PORT || 3000;

// Setup Handlebars
app.engine("handlebars", handlebars.create({
    defaultLayout: null
}).engine);

app.set("view engine", "handlebars");

// JZ: setup express-session
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "COMPX569",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
        httpOnly: true
    }
}));

// Set up to read POSTed form data
app.use(express.urlencoded({extended: true}));
app.use(express.json({}));
app.use(express.static(path.join(__dirname, 'public')))

// Set up to use flash module
app.use(flash());

const homeRouter = require('./routes/web/home-routes');
app.use(homeRouter);

const accountRouter = require('./routes/web/account-routes');
app.use('/account', accountRouter);

const profileRouter = require('./routes/web/profile-routes');
app.use('/profile', profileRouter);

const userInfoRouter = require('./routes/api/get-user-info');
app.use('/api/user-info', userInfoRouter);

const profileApiRouter = require('./routes/api/change-profile');
app.use('/api/profile', profileApiRouter);

const articlesRouter = require('./routes/web/articles-routes');
app.use('/articles', articlesRouter);

const commentsApiRouter = require('./routes/api/comments-api');
app.use('/api/comments', commentsApiRouter);

const likesApiRouter = require('./routes/api/likes-api');
app.use('/api/likes', likesApiRouter);

const validateLoginRouter = require('./routes/api/validate-login');
app.use('/api/validate-login', validateLoginRouter)

app.use((req, res) => {
    res.status(404).render('not-found')
});

app.use((err, req, res, next) => {
    if (err.message && err.message.includes("MariaDB")) {
        console.log('Database error:', err);
        return res.status(500).send("Internal server error, try again in a few minutes");
    }
    next(err);
});

app.use((err, req, res, next) => {
    console.error('General error:', err);
    res.status(500).send('Something broke!');
});

app.listen(port, function () {
    console.log(`Web final project listening on http://localhost:${port}/`);
});
