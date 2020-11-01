import { userAccountSchema } from "./interfaces/userAccountSchema";
import { userSchema } from "./interfaces/userSchema";
import { MongoClient, Db } from "mongodb";
import { accountStatus } from "./enum/accountStatus";
import { v4 } from "uuid";
import { cardContent } from "./interfaces/cardContent";
import { cardSchema } from "./interfaces/cardSchema";
import { PassThrough } from "stream";
import { cardStats } from "./interfaces/cardStats";
import { searchQuery } from "./interfaces/searchQuery";
import { user } from "./user";
import { card } from "./card";
import { databaseCacheManager } from "./databaseCacheManager";
import { savedCard } from "./interfaces/savedCard";
import { reservedRoutes } from "./reservedRoutes";


class databaseWrapperClass {

    // Settings

    // The number of pages per each search
    private pageCount: number = 10;


    // Data Structures

    // The cache holding memory user and card objects
    private cache: databaseCacheManager;


    // Mongo Variables

    // The driver for connecting to mongoDB
    private mongoClient: MongoClient;




    //
    //  Constructor and Initialization
    //

    public constructor() {
        console.log("Constructing Database Wrapper...");
        this.cache = new databaseCacheManager();
    }

    private async initialize(): Promise<void> {
        await this.connectToMongo();
        await this.verifyConnectedToMongoDB();
        console.log("Database Wrapper Initialized!");
    }

    // Connect the database wrapper to mongoDB and cache
    // any necessary variables
    private async connectToMongo(): Promise<void> {

        // If for some reason mongoClient already exists
        //      AND
        // it's connected...
        if (this.mongoClient && this.mongoClient.isConnected()) {
            // Bounce!
            return;
        }


        // Construct mongoDB connection URL
        const connectionString: string = `mongodb+srv://main-access:${"Xpcdu9kTHUaaI03o"}@cluster0.x9cls.mongodb.net/${"passport"}?retryWrites=true&w=majority`;

        // Create mongoDB client for the database
        this.mongoClient = new MongoClient(connectionString, {
            useUnifiedTopology: true
        });

        await this.mongoClient.connect();
    }

    // Checks to see if we can connected to mongoDB by pinging the users database
    public async verifyConnectedToMongoDB(): Promise<boolean> {
        var connectedCorrectly = false;

        await this.runMongoOperation(async function (database) {
            await database.command({ ping: 1 });
            connectedCorrectly = true;
            console.log("Hello mongoDB!");
        });

        return connectedCorrectly;
    }






    //
    //  User Methods
    //

    // Creates a new user in the database
    public async createUser(newAccountSchema: userAccountSchema): Promise<user> {

        var outputUUID: string = "";
        var outputUserSchema: userSchema;

        // Force new email to lowercase
        newAccountSchema.email = newAccountSchema.email.toLowerCase();

        // Run the mongoDB operation
        await this.runMongoOperation(async function(database) {

            // Get user collection from database
            var userCollection = await database.collection("users");

            // Try to get a user with the provided email
            const existingUser = await userCollection.findOne({ "userAccount.email": newAccountSchema.email });

            // If there's already a user that fits this description...
            if (existingUser) {

                // BAIL OUT!
            }
            // If there's NOT already a user that fits this description...
            else {
                // Create a new userSchema
                const newUser: userSchema = {
                    uuid: v4(),                       // Generate a random user ID
                    userAccount: newAccountSchema,      // Insert the new account schema
                    currentAccountStatus: accountStatus.EmailVerification,  // Set the account status to need verification
                    verificationCode: v4(),           // Generate a random verification code
                    cardID: "",                         // cardID should be empty (they haven't made one yet!)
                    savedCards: []                      // saved cards should be empty (they haven't been able to save any yet!)
                }

                outputUserSchema = newUser;

                // Add the new user to the database
                const operationResult = await userCollection.insertOne(newUser);

                // If the user was actually inserted...
                if (operationResult.insertedCount != 0) {
                    outputUUID = newUser.uuid;
                }
            }
        });

        if (!outputUserSchema) {
            return null;
        }

        // Create a user using this schema
        const outputUser: user = new user(outputUserSchema);

        // Add them to the cache manager
        this.cache.addUser(outputUser);

        return outputUser;
    }

