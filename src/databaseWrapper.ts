﻿import { userAccountSchema } from "./interfaces/userAccountSchema";
import { userSchema } from "./interfaces/userSchema";
import { MongoClient, Db } from "mongodb";
import { uuid } from 'uuidv4';
import { accountStatus } from "./enum/accountStatus";


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
    public async createUser(newAccountSchema: userAccountSchema): Promise<boolean> {
        // todo - add check for existing user

        var insertCount: number = 0;
        await this.runMongoOperation(async function(database) {

            
            // Create a new userSchema
            const newUser: userSchema = {
                uuid: uuid(),                       // Generate a random user ID
                userAccount: newAccountSchema,      // Insert the new account schema
                currentAccountStatus: accountStatus.EmailVerification,  // Set the account status to need verification
                verificationCode: uuid(),           // Generate a random verification code
                cardID: "",                         // cardID should be empty (they haven't made one yet!)
                savedCards: []                      // saved cards should be empty (they haven't been able to save any yet!)
            }

            // Get user collection from database
            var userCollection = await database.collection("users");
            // Add the new user to the database
            insertCount = (await userCollection.insertOne(newUser)).insertedCount;
        });

        // If the user was registered correctly, insert count should NOT be zero.
        return insertCount != 0;
    }

    // Deletes a user by ID
    public deleteUser(): void {

    }

    // Finds a user in the database by ID
    public getUser(): void {

    }

    // Finds a user in the database by their slug
    public getUserBySlug(): void {

    }

    // Finds a user in the database by their email
    public getUserByEmail(): void {

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