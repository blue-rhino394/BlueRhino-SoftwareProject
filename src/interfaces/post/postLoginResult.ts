export interface postLoginResult {
    error: string;

    uuid: string;
    email: string;
    firstName: string;
    lastName: string;

    customURL: string;
    profilePictureURL: string;
}