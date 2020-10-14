export interface userAccountSchema {
    email: string;
    passwordHash: string;

    firstName: string;
    lastName: string;

    customURL: string;
    profilePictureURL: string;
}