    // Deletes a user by ID
    public async deleteUser(uuidToDelete: string): Promise<string> {

        var outputError: string = "Unknown Error";

        // Run the mongoDB operation
        await this.runMongoOperation(async (database) => {

            // Get user collection from database
            var userCollection = await database.collection("users");

            // Run delete operation
            const operationResult = await userCollection.deleteOne({ uuid: uuidToDelete });

            // If a document was deleted
            if (operationResult.deletedCount != 0) {
                // Woo! We did it! No errors.
                outputError = "";

                // Remove from the cache
                this.cache.removeUser(uuidToDelete);
            }
            else {
                outputError = "No user by this UUID";
            }
        });


        return outputError;
    }

    // Finds a user in the database by ID
    public async getUser(userUUID: string): Promise<user> {
        // CHECK THE CACHE FIRST!
        // If this user exists in the cache manager,
        // return them!!
        //
        // (Saves a database call!)
        if (this.cache.userExists(userUUID)) {
            return this.cache.getUser(userUUID);
        }


        // OTHERWISE...
        var outputUserSchema: userSchema;

        // If the Cache Manager doesn't have this user, let's look in the database!
        await this.runMongoOperation(async function (database) {

            // Get user collection from database
            var userCollection = await database.collection("users");

            // Try to get a user with the provided uuid
            const requestedUser = await userCollection.findOne({ uuid: userUUID });

            // if we actually have the requested user in the database...
            if (requestedUser) {

                // Add them to the cache for future use...

                // Store the retrieved data!
                outputUserSchema = requestedUser;
            }
            // Otherwise...
            else {
                // This user does not exist...!
            }
        });

        // If we couldn't get a user...
        if (!outputUserSchema) {
            return null;
        }

        // Create a new user object using the schema in the database
        const outputUser: user = new user(outputUserSchema);

        // Cache this user for future use!
        this.cache.addUser(outputUser);

        // Return the user.
        return outputUser;
    }

    // Finds a user in the database by their slug
    public async getUserBySlug(userSlug: string): Promise<user> {

        // CHECK THE RESERVED ROTUES FIRST
        // If we're trying to find a user using a RESERVED ROUTE,
        // that means that there should IN NO WAY be a user at this slug.
        //
        // If this slug is a reserved route...
        if (reservedRoutes.hasRoute(userSlug)) {
            // BOUNCE!
            return null;
        }



        // CHECK THE CACHE NEXT!
        // Loop through all of the users in the cache (A pain, I know)
        // and if one has the slug we want, return it!
        //
        // (Saves a database call)
        for (const tempUser of this.cache.getUsers()) {
            const userAccount = tempUser.getAccountSchema();

            // If this user's customURL matches the slug we're using...
            if (userAccount.public.customURL == userSlug) {
                // Return them!
                return tempUser;
            }
        }

        // OTHERWISE...
        var outputUserSchema: userSchema;

        // If the Cache Manager doesn't have this user, let's look in the database!
        await this.runMongoOperation(async function (database) {

            // Get user collection from database
            var userCollection = await database.collection("users");

            // Try to get a user with the provided slug
            const requestedUser = await userCollection.findOne({ "userAccount.public.customURL": userSlug });

            // if we actually have the requested user in the database...
            if (requestedUser) {

                // Add them to the cache for future use...

                // Store the retrieved data!
                outputUserSchema = requestedUser;
            }
            // Otherwise...
            else {
                // This user does not exist...!
            }
        });

        // If we couldn't get a user...
        if (!outputUserSchema) {
            return null;
        }

        // Create a new user object using the schema in the database
        const outputUser: user = new user(outputUserSchema);

        // Cache this user for future use!
        this.cache.addUser(outputUser);

        // Return the user.
        return outputUser;
    }

