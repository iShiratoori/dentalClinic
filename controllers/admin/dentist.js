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
const all = catchAsync(async (req, res) => {
    const dentists = await Dentist.find({});
    res.render('dashboard/admin/dentists/index', { dentists })
});

//render dentist registration form
const renderRegistration = (req, res) => {
    res.render('dashboard/admin/dentists/register', { utils })
}

const register = catchAsync(async (req, res, next) => {
    const dentist = await Dentist(req.body.dentist)
    const whereTo = cloudinary.pathTo.dentist(dentist._id).profile
    if (req.file) {

        await cloudinary.updateFolder(req.file.path, whereTo)
            .then((result) => {
                if (result.created_at) {
                    dentist.image.public_id = result.public_id
                    dentist.image.url = result.url
                } else {
                    const msg = ({
                        title: 'Error Uploading Image Cloudinary',
                        text: 'While Uploading Dentist image there is error accured'
                    })
                    throw next(new ExpressError(msg, 404));
                }
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
            });

        await cloudinary.deleteFile(req.file.filename)
    } else {
        if (req.body.dentist.image.url) {
            const { url } = req.body.dentist.image
            await cloudinary.updateFolder(url, whereTo)
                .then(async (result) => {
                    // console.log('File uploaded successfully to Cloudinary:', result);
                    dentist.image = ({
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
                    dentist.image = ({
                        public_id: result.public_id,
                        url: result.url
                    })
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                });
        }
    }
    await dentist.save();
    res.redirect(`/admin/dashboard/dentists/${dentist._id}`)
})
//render edit dentist form
const edit = catchAsync(async (req, res, next) => {
    const { dentistId } = req.params;
    const dentist = await Dentist.findById(dentistId)
    if (!dentist) {
        throw next(new ExpressError('NOT FOUND DENTIST'));
    }
    res.render('dashboard/admin/dentists/edit', { dentist, utils })
});

//find a dentist
const find = catchAsync(async (req, res, next) => {
    const { dentistId } = req.params
    const dentist = await Dentist.findById(dentistId).populate('patients')
    if (!dentist) {
        const msg = ({
            title: 'Not Found dentist',
            text: `Sorry we cant the dentist you are looking/try to updating please maku patient id ${dentistId} exit you database`
        })
        throw next(new ExpressError(msg, 404));
    }
    res.render('dashboard/admin/dentists/show', { dentist })
})

//updating dentist info
const update = catchAsync(async (req, res, next) => {
    const { dentistId } = req.params;
    const dentist = await Dentist.findById(dentistId)

    if (!dentist) {
        const msg = ({
            title: 'Not Found dentist',
            text: `Sorry we cant the dentist you are looking/try to updating please maku patient id ${dentistId} exit you database`
        })
        throw next(new ExpressError(msg, 404));
    }


    const whereTo = cloudinary.pathTo.dentist(dentist._id).profile
    if (req.file) {
        const result = await cloudinary.updateFolder(req.file.path, whereTo)
        req.body.dentist.image = ({
            public_id: result.public_id,
            url: result.url
        })

        // console.log(req.file.filename)
        await cloudinary.deleteFile(req.file.filename)
    } else {
        if (req.body.dentist.image) {
            const { url } = req.body.dentist.image
            const result = await cloudinary.updateFolder(url, whereTo)
            req.body.dentist.image = ({
                public_id: result.public_id,
                url: result.url
            })

        }
    }
    await Dentist.findByIdAndUpdate(dentistId, req.body.dentist);
    res.redirect(`/admin/dashboard/dentists/${dentistId}`)
})

//delete dentist
const deleteD = catchAsync(async (req, res, next) => {
    const { dentistId } = req.params;
    const dentist = await Dentist.findByIdAndDelete(dentistId).populate('patients');

    if (dentist.patients) {
        for (const patient of dentist.patients) {
            await Patient.findByIdAndUpdate(patient._id, { dentist: null });
        }
    }
    res.redirect('/admin/dashboard/dentists')
})

const search = catchAsync(async (req, res) => {
    const { name } = req.query;
    const searchQuery = name; // The search query received from the client

    await Dentist.find({ search: { $regex: searchQuery, $options: 'i' } })
        .then(dentists => {
            // console.log(dentists);
            if (!dentists.length) {
                return res.render('dashboard/admin/dentists/404', { name })
            }
            res.render('dashboard/admin/dentists/search', { dentists });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('An error occurred during the search');
        });
});

module.exports.dentist = {
    all,
    renderRegistration,
    register,
    edit,
    find,
    update,
    deleteD,
    search
}