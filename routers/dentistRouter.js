const express = require('express')
const router = express.Router();

const dentist = require('../controllers/dentists');
const { isLogged, isLinkedData } = require('../utils/middleware');

router.get('/', isLogged, (req, res) => {
    res.redirect('/dentist/dashboard')
})
router.get('/dashboard', isLogged, isLinkedData, dentist.index)
router.get('/dashboard/appointments', isLogged, isLinkedData, dentist.appointments)
router.get('/dashboard/patients', isLogged, isLinkedData, dentist.patients)
router.get('/dashboard/payments', isLogged, isLinkedData, dentist.payments)

module.exports = router