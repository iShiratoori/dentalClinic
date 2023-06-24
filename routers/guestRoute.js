const express = require('express')
const router = express.Router();

const { isLogged } = require('../utils/middleware');

router.get('/', isLogged, (req, res) => {
    res.redirect('/guest/dashboard')
})
router.get('/dashboard', (req, res) => {
    res.render('dashboard/guest/index')
});
module.exports = router