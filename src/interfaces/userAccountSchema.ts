import { userAccountPublicSchema } from "./userAccountPublicSchema";

export interface userAccountSchema {
    email: string;
    passwordHash: string;

    public: userAccountPublicSchema;
}