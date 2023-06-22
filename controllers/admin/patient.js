const Dentist = require('../../models/dentists')
const Patient = require('../../models/patients')
const ExpressError = require('../..//utils/expressError');
const catchAsync = require('../../utils/catchAsync');
const { cloudinary } = require('../../cloudinary');

const utils = ({
    titles: ['Mr.', 'Mrs.', 'Miss', 'Ms.', 'Dr.', 'Prof.'],
    gender: ['male', 'female', 'others']
})

//index
const all = catchAsync(async (req, res, next) => {
    const patients = await Patient.find({});
    res.render('dashboard/admin/patients/index', { patients })
});

//render patient registeration form
const registrationPage = (req, res) => {
    res.render('dashboard/admin/patients/register', { utils })
};

//find a patient
const find = catchAsync(async (req, res, next) => {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId).populate('appointments');
    if (!patient) {
        const msg = ({
            title: 'Not Found Patient',
            text: `Sorry we cant the patient you are looking/try to updating please maku patient id ${patientId} exit you database`
        })
        throw next(new ExpressError(msg, 404));
    }
    res.render('dashboard/admin/patients/show', { patient })
});

//render editing page
const edit = catchAsync(async (req, res, next) => {
    const { patientId } = req.params
    const patient = await Patient.findById(patientId)
    if (!patient) {
        const msg = ({
            title: 'Not Found Patient',
            text: `Sorry we cant the patient you are looking/try to updating please maku patient id ${patientId} exit you database`
        })
        throw next(new ExpressError(msg, 404));
    }

    res.render('dashboard/admin/patients/edit', { patient, utils })
});

//register patient
const register = catchAsync(async (req, res, next) => {
    const newPatient = Patient(req.body.patient);
    const whereTo = cloudinary.pathTo.patient(newPatient._id).profile
    if (req.file) {
        await cloudinary.updateFolder(req.file.path, whereTo)
            .then((result) => {
                if (result.created_at) {
                    newPatient.image.public_id = result.public_id
                    newPatient.image.url = result.url
                } else {
                    const msg = ({
                        title: 'Error Uploading Image Cloudinary',
                        text: 'While Uploading Patient image there is error accured'
                    })
                    throw next(new ExpressError(msg, 404));
                }
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
            });
        await cloudinary.deleteFile(req.file.filename)
    } else {
        if (req.body.patient.image.url) {
            const { url } = req.body.patient.image
            await cloudinary.updateFolder(url, whereTo)
                .then(async (result) => {
                    // console.log('File uploaded successfully to Cloudinary:', result);
                    newPatient.image = ({
                        public_id: result.public_id,
                        url: result.url
                    })
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                });
        } else {
            const unknow = 'https://res.cloudinary.com/dm7zftkof/image/upload/v1686965695/dentalClinic/unknow-person_fj6car.jpg'
            await cloudinary.updateFolder(unknow, whereTo)
                .then(async (result) => {
                    // console.log('File uploaded successfully to Cloudinary:', result);
                    newPatient.image = ({
                        public_id: result.public_id,
                        url: result.url
                    })
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                });
        }
    }

    await newPatient.save();
    res.redirect(`/admin/dashboard/patients/${newPatient._id}`)
});

//update patient info
const update = catchAsync(async (req, res, next) => {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId)

    if (!patient) {
        const msg = ({
            title: 'Not Found Patient',
            text: `Sorry we cant the patient you are looking/try to updating please maku patient id ${patientId} exit you database`
        })
        throw next(new ExpressError(msg, 404));
    }

    const whereTo = cloudinary.pathTo.patient(patient._id).profile
    if (req.file) {
        const result = await cloudinary.updateFolder(req.file.path, whereTo)
        req.body.patient.image = ({
            public_id: result.public_id,
            url: result.url
        })

        // console.log(req.file.filename)
        await cloudinary.deleteFile(req.file.filename)
    } else {
        if (req.body.patient.image) {
            const { url } = req.body.patient.image
            const result = await cloudinary.updateFolder(url, whereTo)
            req.body.patient.image = ({
                public_id: result.public_id,
                url: result.url
            })
        }
    }
    await Patient.findByIdAndUpdate(patientId, req.body.patient)
    res.redirect(`/admin/dashboard/patients/${patientId}`)
})

//delete patient 
const deleteP = catchAsync(async (req, res, next) => {
    const { patientId } = req.params;
    await Patient.findByIdAndDelete(patientId)
    res.redirect('/admin/dashboard/patients')
})

const linkingDentistPage = catchAsync(async (req, res, next) => {
    const { patientId } = req.params
    const patient = await Patient.findById(patientId)
    if (!patient) {
        const msg = ({
            title: 'Not Found Patient',
            text: 'Sorry the patient you are looking not found'
        })

        throw next(new ExpressError(msg, 404));
    }
    if (patient.dentist) {
        const msg = ({
            title: 'Already Linked',
            text: 'Sorry Already Linkd this patient to a dentist'
        })
        throw next(new ExpressError(msg, 404));

    }
    res.render('dashboard/admin/patients/lintodentist', { patient })
});
const linkToDentist = catchAsync(async (req, res, next) => {
    const { patientId, } = req.params;
    const { dentistId } = req.body.dentist;
    const dentist = await Dentist.findById(dentistId)
    if (!dentist) {
        const msg = ({
            title: 'Not Found dentist',
            text: `Sorry we cant the dentist you are looking/try to updating please maku patient id ${dentistId} exit you database`
        })
        throw next(new ExpressError(msg, 400));
    }
    const patient = await Patient.findByIdAndUpdate(patientId, { dentist: dentist })
    dentist.patients.push(patient)
    await dentist.save()
    res.redirect(`/admin/dashboard/patients/${patientId}`)
})
const search = catchAsync(async (req, res, next) => {
    const { name } = req.query;
    const searchQuery = name; // The search query received from the client

    await Patient.find({ search: { $regex: searchQuery, $options: 'i' } })
        .then(patients => {
            // console.log(dentists);
            if (!patients.length) {
                return res.render('dashboard/admin/patients/404', { name })
            }
            res.render('dashboard/admin/patients/search', { patients });
        })
        .catch(error => {
            // Handle the error
            console.error(error);
            res.status(500).send('An error occurred during the search');
        });
});

module.exports.patient = {
    all,
    registrationPage,
    find,
    edit,
    register,
    update,
    deleteP,
    linkingDentistPage,
    linkToDentist,
    search
}