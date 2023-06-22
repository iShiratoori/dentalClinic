const rolePermissions = {
    'Admin': ['read', 'write', 'update', 'delete'],
    'Dentist': ['read', 'update'],
    // Define permissions for other roles as needed
};
roleSchema.static.revokePermissions = function () {
    for (const role of this.hasPermission) {
        if (rolePermissions.hasOwnProperty(role.role)) {
            const permissionsToRemove = rolePermissions[role.role];
            role.permissions = role.permissions.filter(permission => !permissionsToRemove.includes(permission));
        }
    }
};
AccountSchema.methods.definePermissions = function () {
    for (const role of this.hasPermission) {
        if (rolePermissions.hasOwnProperty(role.role)) {
            const permissionsToAdd = rolePermissions[role.role];
            role.permissions.push(...permissionsToAdd);
        }
    }
};
