import { user } from "./user";
import { card } from "./card";
import { cacheManager } from "./cacheManager";


export class databaseCacheManager {

    private userCacheManager: cacheManager<string, user>;
    private cardCacheManager: cacheManager<string, card>;


    //
    //  Constructor and Initialization
    //

    constructor() {
        // Create Cache Managers
        this.userCacheManager = new cacheManager<string, user>();
        this.cardCacheManager = new cacheManager<string, card>();
    }






    //
    //  User Methods
    //

    // Check within cache to see if the specified user exists in it already
    public userExists(uuid: string): boolean {
        return this.userCacheManager.keyExists(uuid);
    }

    // Get the specified user from the cache.
    public getUser(uuid: string): user {
        return this.userCacheManager.getValue(uuid);
    }

    // Add the specified user to the cache.
    public addUser(userToAdd: user): boolean {
        return this.userCacheManager.addValue(userToAdd.getUUID(), userToAdd);
    }

    // Removes the specified user from the cache.
    public removeUser(uuid: string): boolean {
        return this.userCacheManager.removeValue(uuid);
    }






    //
    //  Card Methods
    //

    // Check within cache to see if the specified card exists in it already
    public cardExists(cardID: string): boolean {
        return this.cardCacheManager.keyExists(cardID);
    }

    // Get the specified card from the cache.
    // If the card does not exist in the cache, return null
    public getCard(cardID: string): card {
        return this.cardCacheManager.getValue(cardID);
    }

    // Add the specified card to the cache.
    public addCard(cardToAdd: card): boolean {
        return this.cardCacheManager.addValue(cardToAdd.getID(), cardToAdd);
    }

    // Removes the specified card from the cache.
    public removeCard(cardID: string): boolean {
        return this.cardCacheManager.removeValue(cardID);
    }
}