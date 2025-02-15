const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth')
const userDao = require('../../modules/userDAO')

router.use(authMiddleware.authOfLogin)

router.get('/', async function (req, res) {
    const user = await userDao.retrieveUserByUserId(req.session.user.userId);
    const context = {
        layout: 'profile-set',
        user: user
    }
    res.render('profile/profile', context)
})

router.get('/edit', async function (req, res) {
    const user = await userDao.retrieveUserByUserId(req.session.user.userId);

    const context = {
        layout: 'profile-set',
        user: user
    }
    res.render('profile/edit-profile', context)
})

router.get('/my-articles', async function (req, res) {
    let des
    req.query.from.toUpperCase() === 'A' ? des = '/' : des = '/profile'
    const context = {
        layout: 'option-set',
        des: des
    }
    res.render('option/articles', context)
})

router.get('/my-likes', async function (req, res) {
    let des
    if (req.query.from) {
        req.query.from.toUpperCase() === 'A' ? des = '/' : des = '/profile'
    }
    const context = {
        layout: 'option-set',
        des: des
    }
    res.render('option/likes', context)
})

module.exports = router;

