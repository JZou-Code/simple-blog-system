const express = require('express');
const router = express.Router();
const userDao = require('../../modules/userDAO')
const authMiddleware = require('../../middlewares/auth');

router.get('/delete', authMiddleware.authOfLoginMessage, async function (req, res) {

    console.log('haha==========================')
    if (!req.session.isLoggedIn) {
        return res.json({isLoggedIn: false})
    }

    try {
        const result = await userDao.deleteUser(req.session.user.userId);
        if (result.affectedRows > 0) {
            res.json({
                isLoggedIn: true,
                isDeleted: true
            })
        } else {
            res.json({
                isLoggedIn: true,
                isDeleted: false
            })
        }
    }catch (err){
        console.log(err)
    }
})

module.exports = router;