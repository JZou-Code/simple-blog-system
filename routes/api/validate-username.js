const express = require('express');
const router = express.Router();
const userDao = require('../../modules/userDAO')

router.get('/', async function (req, res) {
    const username = req.query.username;
    // console.log('name', username)
    const isValid = await userDao.isUsernameAvailable(username);
    // console.log('isValid', isValid)
    isValid ? res.json({isValid: true}) : res.json({isValid: false})
})

module.exports = router;
