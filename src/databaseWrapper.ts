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


class databaseWrapperClass {

    // The number of pages per each search
    private pageCount: number = 20;


    //
    //  Constructor and Initialization
    //

    public constructor() {
        console.log("Starting database wrapper...");
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

        const outputUser: user = new user(outputUserSchema);
        return outputUser;
    }

    // Deletes a user by ID
    public async deleteUser(uuidToDelete: string): Promise<string> {

        var outputError: string = "Unknown Error";

        // Run the mongoDB operation
        await this.runMongoOperation(async function (database) {

            // Get user collection from database
            var userCollection = await database.collection("users");

            // Run delete operation
            const operationResult = await userCollection.deleteOne({ uuid: uuidToDelete });

            // If a document was deleted
            if (operationResult.deletedCount != 0) {
                // Woo! We did it! No errors.
                outputError = "";
            }
            else {
                outputError = "No user by this UUID";
            }
        });


        return outputError;
    }

    // Finds a user in the database by ID
    public async getUser(userUUID: string): Promise<user> {

        var outputUserSchema: userSchema;

        // TODO - Make this method check the Cache Manager first!

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

        const outputUser: user = new user(outputUserSchema);
        return outputUser;
    }

    // Finds a user in the database by their slug
    public async getUserBySlug(userSlug: string): Promise<user> {
        var outputUserSchema: userSchema;

        // TODO - Make this method check the Cache Manager first!

        // If the Cache Manager doesn't have this user, let's look in the database!
        await this.runMongoOperation(async function (database) {

            // Get user collection from database
            var userCollection = await database.collection("users");

            // Try to get a user with the provided slug
            const requestedUser = await userCollection.findOne({ "userAccount.customURL": userSlug });

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

        const outputUser: user = new user(outputUserSchema);
        return outputUser;
    }

    // Finds a user in the database by their email
    public async getUserByEmail(userEmail: string): Promise<user> {
        var outputUserSchema: userSchema;

        // TODO - Make this method check the Cache Manager first!

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

        const outputUser: user = new user(outputUserSchema);
        return outputUser;
    }




    //
    //  Card Methods
    //

    // Creates a card in the database
    public async createCard(cardOwnerID: string, newContent: cardContent): Promise<card> {
        var outputCardSchema: cardSchema;

        // TODO - Add check to see if user already has a card

        // Run the mongoDB operation
        await this.runMongoOperation(async function (database) {

            // Get card collection from database
            var cardCollection = await database.collection("cards");
            // Get user collection from database
            var userCollection = await database.collection("users");

            // Try to get a user with the provided ID (REPLACE THIS ONCE USER CLASS EXISTS)
            const requestedUser = await userCollection.findOne({ uuid: cardOwnerID });

            // If there's no user with this ID...
            if (!requestedUser) {
                // BAIL!
            }
            // If this user already has a card...
            else if (requestedUser.cardID) {
                // BAIL!
            }
            // Otherwise, let's insert this new card!
            else {

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

                    firstName: requestedUser.userAccount.firstName,
                    lastName: requestedUser.userAccount.lastName,

                    content: newContent,
                    stats: newStats
                }



                // Add the card to the database
                const cardInsertOperationResult = await cardCollection.insertOne(newCardSchema);

                // Update the user in the database
                const userModifyOperationResult = await userCollection.updateOne({ uuid: cardOwnerID }, { cardID: newCardSchema.cardID });

                // If the card was actually added
                if (cardInsertOperationResult.insertedCount != 0) {
                    outputCardSchema = newCardSchema;
                }
            }
        });

        if (!outputCardSchema) {
            return null;
        }

        const outputCard: card = new card(outputCardSchema);
        return outputCard;
    }

    // Deletes a card from the database by ID
    public async deleteCard(cardIDToDelete): Promise<string> {
        var outputError: string = "Unknown Error";

        // Run the mongoDB operation
        await this.runMongoOperation(async function (database) {

            // Get card collection from database
            var cardCollection = await database.collection("cards");

            // Run delete operation
            const operationResult = await cardCollection.deleteOne({ cardID: cardIDToDelete });

            // If a document was deleted
            if (operationResult.deletedCount != 0) {
                // Woo! We did it! No errors.
                outputError = "";
            }
            else {
                outputError = "No card by this ID";
            }
        });


        return outputError;
    }

    // Finds a card in the database by ID
    public async getCard(requestedCardID: string): Promise<card> {
        var outputCardSchema: cardSchema;

        // TODO - Make this method check the Cache Manager first!

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
                // This user does not exist...!
            }
        });

        if (!outputCardSchema) {
            return null;
        }


        const outputCard: card = new card(outputCardSchema);
        return outputCard;
    }




    //
    //  Search Methods
    //

    // Searches for cards in the database using a query
    public async searchQuery(requestedQuery: searchQuery): Promise<string[]> {

        // TODO - Implement isMyCards

        var resultIDs: string[] = [];
        const cardsPerPage: number = this.pageCount;

        await this.runMongoOperation(async function (database) {

            // Get card collection from database
            var cardCollection = await database.collection("cards");


            // Search for cards that:
            //  * have the text provided in requestedQuery.textQuery
            //  * have the tags provided in requestedQuery.tags
            const query = {
                $text: {
                    $search: requestedQuery.textQuery
                },

                "content.tags": { $all: requestedQuery.tags }
            }

            // Restrict the database return results so that:
            //  * we skip to the page provided in requestedQuery.pageNumber
            //  * we ONLY get the uuid
            const options = {
                skip: requestedQuery.pageNumber * cardsPerPage,

                _id: 0,
                uuid: 1
            }

            // Execute search using the above query and options
            const cursor = cardCollection.find(query, options);

            // Add each UUID to the list
            cursor.forEach((card) => {
                resultIDs.push(card.uuid);
            });
        });

        return resultIDs;
    }








    //
    //  MongoDB Methods
    //

    // Connects to the database, runs a callback providing the database, then closes the connection
    // (used for generic database operations)
    public async runMongoOperation(operation: (db: Db) => Promise<void>): Promise<void> {
        // Construct mongoDB connection URL
        const connectionString: string = `mongodb+srv://main-access:${"Xpcdu9kTHUaaI03o"}@cluster0.x9cls.mongodb.net/${"passport"}?retryWrites=true&w=majority`;

        // Create mongoDB client for this operation
        var mongoClient = new MongoClient(connectionString, {
            useUnifiedTopology: true
        });

        // Connect to the database and attempt to run the operation
        try {
            await mongoClient.connect();
            var dbPassport: Db = await mongoClient.db("passport");

            // Run and wait for the operation callback to finish
            await operation(dbPassport);
        }
        // Disconnect from the database
        finally {
            await mongoClient.close();
        }
    }
}



// Construct a new database wrapper
// and export it from this file to be used as a singleton!
let databaseWrapper: databaseWrapperClass = new databaseWrapperClass();
export { databaseWrapper };