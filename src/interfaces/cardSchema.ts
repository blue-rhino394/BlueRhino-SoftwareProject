import { cardContent } from "./cardContent";
import { cardStats } from "./cardStats";

export interface cardSchema {
    cardID: string;
    ownerID: string;

    content: cardContent;
    stats?: cardStats;
}