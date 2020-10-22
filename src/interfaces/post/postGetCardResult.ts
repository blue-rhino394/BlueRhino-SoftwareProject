import { cardSchema } from "../cardSchema";
import { userAccountPublicSchema } from "../userAccountPublicSchema";

export interface postGetCardResult {
    error: string;
    card: cardSchema;
    user: userAccountPublicSchema;
}