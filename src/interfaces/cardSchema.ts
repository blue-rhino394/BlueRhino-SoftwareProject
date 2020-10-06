import { cardContent } from "./cardContent";
import { cardStats } from "./cardStats";

export interface cardSchema {
    cardID: string;
    ownerID: string;

    firstName: string;
    lastName: string;

    content: cardContent;

    stats?: cardStats;
}