import { userAccountPublicSchema } from "./userAccountPublicSchema";

export interface registerUserAccountSchema {
    email: string;
    password: string;

    public: userAccountPublicSchema;
}