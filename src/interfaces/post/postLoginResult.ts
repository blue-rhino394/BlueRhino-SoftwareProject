import { userAccountPublicSchema } from "../userAccountPublicSchema";

export interface postLoginResult {
    error: string;

    uuid: string;
    email: string;

    public: userAccountPublicSchema;
}