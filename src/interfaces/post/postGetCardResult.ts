import { cardSchema } from "../cardSchema";

export interface postGetCardResult {
    error: string;
    card: cardSchema;
}