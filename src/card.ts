import { cardSchema } from "./interfaces/cardSchema";
import { cardContent, cardPropertyArrayToMap, cardPropertyMapToArray } from "./interfaces/cardContent";
import { databaseWrapper } from "./databaseWrapper";
import { cardLayout } from "./interfaces/cardLayout";
import { cardStats, socialArrayToMap, socialMapToArray } from "./interfaces/cardStats";



enum statType {
    cardViews,
    saves,
    favorites,
    memos
}

export class card {

    // Card Schema
    private cardID: string;
    private ownerID: string;
    private slug: string;
    private firstName: string;
    private lastName: string;

    // Card Content
    private contentPublished: boolean;
    private contentTags: string[];
    private contentSocialMediaLinks: string[];
    private contentCardProperties: Map<string, string>;

    // Card Layout
    private layoutBackground: string;
    private layoutFontColor: string;

    // Card Stats
    private statMap: Map<statType, string[]>;
    private statsSocial: Map<string, string[]>;




    //
    //  Construction / Initialization
    //

    // Takes in a cardSchema representing this card and setup this card class
    constructor(newCardSchema: cardSchema) {
        this.initializeInternalCardSchema(newCardSchema);
    }

    // Populate internal variables related to cardSchema
    private initializeInternalCardSchema(newCardSchema: cardSchema) {
        this.cardID = newCardSchema.cardID;
        this.ownerID = newCardSchema.ownerID;
        this.firstName = newCardSchema.firstName;
        this.lastName = newCardSchema.lastName;

        this.initializeInternalCardContent(newCardSchema.content);
        this.initializeInternalCardStats(newCardSchema.stats);
    }

    // Populate internal variables related to cardContent
    private initializeInternalCardContent(newCardContent: cardContent) {
        this.contentTags = newCardContent.tags;
        this.contentSocialMediaLinks = newCardContent.socialMediaLinks;
        this.contentCardProperties = cardPropertyArrayToMap(newCardContent.cardProperties);

        this.initializeInternalCardLayout(newCardContent.layout);
    }

    // Populate internal variables related to cardLayout
    private initializeInternalCardLayout(newCardLayout: cardLayout) {
        this.layoutBackground = newCardLayout.background;
        this.layoutFontColor = newCardLayout.fontColor;
    }

    // Populate internal variables related to cardStats
    private initializeInternalCardStats(newCardStats: cardStats) {
        this.statMap = new Map<statType, string[]>();
        this.statMap.set(statType.cardViews, newCardStats.cardViews);
        this.statMap.set(statType.saves, newCardStats.saves);
        this.statMap.set(statType.favorites, newCardStats.favorites);
        this.statMap.set(statType.memos, newCardStats.memos);
        this.statsSocial = socialArrayToMap(newCardStats.social);
    }






    //
    //  Getters
    //

    // Returns the ID of this card
    public getID(): string {
        return this.cardID;
    }

    // Returns the UUID of the owner of this card
    public getOwnerUUID(): string {
        return this.ownerID;
    }

    // Generate and return a cardSchema representing this card
    public getCardSchema(): cardSchema {
        const output: cardSchema = {
            cardID: this.cardID,
            ownerID: this.ownerID,
            slug: this.slug,
            firstName: this.firstName,
            lastName: this.lastName,

            content: this.getCardContent(),
            stats: this.getCardStats()
        }

        return output;
    }

    // Generate and return the content found within this card
    public getCardContent(): cardContent {
        const output: cardContent = {
            published: this.contentPublished,
            tags: this.contentTags,
            socialMediaLinks: this.contentSocialMediaLinks,
            cardProperties: cardPropertyMapToArray(this.contentCardProperties),

            layout: this.getCardLayout()
        }

        return output;
    }

    // Generate and return the layout for this card
    public getCardLayout(): cardLayout {
        const output: cardLayout = {
            background: this.layoutBackground,
            fontColor: this.layoutFontColor
        }

        return output;
    }

