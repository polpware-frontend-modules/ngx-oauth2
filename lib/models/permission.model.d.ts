export declare type PermissionNames = 'View Users' | 'Manage Users' | 'View Roles' | 'Manage Roles' | 'Assign Roles';
export declare type PermissionValues = 'users.view' | 'users.manage' | 'roles.view' | 'roles.manage' | 'roles.assign';
export declare class Permission {
    static readonly viewUsersPermission: PermissionValues;
    static readonly manageUsersPermission: PermissionValues;
    static readonly viewRolesPermission: PermissionValues;
    static readonly manageRolesPermission: PermissionValues;
    static readonly assignRolesPermission: PermissionValues;
    constructor(name?: PermissionNames, value?: PermissionValues, groupName?: string, description?: string);
    name: PermissionNames;
    value: PermissionValues;
    groupName: string;
    description: string;
}
