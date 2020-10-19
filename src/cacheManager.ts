import { clearTimeout } from "timers";


export class cacheManager<K, V> {

    // Settings

    // The max amount of time an object can exist within the cache
    // without updates before it gets removed.
    private cacheDecayTime: number = 5 * 1000;



    // Data Structures

    private dataCollection: Map<K, V>;
    private timerCollection: Map<K, NodeJS.Timeout>;



    //
    //  Constructor and Initialization
    //

    constructor() {
        this.dataCollection = new Map<K, V>();
        this.timerCollection = new Map<K, NodeJS.Timeout>();
    }




    //
    //  Public Methods
    //

    // Check within cache to see if the specified key exists in it already
    public keyExists(key: K): boolean {
        return this.dataCollection.has(key);
    }

    // Get the specified value from the cache using a key.
    // If the key does not exist in the cache, return null
    public getValue(key: K): V {

        // If this key does not exist in the cache, bail out.
        if (!this.keyExists(key)) {
            return null;
        }

        // Otherwise...
        // Update or create a decay timer using this key..
        this.startDecayTimer(key);

        // .. and return the value!
        return this.dataCollection.get(key);
    }

    // Returns an iterator of all the values on cache
    public getAllValues(): IterableIterator<V> {
        return this.dataCollection.values();
    }

    // Set the specified value to the cache.
    // If a value by this ID already exists in the cache, overwrite it
    public setValue(keyToUse: K, valueToAdd: V): void {

        // Set the value in the cache...
        this.dataCollection.set(keyToUse, valueToAdd);

        // ... And start a decay timer using this key!
        this.startDecayTimer(keyToUse);
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
        // Remove the value from the cache...
        this.dataCollection.delete(key);
        // And stop and remove the decay timer relating to it!
        this.stopAndRemoveTimer(key);
        return true;
    }






    //
    //  Timer Methods
    //

    // Start or reset an existing timer using a key
    private startDecayTimer(key: K): void {

        // Stop and remove any existing timers using this key
        this.stopAndRemoveTimer(key);

        // Create a new timer
        const timer = setTimeout(() => {

            // After decaying, call finishDecayTimer
            this.finishDecayTimer(key);
        }, this.cacheDecayTime);
    }

    // Stop and remove any timers using this key
    private stopAndRemoveTimer(key: K): void {

        // If a timer with this key already exists...
        if (this.timerCollection.has(key)) {
            // Force stop that timer
            clearTimeout(this.timerCollection.get(key));

            // Remove that timer
            this.timerCollection.delete(key);
        }
    }

    // Called when a timer has finished execution completley.
    // Removes key from cache
    private finishDecayTimer(key: K): void {

        this.dataCollection.delete(key);
        this.stopAndRemoveTimer(key);
    }
}