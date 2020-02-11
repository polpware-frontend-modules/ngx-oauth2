export declare class User {
    constructor(id?: string, userName?: string, fullName?: string, email?: string, jobTitle?: string, phoneNumber?: string, roles?: string[]);
    readonly friendlyName: string;
    id: string;
    userName: string;
    fullName: string;
    email: string;
    jobTitle: string;
    phoneNumber: string;
    isEnabled: boolean;
    isLockedOut: boolean;
    roles: string[];
}
