import { userAccountSchema } from "./interfaces/userAccountSchema";
import { userSchema } from "./interfaces/userSchema";
import { MongoClient, Db } from "mongodb";
import { accountStatus } from "./enum/accountStatus";
import { v4 } from "uuid";


class databaseWrapperClass {




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
    public async createUser(newAccountSchema: userAccountSchema): Promise<string> {

        var outputUUID: string = "";

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


                // Add the new user to the database and get the insertion count
                const operationResult = await userCollection.insertOne(newUser);

                if (operationResult.insertedCount != 0) {
                    outputUUID = newUser.uuid;
                }
            }
        });

        // Return the final error. If this operation is successful, this string should
        // be empty.
        return outputUUID;
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
    public async getUser(userUUID: string): Promise<string> {

        var outputResult: string = "";

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

                // And set the output to true! (CHANGE THIS WHEN WE MAKE USER A CLASS!)
                outputResult = requestedUser.uuid;
            }
            // Otherwise...
            else {
                // This user does not exist...!
            }
        });

        return outputResult;
    }

    // Finds a user in the database by their slug
    public async getUserBySlug(userSlug: string): Promise<string> {
        var outputResult: string = "";

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

                // And set the output to true! (CHANGE THIS WHEN WE MAKE USER A CLASS!)
                outputResult = requestedUser.uuid;
            }
            // Otherwise...
            else {
                // This user does not exist...!
            }
        });

        return outputResult;
    }

    // Finds a user in the database by their email
    public async getUserByEmail(userEmail: string): Promise<string> {
        var outputResult: string = "";

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

                // And set the output to true! (CHANGE THIS WHEN WE MAKE USER A CLASS!)
                outputResult = requestedUser.uuid;
            }
            // Otherwise...
            else {
                // This user does not exist...!
            }
        });

        return outputResult;
    }




    //
    //  Card Methods
    //

    // Creates a card in the database
    public createCard(): void {

    }

    // Deletes a card from the database by ID
    public deleteCard(): void {

    }

    // Finds a card in the database by ID
    public getCard(): void {

    }




    //
    //  Search Methods
    //

    // Searches for cards in the database using a query
    public searchQuery(): void {

    }








    //
    //  MongoDB Methods
    //

    private async runMongoOperation(operation: (db: Db) => Promise<void>): Promise<void> {
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