    // Finds a user in the database by their email
    public async getUserByEmail(userEmail: string): Promise<user> {

        userEmail = userEmail.toLowerCase();

        // CHECK THE CACHE FIRST!
        // Loop through all of the users in the cache (A pain, I know)
        // and if one has the email we want, return it!
        //
        // (Saves a database call)
        for (const tempUser of this.cache.getUsers()) {
            const userAccount = tempUser.getAccountSchema();

            // If this user's email matches the email we're using...
            if (userAccount.email == userEmail) {
                // Return them!
                return tempUser;
            }
        }

        // OTHERWISE...
        var outputUserSchema: userSchema;

        // If the Cache Manager doesn't have this user, let's look in the database!
        await this.runMongoOperation(async function (database) {

            // Get user collection from database
            var userCollection = await database.collection("users");

            // Try to get a user with the provided email
            const requestedUser = await userCollection.findOne({ "userAccount.email": userEmail });

            // if we actually have the requested user in the database...
            if (requestedUser) {

                // Add them to the cache for future use...

                // Store the retrieved data!
                outputUserSchema = requestedUser;
            }
            // Otherwise...
            else {
                // This user does not exist...!
            }
        });

        // If we couldn't get a user...
        if (!outputUserSchema) {
            return null;
        }

        // Create a new user object using the schema in the database
        const outputUser: user = new user(outputUserSchema);

        // Cache this user for future use!
        this.cache.addUser(outputUser);

        // Return the user.
        return outputUser;
    }




    //
    //  Card Methods
    //

    // Creates a card in the database
    public async createCard(cardOwnerID: string, newContent: cardContent): Promise<card> {
        var outputCardSchema: cardSchema;

        // Get the owner of this card
        const cardOwner: user = await this.getUser(cardOwnerID);

        // If there's no user with this ID...
        if (!cardOwner) {
            // Bail out!
            return null;
        }

        // If this user ALREADY HAS a card...
        if (cardOwner.getCardID()) {
            // Bail out!
            return null;
        }


        // Run the mongoDB operation
        await this.runMongoOperation(async function (database) {

            // Get card collection from database
            var cardCollection = await database.collection("cards");


            // Create new stats
            const newStats: cardStats = {
                cardViews: [],
                saves: [],
                favorites: [],
                memos: [],
                social: []
            };

            // Create new card schema
            const newCardSchema: cardSchema = {
                cardID: v4(),
                ownerID: cardOwnerID,
                ownerInfo: cardOwner.getAccountSchema().public,

                content: newContent,
                stats: newStats
            }



            // Add the card to the database
            const cardInsertOperationResult = await cardCollection.insertOne(newCardSchema);

            // Update the user's card ID
            cardOwner.setCardID(newCardSchema.cardID);

            // If the card was actually added
            if (cardInsertOperationResult.insertedCount != 0) {
                outputCardSchema = newCardSchema;
            }
        });


        // If we couldn't create a card...
        if (!outputCardSchema) {
            return null;
        }

        // Create a new card object using the schema in the database
        const outputCard: card = new card(outputCardSchema);

        // Cache this card for future use!
        this.cache.addCard(outputCard);

        // Return the user.
        return outputCard;
    }

    // Deletes a card from the database by ID
    public async deleteCard(cardIDToDelete): Promise<string> {
        var outputError: string = "Unknown Error";

        console.log("Running delete card");

        // Run the mongoDB operation
        await this.runMongoOperation(async (database) => {

            // Get card collection from database
            var cardCollection = await database.collection("cards");

            // Run delete operation
            const operationResult = await cardCollection.deleteOne({ cardID: cardIDToDelete });

            // If a document was deleted
            if (operationResult.deletedCount != 0) {
                // Woo! We did it! No errors.
                outputError = "";

                // Delete from cache
                this.cache.removeCard(cardIDToDelete);
            }
            else {
                outputError = "No card by this ID";
            }
        });

        // Remove this card from users' savedCards array
        await this.removeCardFromAllSavedCards(cardIDToDelete);

        return outputError;
    }

