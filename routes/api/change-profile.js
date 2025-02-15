const express = require('express');
const router = express.Router();
const userDao = require('../../modules/userDAO');
const authMiddleware = require('../../middlewares/auth');
const argon2 = require('argon2');


router.use(authMiddleware.authOfLogin);

router.post('/change-avatar',  async function (req, res) {
    let avatarPath = req.body['selected-avatar'];
    const arr = avatarPath.split('/')
    avatarPath = '/images/avatars/' + arr[arr.length-1]
    const userId = req.session.user.userId;

    console.log(req.session.user)
    // console.log(avatar);
    await userDao.updateUserAvatarPath(avatarPath, userId);
    res.redirect('/profile/edit')
})

router.post('/edit-profile', async function (req, res) {
    const user = req.body;
    const userId = req.session.user.userId;
    await userDao.updateUserProfile(user, userId);
    res.redirect('/account/login')
})

router.post('/change-pwd', async function (req, res) {
    const user = req.body;
    const newPassword = await argon2.hash(user.password)

    await userDao.updateUserPassword(newPassword,req.session.user.userId);
    res.redirect('/account/login')
})

module.exports = router;
