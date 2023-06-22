const express = require('express')
const router = express.Router();

const { isLogged, isAdmin, uploadImageCloudTemporary, checkPermissions } = require('../utils/middleware');
const { validatePatient, validateDentist, validateAppointment } = require('../utils/validations')

const admin = require('../controllers/admin');
const permissions = ['create', 'read', 'update', 'delete'];

router.use(isLogged, checkPermissions('Admin', permissions))

router.get('/', isAdmin, (req, res) => {
    res.redirect('/admin/dashboard')
})
router.get('/dashboard', isAdmin, admin.index)

router.get('/dashboard/dentists/search', isAdmin, admin.dentist.search);
router.get('/dashboard/patients/search', isAdmin, admin.patient.search);

//==================================================//
//                  Dentist                         //
//==================================================//
router.route('/dashboard/dentists')
    //show all dentists
    .get(isAdmin, admin.dentist.all)
    //register new dentists
    .post(isAdmin, uploadImageCloudTemporary('dentalClinic/temporary'), validateDentist, admin.dentist.register)
//render registration page
router.get('/dashboard/dentists/register', isAdmin, admin.dentist.renderRegistration)
//editing page of a dentist info
router.get('/dashboard/dentists/:dentistId/edit', isAdmin, admin.dentist.edit)
router.route('/dashboard/dentists/:dentistId')
    //get specific dentist
    .get(isAdmin, admin.dentist.find)
    //update specific dentist
    .put(isAdmin, uploadImageCloudTemporary('dentalClinic/temporary'), validateDentist, admin.dentist.update)
    //delete specific dentist
    .delete(isAdmin, admin.dentist.deleteD)


//==================================================//
//                  PATIENT                         //
//==================================================//
router.route('/dashboard/patients')
    //show all patient
    .get(isAdmin, admin.patient.all)
    //register new patient
    .post(isAdmin, uploadImageCloudTemporary('dentalClinic/temporary'), validatePatient, admin.patient.register)
//render registration page
router.get('/dashboard/patients/register', isAdmin, admin.patient.registrationPage)
//editing page of a patient info
router.get('/dashboard/patients/:patientId/edit', isAdmin, admin.patient.edit)
router.route('/dashboard/patients/:patientId')
    //get specific patient
    .get(isAdmin, admin.patient.find)
    //update specific patient
    .put(isAdmin, uploadImageCloudTemporary('dentalClinic/temporary'), validatePatient, admin.patient.update)
    //delete specific patient
    .delete(isAdmin, admin.patient.deleteP)
//redering linking to dentist page
router.get('/dashboard/patients/:patientId/renderlinktodentistpage', isAdmin, admin.patient.linkingDentistPage)
//linking to dentist
router.post('/dashboard/patients/:patientId/linktodentist', isAdmin, admin.patient.linkToDentist)
//rendering new appointment page accually its the same one as the original
router.get('/dashboard/patients/:patientId/newappointment', isAdmin, admin.appointment.renderAppointmentPage)

//=======================================================//
//                  Appointment                         //
//======================================================//

//show all appointments
router.route('/dashboard/appointments')
    .get(isAdmin, admin.appointment.all)
    //create appointment
    .post(isAdmin, validateAppointment, admin.appointment.create)
//render appointment registeration form
router.get('/dashboard/appointments/new', isAdmin, admin.appointment.renderAppointmentPage)
//redning Edit appointment form
router.get('/dashboard/appointments/:appointmentId/edit', isAdmin, admin.appointment.edit)
router.route('/dashboard/appointments/:appointmentId')
    //update appointment
    .put(isAdmin, validateAppointment, admin.appointment.update)
    //delete appointment
    .delete(isAdmin, admin.appointment.deleteApp)


//==================================================//
//                  User                            //
//==================================================//

//show all users
router.get('/dashboard/users', isAdmin, admin.user.all)
//render editing user form
router.get('/dashboard/users/:userId/edit', isAdmin, admin.user.edit)
//update user info
router.post('/dashboard/users/:userId/unlink', isAdmin, admin.user.unlinkData)
router.route('/dashboard/users/:userId')
    .get(isAdmin, admin.user.edit) //editing page and this route are same
    .put(isAdmin, admin.user.linToData)
    .delete(isAdmin, admin.user.deleteD)

router.get('/dashboard/users/:userId/revokepermision', isAdmin, admin.user.revokepermision)


module.exports = router