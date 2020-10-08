import { userAccountSchema } from "./interfaces/userAccountSchema";
const { MongoClient } = require("mongodb");


class databaseWrapperClass {

    private mongoClient = new MongoClient(`mongodb+srv://main-access:${"Xpcdu9kTHUaaI03o"}@cluster0.x9cls.mongodb.net/${"passport"}?retryWrites=true&w=majority`);



    //
    //  Constructor and Initialization
    //

    public constructor() {
        console.log("Starting database wrapper...");
    }

    // Checks to see if we can connected to mongoDB by pinging the users database
    public async verifyConnectedToMongoDB(): Promise<boolean> {
        var connectedCorrectly = false;

        try {
            // Connect to mongoDB
            await this.mongoClient.connect();

            // Ping mongoDB
            await this.mongoClient.db("users").command({ ping: 1 });
            connectedCorrectly = true;

            console.log("Hello mongoDB!");
        }
        finally {

            // Once we're done with the above (or even if something went wrong...)
            // close the client
            await this.mongoClient.close();
            return connectedCorrectly;
        }
    }






    //
    //  User Methods
    //

    // Creates a new user in the database
    public createUser(newAccountSchema: userAccountSchema): void {

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
    //  Helper Methods
    //
}



// Construct a new database wrapper
// and export it from this file to be used as a singleton!
let databaseWrapper: databaseWrapperClass = new databaseWrapperClass();
export { databaseWrapper };