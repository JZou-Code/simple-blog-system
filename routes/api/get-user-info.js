const express = require('express');
const router = express.Router();
const userDao = require('../../modules/userDAO')

const authMiddleware = require('../../middlewares/auth')

router.get('/', authMiddleware.authOfLoginMessage, async function (req, res) {
    if (req.session.isLoggedIn) {
        const userId = req.session.user.userId;

        const {avatar_path} = await userDao.retrieveImgByUserId(userId);
        req.session.user.avatar = avatar_path;

        const response = {
            path: avatar_path,
            username: req.session.user.username,
            userId: userId,
            isLoggedIn: true
        }
        res.json(response)
    }else {
        res.json({
            isLoggedIn: false
        })
    }
})

module.exports = router;
