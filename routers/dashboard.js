const express = require('express');
const { isLogged, isAdmin, isOwner } = require('../utils/middleware');
const practiceRouter = require('./dentistRouter')
const patientRouter = require('./patientRouter')
const adminRouter = require('./adminRouter')
const router = express.Router();


router.use('/admin', isLogged, isAdmin, adminRouter)
router.use('/patient', isLogged, patientRouter)
router.use('/dentist', isLogged, practiceRouter)

module.exports = router