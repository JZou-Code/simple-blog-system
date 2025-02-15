const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth')
const articleDao = require('../../modules/articleDAO')

router.get('/', authMiddleware.authOfHome, async function (req, res) {
    const context = {
        layout: 'home-set',
        username: req.session.user.username
    }
    res.render('home/home', context)
})

router.get('/anonymous', async function (req, res) {
    // const articlesArr = await articleDao.retrieveAllArticles();
    // console.log('articlesArr', articlesArr);
    const context = {
        layout: 'home-set',
        // articles: articlesArr
    }
    if (req.session.user) {
        res.redirect('/')
    } else {
        res.render('home/anonymous', context)
    }
})

module.exports = router;

