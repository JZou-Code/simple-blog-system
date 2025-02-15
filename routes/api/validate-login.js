const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth');

router.get('/', authMiddleware.authOfLoginMessage, (req, res) => {
    if (req.session.isLoggedIn) {
        res.json({isLoggedIn: true});
    } else {
        res.json({isLoggedIn: false});
    }
})


module.exports = router;