import { userAccountPublicSchema } from "../userAccountPublicSchema";
import { accountStatus } from "../../enum/accountStatus";
import { savedCard } from "../savedCard";

export interface postLoginResult {
    error: string;

    uuid: string;
    email: string;

    currentAccountStatus: accountStatus;
    savedCards: savedCard[];

    public: userAccountPublicSchema;
}