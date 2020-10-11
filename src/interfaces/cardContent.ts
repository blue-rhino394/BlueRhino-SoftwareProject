import { cardLayout } from "./cardLayout";
import { cardPropertyElement } from "./cardPropertyElement";

export interface cardContent {
    published: boolean;
    tags: string[];
    socialMediaLinks: string[];
    cardProperties: cardPropertyElement[];
    layout: cardLayout;
}



// Takes a map representing a card property map for cardContent and converts it to an array of cardPropertyElements.
//
// (This is a workaround to store map data in a format that mongoDB will accept!)
export function cardPropertyMapToArray(map: Map<string, string>): cardPropertyElement[] {
    var output: cardPropertyElement[] = [];

    // Loop through each element of the map and...
    for (const mapEntry of map) {
        // Push elements from mapEntry into
        // a properly formatted output array
        output.push({
            key: mapEntry[0],
            value: mapEntry[1]
        });
    }

    return output;
}

// Takes an array of cardPropertyElements and converts it into a Map representing the card properties map for cardContent.
//
// (This is a workaround to get and work with map data from the way that mongoDB will store it)
export function cardPropertyArrayToMap(arr: cardPropertyElement[]): Map<string, string> {
    var output: Map<string, string>= new Map<string, string>();

    // Loop through each element of the array and...
    for (const element of arr) {
        // Insert it into the map!
        output.set(element.key, element.value);
    }

    return output;
}