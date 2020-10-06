import { cardLayout } from "./cardLayout";

export interface cardContent {
    published: boolean;
    tags: string[];
    socialMediaLinks: string[];
    cardProperties: Map<string, string>;
    layout: cardLayout;
}