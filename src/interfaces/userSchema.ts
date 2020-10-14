import { userAccountSchema } from "./userAccountSchema";
import { savedCard } from "./savedCard";
import { accountStatus } from "../enum/accountStatus";

export interface userSchema {
    uuid: string;
    userAccount: userAccountSchema;

    currentAccountStatus: accountStatus;
    verificationCode: string;

    cardID: string;
    savedCards: savedCard[];
}