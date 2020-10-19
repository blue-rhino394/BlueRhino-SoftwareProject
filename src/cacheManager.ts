

export class cacheManager<K, V> {

    private collection: Map<K, V>;

    //
    //  Constructor and Initialization
    //

    constructor() {
        this.collection = new Map<K, V>();
    }






    // Check within cache to see if the specified key exists in it already
    public keyExists(key: K): boolean {
        return this.collection.has(key);
    }

    // Get the specified value from the cache using a key.
    // If the key does not exist in the cache, return null
    public getValue(key: K): V {

        // If this key does not exist in the cache, bail out.
        if (!this.keyExists(key)) {
            return null;
        }

        // Otherwise
        // Return the value!

        // TODO - setup update timeout function

        return this.collection.get(key);
    }

    // Add the specified value to the cache.
    // If a user by this ID already exists in the cache, return false.
    // Otherwise, return true.
    public addValue(keyToUse: K, valueToAdd: V): boolean {

        // If this key is already in the cache, bail out
        if (this.keyExists(keyToUse)) {
            return false;
        }

        // Otherwise...
        // Add the value to the cache
        this.collection.set(keyToUse, valueToAdd);

        // TODO - set up start timeout function

        return true;
    }

    // Removes the specified value from the cache using a key.
    // If there's not a value by that key in the manager, return false.
    // Otherwise, return true.
    public removeValue(key: K): boolean {

        // If this key is not in the cache, bail out
        if (!this.keyExists(key)) {
            return false;
        }

        // Otherwise...
        // Remove the value from the cache
        this.collection.delete(key);

        // TODO - setup stop timeout function if timeout exists
        return true;
    }
}