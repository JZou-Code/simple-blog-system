const express = require('express');
const router = express.Router();

const argon2 = require('argon2');

const validateRouter = require('../api/validate-username')
router.use('/validate-username', validateRouter)

const accountApiRouter = require('../api/account-api');
router.use('/api', accountApiRouter)

const userDao = require('../../modules/userDAO')

router.use((req, res, next) => {
    res.locals.user = req.session.user;
    next()
})

router.get('/login', (req, res) => {
    const message = req.flash('message');
    res.render('account/login', {
        layout: 'login-set',
        message: message
    })
})

router.post('/login', async function (req, res) {
    const user = req.body;
    const {username, password} = user;
    // try {
    //
    //
    //     const result = await userDao.retrievePwdAndIdByUsername(username);
    // } catch (e) {
    //     // Check if this was expected
    //     if (e.message === "not found") {
    //         return res.redirect('/account/login')
    //     }
    //
    //     throw new Error(e);
    // }

    const result = await userDao.retrievePwdAndIdByUsername(username);

    if (!result || result.is_deleted) {
        req.flash('message', "Account doesn't exist")
        res.redirect('/account/login')
    } else {
        const userId = result.id
        const hashedPwd = result.password
        // console.log('hashed', hashedPwd)
        const isMatch = await argon2.verify(hashedPwd, password)
        if (isMatch) {
            user.userId = userId;
            req.session.user = user;
            res.redirect('/')
        } else {
            req.flash('message', 'Authentication failed');
            res.redirect('/account/login')
        }
    }
})

router.get('/register', (req, res) => {
    res.render('account/register', {layout: 'login-set'})
})

router.post('/register', async function (req, res) {
    const user = req.body;
    delete user.confirm;
    user.password = await argon2.hash(user.password)

    const newUser = await userDao.createUser(user)
    console.log('newUser-account-routes.js-59', newUser)

    res.redirect('/account/login')
})

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
    }
    res.redirect("/anonymous");
})

module.exports = router;