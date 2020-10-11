import { cardSchema } from "./interfaces/cardSchema";
import { cardContent } from "./interfaces/cardContent";
import { databaseWrapper } from "./databaseWrapper";


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

    }

    // VIEWS - Removes a uuid from the views stat on this card
    public removeStatView(uuidToRemove: string): void {

    }


    // SAVES - Adds a uuid to the saves stat on this card
    public addStatSave(uuidToAdd: string): void {

    }

    // SAVES - Removes a uuid from the saves stat on this card
    public removeStatSave(uuidToRemove: string): void {

    }


    // FAVORITES - Adds a uuid to the favorites stat on this card
    public addStatFavorite(uuidToAdd: string): void {

    }

    // FAVORITES - Removes a uuid from the favorites stat on this card
    public removeStatFavorite(uuidToRemove: string): void {

    }


    // MEMOS - Adds a uuid to the memos stat on this card
    public addStatMemo(uuidToAdd: string): void {

    }

    // MEMOS - Removes a uuid from the memos stat on this card
    public removeStatMemo(uuidToRemove: string): void {

    }
}