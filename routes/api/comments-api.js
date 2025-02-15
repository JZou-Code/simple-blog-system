const express = require('express');
const router = express.Router();
const commentDao = require('../../modules/commentDAO');
const authMiddleware = require('../../middlewares/auth');

const multer = require('multer');
const path = require("path");
const upload = multer({
    dest: path.join(__dirname, '../../public/images/temp'),
})

router.post('/delete', authMiddleware.authOfLoginMessage, upload.none(), async function (req, res) {
    if (req.session.isLoggedIn) {
        const {commentId, userId} = req.body;
        const comment = await commentDao.retrieveSingleCommentById(commentId);

        if (comment.user_id !== Number(userId)) {
            res.json({
                isValid: false,
                isLoggedIn: true
            })
        } else {
            await commentDao.deleteComment(commentId);
            res.json({
                isValid: true,
                isLoggedIn: true
            })
        }
    } else {
        res.json({
            isLoggedIn: false
        })
    }
})

router.post('/add', authMiddleware.authOfLoginMessage, async function (req, res) {
    if (req.session.isLoggedIn) {
        const newComment = req.body;
        const result = await commentDao.createComment(newComment);
        const realComment = await commentDao.retrieveSingleCommentById(result.id);
        res.json({
            comment: realComment,
            isLoggedIn: true
        })
    } else {
        res.json({isLoggedIn: false})
    }

})

module.exports = router;