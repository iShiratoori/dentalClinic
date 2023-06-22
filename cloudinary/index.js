const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const createfolder = (storagePath) => {
    return new CloudinaryStorage({
        cloudinary,
        params: {
            folder: storagePath,
            allowedFormats: ['jpeg', 'png', 'jpg']
        }
    })
}
const updateFolder = (filepath, moveTo) => {
    const uploadOptions = { folder: moveTo };
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filepath, uploadOptions, (error, result) => {
            if (error) {
                console.error('Error uploading file to Cloudinary:', error);
                reject(error);
            } else {
                if (result.signature) {
                    resolve(result);
                } else {
                    reject(new Error('File upload failed.'));
                }
            }
        });
    });
};


const deleteFile = (public_id) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) {
                console.error('Error while deleting image file/image  from Cloudinary:', error);
                reject(error);
            } else {
                if (result.result === 'ok') {
                    // resolve(new Error('failed to delete file/image from Cloudinary. '));
                    resolve(result);
                } else {
                    reject(new Error('failed to delete file/image from Cloudinary. '));
                }
            }
        });
    });
};

const pathTo = ({
    dentist: (id) => ({
        profile: `dentalClinic/dentists/${id}`,
    }),
    patient: (id) => ({
        profile: `dentalClinic/patients/${id}`,
        Xrays: `dentalClinic/patients/${id}/xrays`,
        beforeAfter: `dentalClinic/patients/${id}/beforeAndAfter`,
    }),
    user: ({
        profile: `dentalClinic/users`,
    })
})

module.exports.cloudinary = {
    cloudinary,
    createfolder,
    // renameFile,
    updateFolder,
    deleteFile,
    pathTo
}