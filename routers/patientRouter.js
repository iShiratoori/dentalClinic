const express = require('express');
const { isLogged, isLinkedData } = require('../utils/middleware');
const router = express.Router();
const patient = require('../controllers/patients')

router.get('/', isLogged, (req, res) => {
    res.redirect('/patient/dashboard')
})
router.get('/dashboard', isLogged, isLinkedData, patient.index)
router.get('/dashboard/dentist', isLogged, isLinkedData, patient.dentist)
router.get('/dashboard/appointments', isLogged, isLinkedData, patient.appointments)
router.get('/dashboard/payments', isLogged, isLinkedData, patient.payments)

module.exports = router