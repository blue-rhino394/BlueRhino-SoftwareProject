import { cardContent } from "./cardContent";
import { cardStats } from "./cardStats";
import { userAccountPublicSchema } from "./userAccountPublicSchema";

export interface cardSchema {
    cardID: string;
    ownerID: string;
    ownerInfo: userAccountPublicSchema;


    content: cardContent;
    stats?: cardStats;
}