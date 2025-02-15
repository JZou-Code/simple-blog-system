const express = require('express');
const router = express.Router();
const articlesApiRouter = require('../api/articles-api')
const authMiddleware = require('../../middlewares/auth');
const articleDao = require('../../modules/articleDAO')
const {query} = require("express");
const {render, set} = require("express/lib/application");

router.use('/api', articlesApiRouter);
router.use('/my-articles', authMiddleware.authOfLogin);
router.use('/my-likes', authMiddleware.authOfLogin);

router.get('/post', async function (req, res) {
    res.render('articles/post', {layout: 'articles-set'});
})

// router.get('/my-articles/:id', async function (req, res) {
//     // console.log(typeof req.params.id, req.params.id)
//     // console.log(typeof req.session.user.userId, req.session.user.userId)
//     const article = await articleDao.retrieveSingleArticleById(req.params.id);
//     // if(req.session.user.userId !== article.user_id){
//     //     res.redirect(`/my-articles/${req.params.id}?message=Sorry.`, );
//     // }
//     let layout = '';
//     switch (article.image_path.length) {
//         case 0:
//             layout = '';
//             break;
//         case 1:
//             layout = 'images-1Image';
//             break;
//         case 2:
//         case 4:
//             layout = 'images-2or4Images';
//             break;
//         default:
//             layout = 'images-3or5orMore';
//     }
//     const fullSizeImages = [];
//     article.image_path.forEach(image => {
//         fullSizeImages.push({thumbnail: image, fullSize: image.replace('thumbnails', 'user-upload')})
//     })
//
//     const message = req.query.message === 'failed' ? 'Sorry, only author can edit this article.' : '';
//
//     const context = {
//         layout: 'singleArticle-set',
//         title: article.title,
//         content: article.content,
//         images: article.image_path,
//         fullSizeImages: fullSizeImages,
//         layoutClass: layout,
//         articleId: article.id,
//         lastEdit: article.updated_time,
//         message: message,
//         username: article.username,
//         avatar: article.avatar_path
//     }
//     res.render('articles/singleArticle', context)
// })

router.get('/:id', (req, res) => {
    res.render('option/anonymous-single-article', {layout: 'home-set'})
})

router.get('/my-articles/:id', async function (req, res) {
    try {
        const article = await articleDao.retrieveSingleArticleById(req.params.id);
        if (req.session.user.userId !== article.user_id) {
            res.redirect(`/articles/${req.params.id}`);
            return;
        }
        res.render('option/my-articles', {layout: 'home-set'})
    } catch (err) {
        console.log('Failed to edit articles, ', err)
    }
})

router.get('/my-articles/:id/edit', async function (req, res) {
    try {
        const article = await articleDao.retrieveSingleArticleById(req.params.id);
        if (req.session.user.userId !== article.user_id) {
            res.redirect(`/articles/my-articles/${req.params.id}?message=failed`);
            return;
        }
        res.render('articles/post', {layout: 'articles-set'})
    } catch (err) {
        console.log('Failed to edit articles, ', err)
    }
})

router.get('/my-likes/:id', async function (req, res) {
    res.render('option/my-likes', {layout: 'home-set'})
})

router.get('/my-articles/:id/delete', async function (req, res) {
    try {
        const article = await articleDao.retrieveSingleArticleById(req.params.id);
        if (req.session.user.userId !== article.user_id) {
            res.redirect(`/articles/my-articles/${req.params.id}?message=failed`);
            return;
        }
        await articleDao.deleteArticleById(req.params.id)
        res.redirect('/profile/my-articles')
    } catch (err) {
        console.log('Failed to edit articles, ', err)
    }
})

module.exports = router;