import { cardSchema } from "../cardSchema";

export interface postGetSavedCardsResult {
    error: string;
    savedCards: cardSchema[];
}