    // Generate and return the stats about this card
    public getCardStats(): cardStats {
        const output: cardStats = {
            cardViews: this.statMap.get(statType.cardViews),
            saves: this.statMap.get(statType.saves),
            favorites: this.statMap.get(statType.favorites),
            memos: this.statMap.get(statType.memos),
            social: socialMapToArray(this.statsSocial)
        }

        return output;
    }


    //
    //  Setters
    //

    // Updates the content of this card using the parameters defined in contentUpdate
    public async setCardContent(contentUpdate: cardContent): Promise<void> {

        // Update the card in memory
        this.updateInternalCardContent(contentUpdate);

        // Update the card in the database
        await databaseWrapper.runMongoOperation(async (database) => {

            // Get card collection from database
            var cardCollection = await database.collection("cards");

            // Create a filter indicating that we want THIS card
            const filter = { cardID: this.getID() }

            // Create options explicitly saying that we do NOT want to upsert (create new data if it doesn't exist)
            const options = { upsert: false }

            // Create the update data, saying that we want to set content to the var contentUpdate
            const updateData = {
                $set: {
                    content: this.createJsonContentUpdateData(contentUpdate)
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
        var statArray: string[] = this.statMap.get(type);

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
        var statArray: string[] = this.statMap.get(type);

        // If this uuid has NOT already been logged...
        if (!(uuidToRemove in statArray)) {
            // BOUNCE!
            return;
        }

        // Otherwise...

        // Remove from the stat array in memory
        this.statMap.set(type, statArray.filter(function (value, index, arr) { return value != uuidToRemove }));

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












    //
    //  Utility Methods
    //


    //
    //  Internal Update Methods
    //

    // Update the internal card content variables using a provided cardContent interface.
    // If properties of the interface are explicitly null, they will be ignored!
    private updateInternalCardContent(updateContent: cardContent): void {

        if (updateContent.published != null) {
            this.contentPublished = updateContent.published;
        }

        if (updateContent.tags != null) {
            this.contentTags = updateContent.tags;
        }

        if (updateContent.socialMediaLinks != null) {
            this.contentSocialMediaLinks = updateContent.socialMediaLinks;
        }

        if (updateContent.cardProperties != null) {
            this.contentCardProperties = cardPropertyArrayToMap(updateContent.cardProperties);
        }

        if (updateContent.layout != null) {
            this.updateInternalCardLayout(updateContent.layout);
        }
    }

    // Update the internal card layout variables using a provided cardLayout interface.
    // If properties of the interface are explicitly null, they will be ignored!
    private updateInternalCardLayout(updateLayout: cardLayout): void {
        if (updateLayout.background != null) {
            this.layoutBackground = updateLayout.background;
        }

        if (updateLayout.fontColor != null) {
            this.layoutFontColor = updateLayout.fontColor;
        }
    }



    //
    //  Create Anonymous JSON Methods
    //

    // Takes in a cardContent interface and converts it to a typeless JSON object.
    // If properties of the interface are explicitly null, they will be ignored!
    private createJsonContentUpdateData(contentUpdate: cardContent): any {
        var output: Record<string, any> = {};

        if (contentUpdate.published != null) {
            output.published = contentUpdate.published;
        }

        if (contentUpdate.tags != null) {
            output.tags = contentUpdate.tags;
        }

        if (contentUpdate.socialMediaLinks != null) {
            output.socialMediaLinks = contentUpdate.socialMediaLinks;
        }

        if (contentUpdate.cardProperties != null) {
            output.cardProperties = contentUpdate.cardProperties;
        }

        if (contentUpdate.layout != null) {
            output.layout = this.createJsonLayoutUpdateData(contentUpdate.layout);
        }


        return output;
    }

    // Takes in a cardContent interface and converts it to a typeless JSON object.
    // If properties of the interface are explicitly null, they will be ignored!
    private createJsonLayoutUpdateData(layoutUpdate: cardLayout): any {
        var output: Record<string, any> = {};

        if (layoutUpdate.background != null) {
            output.background = layoutUpdate.background;
        }

        if (layoutUpdate.fontColor != null) {
            output.fontColor = layoutUpdate.fontColor;
        }

        return output;
    }
}