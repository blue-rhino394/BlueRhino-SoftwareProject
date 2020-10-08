

class databaseWrapperClass {


    //
    //  Constructor and Initialization
    //

    public constructor() {

    }




    //
    //  User Methods
    //

    // Creates a new user in the database
    public createUser(): void {

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