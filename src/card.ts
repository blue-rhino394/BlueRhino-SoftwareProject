import { cardSchema } from "./interfaces/cardSchema";
import { cardContent } from "./interfaces/cardContent";
import { databaseWrapper } from "./databaseWrapper";



enum statType {
    cardViews,
    saves,
    favorites,
    memos
}

export class card {

    private schema: cardSchema;



    //
    //  Construction / Initialization
    //

    // Takes in a cardSchema representing this card
    constructor(thisCardSchema: cardSchema) {
        this.schema = thisCardSchema;
    }




    //
    //  Getters
    //

    // Returns the ID of this card
    public getID(): string {
        return this.schema.cardID;
    }

    // Returns the UUID of the owner of this card
    public getOwnerUUID(): string {
        return this.schema.ownerID;
    }

    // Returns the cardSchema representing this card
    public getCardSchema(): cardSchema {
        return this.schema;
    }

    // Returns the content found within this card
    public getCardContent(): cardContent {
        return this.schema.content;
    }


    //
    //  Setters
    //

    // Updates the content of this card using the parameters defined in contentUpdate
    public setCardContent(contentUpdate: cardContent): void {

        // Update the card in memory
        this.schema.content = contentUpdate;

        // Update the card in the database
        databaseWrapper.runMongoOperation(async (database) => {

            // Get card collection from database
            var cardCollection = await database.collection("cards");

            // Create a filter indicating that we want THIS card
            const filter = { cardID: this.getID() }

            // Create options explicitly saying that we do NOT want to upsert (create new data if it doesn't exist)
            const options = { upsert: false }

            // Create the update data, saying that we want to set content to the var contentUpdate
            const updateData = {
                $set: {
                    content: contentUpdate
                }
            };

            // Apply update operation!
            const updateResult = await cardCollection.updateOne(filter, updateData, options);


            // If we wanted to check if it actually updated something at this point,
            // we would check to see if updateResult.modifiedCount is greater than zero!
        });
    }





    //
    //  Stats
    //

    // VIEWS - Adds a uuid to the views stat on this card
    public addStatView(uuidToAdd: string): void {
        this.addStat(statType.cardViews, uuidToAdd);
    }

    // VIEWS - Removes a uuid from the views stat on this card
    public removeStatView(uuidToRemove: string): void {
        this.removeStat(statType.cardViews, uuidToRemove);
    }


    // SAVES - Adds a uuid to the saves stat on this card
    public addStatSave(uuidToAdd: string): void {
        this.addStat(statType.saves, uuidToAdd);
    }

    // SAVES - Removes a uuid from the saves stat on this card
    public removeStatSave(uuidToRemove: string): void {
        this.removeStat(statType.saves, uuidToRemove);
    }


    // FAVORITES - Adds a uuid to the favorites stat on this card
    public addStatFavorite(uuidToAdd: string): void {
        this.addStat(statType.favorites, uuidToAdd);
    }

    // FAVORITES - Removes a uuid from the favorites stat on this card
    public removeStatFavorite(uuidToRemove: string): void {
        this.removeStat(statType.favorites, uuidToRemove);
    }


    // MEMOS - Adds a uuid to the memos stat on this card
    public addStatMemo(uuidToAdd: string): void {
        this.addStat(statType.memos, uuidToAdd);
    }

    // MEMOS - Removes a uuid from the memos stat on this card
    public removeStatMemo(uuidToRemove: string): void {
        this.removeStat(statType.memos, uuidToRemove);
    }



    // HELPER METHOD - Adds a uuid to a specified stat on this card
    private addStat(type: statType, uuidToAdd: string): void {

        // Get the correct stat property from this card schema.stats
        var statArray: string[] = this.schema.stats[type.toString()];

        // If this uuid has already been logged...
        if (uuidToAdd in statArray) {
            // BOUNCE!
            return;
        }

        // Otherwise...

        // Add to the stat array in memory
        statArray.push(uuidToAdd);

        // Add to the stat array in the database
        databaseWrapper.runMongoOperation(async (database) => {

            // Get card collection from database
            var cardCollection = await database.collection("cards");

            // Create a filter indicating that we want THIS card
            const filter = { cardID: this.getID() }

            // Create options explicitly saying that we do NOT want to upsert (create new data if it doesn't exist)
            const options = { upsert: false }

            // Create the update data, saying that we want to push the new UUID to the desired stats property
            const updateData = {
                $push: this.getStatUpdateData(type, uuidToAdd)
            };

            // Apply push operation!
            const pushResult = await cardCollection.updateOne(filter, updateData, options);


            // If we wanted to check if it actually updated something at this point,
            // we would check to see if pushResult.modifiedCount is greater than zero!
        });
    }

    // HELPER METHOD - Removes a uuid from a specified stat on this card
    private removeStat(type: statType, uuidToRemove: string): void {

        // Get the correct stat property from this card schema.stats
        var statArray: string[] = this.schema.stats[type.toString()];

        // If this uuid has NOT already been logged...
        if (!(uuidToRemove in statArray)) {
            // BOUNCE!
            return;
        }

        // Otherwise...

        // Remove from the stat array in memory
        this.schema.stats[type.toString()] = statArray.filter(function (value, index, arr) { return value != uuidToRemove});

        // Remove from the stat array in the database
        databaseWrapper.runMongoOperation(async (database) => {

            // Get card collection from database
            var cardCollection = await database.collection("cards");

            // Create a filter indicating that we want THIS card
            const filter = { cardID: this.getID() }

            // Create options explicitly saying that we do NOT want to upsert (create new data if it doesn't exist)
            const options = { upsert: false }

            // Create the update data, saying that we want to pull the UUID from the desired stats property
            const updateData = {
                $pull: this.getStatUpdateData(type, uuidToRemove)
            };

            // Apply pull operation!
            const pullResult = await cardCollection.updateOne(filter, updateData, options);


            // If we wanted to check if it actually updated something at this point,
            // we would check to see if pushResult.modifiedCount is greater than zero!
        });
    }

    // HELPER METHOD - create update data to be used in a mongoDB operation
    // involving cardStats 
    private getStatUpdateData(type: statType, uuid: string): any {

        switch (type) {
            case statType.cardViews:
                return {
                    "content.stats.cardViews": uuid
                }

            case statType.saves:
                return {
                    "content.stats.saves": uuid
                }

            case statType.favorites:
                return {
                    "content.stats.favorites": uuid
                }

            case statType.memos:
                return {
                    "content.stats.memos": uuid
                }

            default:
                console.error("Error - this should never get called! (did you update stat-type and forget to update a switch?)");
                return undefined;
        }
    }

}