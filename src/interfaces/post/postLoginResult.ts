import { userAccountPublicSchema } from "../userAccountPublicSchema";
import { accountStatus } from "../../enum/accountStatus";

export interface postLoginResult {
    error: string;

    uuid: string;
    email: string;

    currentAccountStatus: accountStatus;
    public: userAccountPublicSchema;
}