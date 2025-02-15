const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth');
const likeDao = require('../../modules/likesDAO');

router.post('/manipulate', authMiddleware.authOfLoginMessage, async function(req,res){
    if (!req.session.isLoggedIn){
        res.json({isLoggedIn: false});
    }
    const {userId, articleId, isLiked} = req.body;
    if(isLiked){
        await likeDao.deleteLike(userId, articleId);
        res.json({
            isLoggedIn: true,
        });

    }else {
        const result = await likeDao.createLike(userId, articleId);
        // console.log('isNotLiked-----',result);
        res.json({
            isLoggedIn: true,
        });
    }
})


module.exports = router;