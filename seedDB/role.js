
const mongoose = require('mongoose')
const dbUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dentalClinic';
mongoose.connect(dbUrl);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const roleSchema = mongoose.Schema({
    hasPermission: [
        {
            role: {
                type: String,
                required: true,
                enum: ['Admin', 'Dentist', 'Guest'],
                default: 'Guest'
            },
            permissions: {
                type: [
                    {
                        type: String,
                        required: true,
                        enum: ['read', 'write', 'update', 'delete'],
                    },
                ],
                validate: [
                    {
                        validator: function (permissions) {
                            if (this.role === 'Admin') {
                                return permissions.includes('read') && permissions.includes('write') && permissions.includes('delete');
                            } else if (this.role === 'Dentist') {
                                return permissions.includes('read') && permissions.includes('write');
                            } else {
                                return !permissions.includes('create') && !permissions.includes('write') && !permissions.includes('delete');
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
    ],
})


const model = mongoose.model('Role', roleSchema)


const rolePermissions = {
    Admin: ['read', 'create', 'update', 'delete'],
    Dentist: ['read', 'create', 'update'],
    Patient: ['read', 'update'],
    Guest: ['read']
};


const create = async () => {
    const role = model({
    })
    for (let rol of role.hasPermission) {
        if (rolePermissions.hasOwnProperty(rol.role)) {
            const permissionsToAdd = rolePermissions[rol.role];
            rol.permissions.push(...permissionsToAdd);
        }
    }
    for (let r of role.hasPermission) {
        console.log(r.role)
        console.log(r.permissions)
    }
    await role.save()
}

create()