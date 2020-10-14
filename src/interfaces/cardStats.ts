import { socialMapElement } from "./socialMapElement";

export interface cardStats {
    cardViews: string[];
    saves: string[];
    favorites: string[];
    memos: string[];
    social: socialMapElement[];
}

// Takes a map representing a social map for cardStats and converts it to an array of socialMapElements.
//
// (This is a workaround to store map data in a format that mongoDB will accept!)
export function socialMapToArray(map: Map<string, string[]>): socialMapElement[] {
    var output: socialMapElement[] = [];

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

// Takes an array of socialMapElements and converts it into a Map representing the social map for cardStats.
//
// (This is a workaround to get and work with map data from the way that mongoDB will store it)
export function socialArrayToMap(arr: socialMapElement[]): Map<string, string[]> {
    var output: Map<string, string[]> = new Map<string, string[]>();

    // Loop through each element of the array and...
    for (const element of arr) {
        // Insert it into the map!
        output.set(element.key, element.value);
    }

    return output;
}