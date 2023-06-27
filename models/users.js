const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { cloudinary } = require('../cloudinary')
const Chat = require('./chats')
const passportLocalMongoose = require('passport-local-mongoose');
const rolePermissions = {
    'Admin': ['read', 'create', 'update', 'delete'],
    'Dentist': ['read', 'update'],
    'Patient': ['read', 'update'],
    'Guest': ['read']
};

const AccountSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        public_id: {
            type: String,
            required: [true, 'image public id failed to get'],
        },
        url: {
            type: String,
            required: [true, 'failed to get image url'],
        },
    },
    linkageData: {
        type: Schema.Types.ObjectId,
        refPath: 'linkageModel',
        default: null
    },
    linkageModel: {
        type: String,
        enum: ['Patient', 'Dentist', null],
        default: null
    },
    verification: {
        type: Schema.Types.ObjectId,
        ref: 'Verification'
    },
    chats: [
        {
            type: Schema.Types.ObjectId,
            refPath: 'Chat',
        }
    ],
    hasPermission: [
        {
            role: {
                type: String,
                required: true,
                enum: ['Admin', 'Dentist', 'Patient', 'Guest'],
                default: 'Guest'
            },
            permissions: {
                type: [
                    {
                        type: String,
                        required: true,
                        enum: ['create', 'read', 'update', 'delete'],
                    },
                ],
                validate: [
                    {
                        validator: function (permissions) {
                            // console.log(this.role, permissions)
                            if (this.role === 'Admin') {
                                return permissions.includes('create') && permissions.includes('read') && permissions.includes('update') && permissions.includes('delete');
                            } else if (this.role === 'Dentist') {
                                return permissions.includes('read') && permissions.includes('update');
                            } else if (this.role === 'Patient') {
                                return permissions.includes('read') && permissions.includes('update');

                            } else {
                                return true; //!permissions.includes('create') && !permissions.includes('write') && !permissions.includes('delete');
                                // Other roles have no specific permissions
                            }
                        },
                        message: 'Invalid permissions for the specified role.',
                    },
                    {
                        validator: function (permissions) {
                            return new Set(permissions).size === permissions.length;
                        },
                        message: 'Duplicate permissions are not allowed.',
                    },
                ],
            },
        }
    ]
});

AccountSchema.plugin(passportLocalMongoose);

AccountSchema.methods.doesCodeExist = function () {
    return Boolean(this.verification?.code);
};

AccountSchema.methods.isCodeExpired = function () {
    return Boolean(this.verification?.expiresAt && this.verification.expiresAt < Date.now());
};

AccountSchema.methods.isVerified = function () {
    return Boolean(this.verification?.verified);
};

AccountSchema.virtual('isAdmin').get(function () {
    const found = this.hasPermission.some(permission => permission.role === 'Admin');
    return found;
});

AccountSchema.virtual('isDentist').get(function () {
    const found = this.hasPermission.some(permission => permission.role === 'Dentist');
    return found;
});

AccountSchema.virtual('isPatient').get(function () {
    const found = this.hasPermission.some(permission => permission.role === 'Patient');
    return found;
});


AccountSchema.virtual('getDirectory').get(function () {
    if (this.isAdmin) {
        return 'admin';
    } else if (this.isDentist) {
        return 'dentist';
    } else if (this.isPatient) {
        return 'patient';
    }
    return 'guest';
});

AccountSchema.virtual('isAssociated').get(function () {
    if (!this.linkageData) {
        return false;
    }
    return true;
});

AccountSchema.methods.findRole = function (role) {
    const found = this.hasPermission.some(permission => permission.role === role);
    return found;
};

AccountSchema.virtual('assignRoleToUser').set(function (rol) {
    if (!this.hasPermission.some(permission => permission.role === rol)) {
        this.hasPermission.push({
            role: rol,
            permissions: []
        });
    }
});

//Revoking all role and its permissions
AccountSchema.methods.revokeAllPermissions = function () {
    for (let i = 0; i < this.hasPermission.length; i++) {
        const role = this.hasPermission[i];
        if (rolePermissions.hasOwnProperty(role.role)) {
            const permissionsToRemove = rolePermissions[role.role];
            role.permissions = role.permissions.filter(permission => !permissionsToRemove.includes(permission));
        }
    }
};
//Revoking role and its permissions
AccountSchema.methods.revokePermissions = function (role) {
    const roleIndex = this.hasPermission.findIndex(permission => permission.role === role);
    if (roleIndex !== -1) {
        const permissionsToRemove = rolePermissions[role];
        this.hasPermission[roleIndex].permissions = this.hasPermission[roleIndex].permissions.filter(permission =>
            !permissionsToRemove.includes(permission)
        );
    }
};
///Granting permission or defining 
AccountSchema.methods.definePermissions = function () {
    for (const role of this.hasPermission) {
        if (rolePermissions.hasOwnProperty(role.role)) {
            const permissionsToAdd = rolePermissions[role.role];
            for (const permission of permissionsToAdd) {
                if (!role.permissions.includes(permission)) {
                    role.permissions.push(permission);
                }
            }
        }
    }
};

AccountSchema.methods.removeRole = function (role) {
    const roleIndex = this.hasPermission.findIndex(permission => permission.role === role);
    if (roleIndex !== -1) {
        this.revokePermissions(role);
        this.hasPermission.splice(roleIndex, 1);

    }
    return Promise.resolve(this);
};

AccountSchema.pre('save', async function () {
    if (!this.hasPermission.length) {
        this.assignRoleToUser = "Guest"
    }
    this.definePermissions()
})


AccountSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await cloudinary.deleteFile(doc.image.public_id)
        await Chat.deleteMany({
            _id: {
                $in: doc.appointments
            }
        })
    }
})

module.exports = mongoose.model('User', AccountSchema);