    // Removes a card from every user's savedCards list that has this card
    //
    // Returns the UUID's of each user effected
    public async removeCardFromAllSavedCards(cardIDToRemove): Promise<string[]> {

        console.log("Running remove from saved cards");

        // An array of UUID's to be populated with the
        // database query below.
        var usersWithThisCardSaved: string[] = [];


        // Run the mongoDB operation
        await this.runMongoOperation(async (database) => {

            // Get user collection from database
            var userCollection = await database.collection("users");

            // Query defining that we only want
            // to find users that have this
            // cardID in their savedCards array
            const query = {
                "savedCards": {
                    "cardID" : cardIDToRemove
                }
            }

            // Projection defining that we only want to get
            // back the UUID of this user
            const projection = {
                _id: 0,
                uuid: 1,
            }

            const options = {
                projection: projection
            }


            // Run find operation
            const searchCursor = await userCollection.find(query, options);

            // Store users into array
            await searchCursor.forEach((userFound) => {
                usersWithThisCardSaved.push(userFound.uuid);
            });
        });


        // Loop through each user that has this card saved...
        //
        // Future note - this is not parallelized. It probably could be,
        // though you'd need to be careful about race conditions!
        for (const uuid of usersWithThisCardSaved) {

            console.log("Removing saved card from " + uuid);

            // Get the user from the database
            const requestedUser: user = await this.getUser(uuid);

            // If they actually exist...
            if (requestedUser) {

                // Remove the saved card!
                await requestedUser.removeSavedCard(cardIDToRemove);
            }
        }


        return usersWithThisCardSaved;
    }

    // Finds a card in the database by ID
    public async getCard(requestedCardID: string): Promise<card> {
        // CHECK THE CACHE FIRST!
        // If this card exists in the cache manager,
        // return it!!
        //
        // (Saves a database call!)
        if (this.cache.cardExists(requestedCardID)) {
            return this.cache.getCard(requestedCardID);
        }

        // OTHERWISE...
        var outputCardSchema: cardSchema;

        // If the Cache Manager doesn't have this card, let's look in the database!
        await this.runMongoOperation(async function (database) {

            // Get card collection from database
            var cardCollection = await database.collection("cards");

            // Try to get a card with the provided id
            const requestedCard = await cardCollection.findOne({ cardID: requestedCardID });

            // if we actually have the requested user in the database...
            if (requestedCard) {

                // Add it to the cache for future use...

                // Save the data!
                outputCardSchema = requestedCard;
            }
            // Otherwise...
            else {
                // This card does not exist...!
            }
        });

        // If we couldn't get a card...
        if (!outputCardSchema) {
            return null;
        }

        // Create a new card object using the schema in the database
        const outputCard: card = new card(outputCardSchema);

        // Cache this card for future use!
        this.cache.addCard(outputCard);

        // Return the user.
        return outputCard;
    }

    // Finds a card in the database by slug
    public async getCardBySlug(requestedCardSlug: string): Promise<card> {
        // CHECK THE CACHE FIRST!
        // If this card exists in the cache manager,
        // return it!!
        //
        // (Saves a database call!)
        for (const tempCard of this.cache.getCards()) {
            const ownerInfo = tempCard.getCardSchema().ownerInfo;

            // If this user's customURL matches the slug we're using...
            if (ownerInfo.customURL == requestedCardSlug) {
                // Return them!
                return tempCard;
            }
        }

        // OTHERWISE...
        var outputCardSchema: cardSchema;

        // If the Cache Manager doesn't have this card, let's look in the database!
        await this.runMongoOperation(async function (database) {

            // Get card collection from database
            var cardCollection = await database.collection("cards");

            // Try to get a card with the provided slug
            const requestedCard = await cardCollection.findOne({ "ownerInfo.customURL": requestedCardSlug });

            // if we actually have the requested user in the database...
            if (requestedCard) {

                // Add it to the cache for future use...

                // Save the data!
                outputCardSchema = requestedCard;
            }
            // Otherwise...
            else {
                // This card does not exist...!
            }
        });

        // If we couldn't get a card...
        if (!outputCardSchema) {
            return null;
        }

        // Create a new card object using the schema in the database
        const outputCard: card = new card(outputCardSchema);

        // Cache this card for future use!
        this.cache.addCard(outputCard);

        // Return the user.
        return outputCard;
    }




    //
    //  Search Methods
    //

