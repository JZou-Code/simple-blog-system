const express = require('express');
const router = express.Router();
const articleDao = require('../../modules/articleDAO');
const commentDao = require('../../modules/commentDAO');
const likeDao = require('../../modules/likesDAO');
const authMiddleware = require('../../middlewares/auth');
const path = require('path')
const fs = require('fs');

// set multer
const multer = require('multer');
const upload = multer({
    dest: path.join(__dirname, '../../public/images/temp'),
})

// set Jimp
const {Jimp} = require("jimp");

// set jpeg-js size, not useful
// const jpeg = require('jpeg-js');
// jpeg.decode.maxMemoryUsageInMB = 2000;

// router.use(authMiddleware.authOfLogin);

router.get('/get-new', async function (req, res) {
    const articleId = parseInt(req.query.id);
    const limit = 10;
    let articlesArr, commentsArr, likesMap;
    let likeStateObj = {};

    if (articleId > 0) {
        articlesArr = await articleDao.retrieveNewArticlesWithId(articleId, limit);
    } else {
        articlesArr = await articleDao.retrieveNewArticlesWithoutId(limit);
    }

    const articleIdArr = [];
    articlesArr.forEach(article => {
        articleIdArr.push(article.id);
    })

    if (articleIdArr) {
        commentsArr = await commentDao.retrieveCommentsByArticleId(articleIdArr)
        likesMap = await likeDao.retrieverLikesInfoByArticleId(articleIdArr);
        if (req.session.user) {
            likeStateObj = await likeDao.retrieveIsUserLikedState(articleIdArr, req.session.user.userId);
        }
    }

    res.json({
        articles: articlesArr,
        comments: commentsArr,
        likes: likesMap,
        likeStates: likeStateObj
    })
})

router.get('/get-single', async function (req, res) {
    let commentsArr = [];
    let likesMap = new Map();
    let likeStateObj = {};

    const articleId = parseInt(req.query.id);

    const article = await articleDao.retrieveSingleArticleById(articleId);

    if (article) {
        commentsArr = await commentDao.retrieveCommentsByArticleId([article.id])
        likesMap = await likeDao.retrieverLikesInfoByArticleId([article.id]);
        if (req.session.user) {
            likeStateObj = await likeDao.retrieveIsUserLikedState([article.id], req.session.user.userId);
        }
    }

    res.json({
        articles: [article],
        comments: commentsArr,
        likes: likesMap,
        likeStates: likeStateObj
    })
})

router.post('/submit', upload.array('images[]', 9), async function (req, res) {
    const filesInfo = req.files;
    // console.log('fileInfo-articles-api.js-34', filesInfo)

    const {title, content} = req.body;
    // const images = [];
    //
    // const realImagePath = path.join(__dirname, '../../public/images/user-upload/')
    // const thumbnailPath = path.join(__dirname, '../../public/images/thumbnails/')
    //
    // for (const fileElement of filesInfo) {
    //     const oldFileName = fileElement.path;
    //     const fileName = `${fileElement.filename}-${fileElement.originalname}`
    //     const newFileName = `${realImagePath}${fileName}`;
    //     fs.renameSync(oldFileName, newFileName);
    //
    //     const resizedImage = await Jimp.read(newFileName);
    //     await resizedImage.resize({w: 320});
    //     await resizedImage.write(`${thumbnailPath}${fileName}`);
    //
    //     const storedPath = `/images/thumbnails/${fileName}`;
    //     images.push(storedPath);
    // }

    const images = await uploadFileHandler(filesInfo);

    const imagesPath = JSON.stringify(images);
    const userId = req.session.user.userId;
    const article = {
        title,
        content,
        userId,
        imagesPath
    }

    const newArticle = await articleDao.creatArticle(article);
    // console.log('newArticle-articles-api.js-73', newArticle);

    res.redirect('/')
})

router.post('/get-my-articles', async function (req, res) {
    if (req.session.user) {
        const result = await articleDao.retrieveMyArticlesById(req.session.user.userId);
        res.json({articles: result});
    }
})

router.post('/get-my-likes', async function (req, res) {
    if (req.session.user) {
        const result = await articleDao.retrieveMyLikesById(req.session.user.userId);
        res.json({articles: result});
    }
})

router.get('/edit', async function (req, res) {
    if (req.session.user) {
        const article = await articleDao.retrieveSingleArticleById(req.query.articleId)
        if (article.user_id !== req.session.user.userId) {
            res.json({
                isValid: 'NA'
            })
        } else if (!article) {
            res.json({
                isValid: 'NE'
            })
        }
        res.json({
            title: article.title,
            content: article.content,
            images: article.image_path,
            isValid: 'OK'
        })
    }
})

router.post('/update', upload.array('images[]', 9), async function (req, res) {
    const filesInfo = req.files;
    const {title, content, keptImages, deletedImages, articleId} = req.body;
    // const images = [];
    //
    // const realImagePath = path.join(__dirname, '../../public/images/user-upload/')
    // const thumbnailPath = path.join(__dirname, '../../public/images/thumbnails/')
    //
    // for (const fileElement of filesInfo) {
    //     const oldFileName = fileElement.path;
    //     const fileName = `${fileElement.filename}-${fileElement.originalname}`
    //     const newFileName = `${realImagePath}${fileName}`;
    //     fs.renameSync(oldFileName, newFileName);
    //
    //     const resizedImage = await Jimp.read(newFileName);
    //     await resizedImage.resize({w: 320});
    //     await resizedImage.write(`${thumbnailPath}${fileName}`);
    //
    //     const storedPath = `/images/thumbnails/${fileName}`;
    //     images.push(storedPath);
    // }
    const retrieveItem = await articleDao.retrieveSingleArticleById(articleId);

    if (!req.session.user || retrieveItem.user_id !== req.session.user.userId) {
        res.json({result: 'false'})
    }

    const images = await uploadFileHandler(filesInfo);
    images.unshift(...JSON.parse(keptImages));

    JSON.parse(deletedImages).forEach(imagePath => {
        const fullSizeImagePath = imagePath.replace('thumbnails', 'user-upload');
        fs.rm(imagePath, err => {
            if (err) {
                console.log('Failed to delete thumbnail ', err)
            }
        })
        fs.rm(fullSizeImagePath, err => {
            if (err) {
                console.log('Failed to delete full size image ', err)
            }
        })
    })

    const imagesPath = JSON.stringify(images);
    const article = {
        title,
        content,
        articleId,
        imagesPath
    }

    try {
        await articleDao.updateArticle(article);
        res.json({result: 'ok'})
    } catch (err) {
        console.log('Failed to update article', err)
        res.json({result: 'fail'})
    }
})

async function uploadFileHandler(filesInfo) {
    const images = [];

    const realImagePath = path.join(__dirname, '../../public/images/user-upload/')
    const thumbnailPath = path.join(__dirname, '../../public/images/thumbnails/')

    for (const fileElement of filesInfo) {
        const oldFileName = fileElement.path;
        const fileName = `${fileElement.filename}-${fileElement.originalname}`
        const newFileName = `${realImagePath}${fileName}`;
        fs.renameSync(oldFileName, newFileName);

        const resizedImage = await Jimp.read(newFileName);
        await resizedImage.resize({w: 320});
        await resizedImage.write(`${thumbnailPath}${fileName}`);

        const storedPath = `/images/thumbnails/${fileName}`;
        images.push(storedPath);
    }
    return images;
}


module.exports = router;