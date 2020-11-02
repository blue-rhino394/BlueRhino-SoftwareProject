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

    // Get an iterator of all cached users
    public getUsers(): IterableIterator<user> {
        return this.userCacheManager.getAllValues();
    }

    // Add the specified user to the cache.
    public addUser(userToAdd: user): void {
        this.userCacheManager.setValue(userToAdd.getUUID(), userToAdd);
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

    // Get an iterator of all cached cards
    public getCards(): IterableIterator<card> {
        return this.cardCacheManager.getAllValues();
    }

    // Add the specified card to the cache.
    public addCard(cardToAdd: card): void {
        this.cardCacheManager.setValue(cardToAdd.getID(), cardToAdd);
    }

    // Removes the specified card from the cache.
    public removeCard(cardID: string): boolean {
        return this.cardCacheManager.removeValue(cardID);
    }
}