    // Searches for cards in the database using a query
    public async searchQuery(requestedQuery: searchQuery, currentUser?: user): Promise<string[]> {

        var resultIDs: string[] = [];
        const cardsPerPage: number = this.pageCount;

        // If we're supposed to search through the user's list of saved cards 
        //      AND
        // The user was actually passed in...
        //
        //          MY CARDS SEARCH
        //
        if (requestedQuery.isMyCards && currentUser) {

            // Get this user's saved cards
            const savedCards: savedCard[] = currentUser.getAllSavedCards();

            // If there's an empty textQuery for saved cards...
            if (!requestedQuery.textQuery) {

                // Loop through every saved card and
                // add it to our results!
                for (const tempCard of savedCards) {
                    resultIDs.push(tempCard.cardID);
                }
            }
            // Otherwise, perform a normal search.
            else {

                // Loop through every saved card and...
                for (const tempCard of savedCards) {
                    // Pull full card info
                    const realCard: card = await databaseWrapper.getCard(tempCard.cardID);

                    // If this card is in the database...
                    if (realCard) {

                        // If this card has the requested tags
                        //      AND
                        // If this card has the requested text
                        if (realCard.hasTags(requestedQuery.tags) && realCard.hasText(requestedQuery.textQuery)) {
                            resultIDs.push(tempCard.cardID);
                        }
                    }
                }
            }
        }
        // Otherwise, search through the entire database!
        //
        //          FULL DATABASE SEARCH
        //
        else if (requestedQuery.textQuery) {
            await this.runMongoOperation(async function (database) {

                // Get card collection from database
                var cardCollection = await database.collection("cards");



                var query = { };

                // Use mongoDB's search function.
                // Does NOT use partial matching.
                //query["$text"] = {
                //    $search: requestedQuery.textQuery,
                //    $caseSensitive: false,
                //}

                // Use REGEX for partial matching
                query["$or"] = [
                    { "ownerInfo.firstName": { $regex: requestedQuery.textQuery, $options: "i" }},
                    { "ownerInfo.lastName": { $regex: requestedQuery.textQuery, $options: "i" } },
                    { "ownerInfo.customURL": { $regex: requestedQuery.textQuery, $options: "i" } },
                    { "content.tags": { $regex: requestedQuery.textQuery, $options: "i" } },
                    { "content.cardProperties": { $regex: requestedQuery.textQuery, $options: "i" } }
                ]


                // Only search through published cards
                //query["content.published"] = true;
                
                // If we're using tags in our search...
                if (requestedQuery.tags.length > 0) {
                    // Search for cards that contain all of our required tags
                    query["content.tags"] = {
                        $all: requestedQuery.tags
                    }
                }


                const projection = {
                    _id: 0,
                    cardID: 1,
                }

                // Restrict the database return results so that:
                //  * we skip to the page provided in requestedQuery.pageNumber
                //  * we ONLY get the uuid
                const options = {
                    skip: requestedQuery.pageNumber * cardsPerPage,
                    //limit: cardsPerPage,

                    projection: projection
                }

                // Execute search using the above query and options
                const cursor = cardCollection.find(query, options);


                // Add each UUID to the list
                await cursor.forEach((card) => {
                    resultIDs.push(card.cardID);
                });
            });
        }



        

        return resultIDs;
    }








    //
    //  MongoDB Methods
    //

    // Connects to the database, runs a callback providing the database, then closes the connection
    // (used for generic database operations)
    public async runMongoOperation(operation: (db: Db) => Promise<void>): Promise<void> {

        // If for some reason the mongoDB connection isn't defined
        //      OR
        // If the mongoDB connection is closed...
        if (!this.mongoClient || !this.mongoClient.isConnected) {
            // Try to start it!
            await this.initialize();
        }

        var dbPassport: Db = this.mongoClient.db("passport");

        // Run and wait for the operation callback to finish
        await operation(dbPassport).catch(err => console.log(`Error while executing mongo operation: ${err}`))
    }


















    //
    //  Getters
    //

    public getPageCount(): number {
        return this.pageCount;
    }
}



// Construct a new database wrapper
// and export it from this file to be used as a singleton!
let databaseWrapper: databaseWrapperClass = new databaseWrapperClass();
export { databaseWrapper };