import { databaseWrapper } from "../../databaseWrapper";
import { user } from "../../user";
import { card } from "../../card";






async function getAllCardsFromTheDatabase(): Promise<string[]> {
    var foundCardIDs: string[] = [];

    // Run a mongoDB operation getting all users from
    // the database and adding their cardID to a list.
    await databaseWrapper.runMongoOperation(async (db) => {

        // Get the cards collection
        const cardCollection = db.collection("cards");

        // Create an empty query
        // (Should match to everything!)
        const query = {

        }

        // Create an options query
        // with a projection that should
        // only return to us the cardID of a document
        const options = {
            projection: {
                _id: 0,
                cardID: 1,
            }
        }

        // Start find operation
        const cursor = cardCollection.find(query, options);

        // Loop over each found document and add it to the
        // foundCardIDs array
        await cursor.forEach((foundCard) => {
            foundCardIDs.push(foundCard.cardID);
        })
    });

    return foundCardIDs;
}

async function removeCardsWithoutUsers(): Promise<void> {

    console.log("Processing...");

    const allCardIDs: string[] = await getAllCardsFromTheDatabase();

    for (const cardID of allCardIDs) {

        // Get the card from the database
        const requestedCard: card = await databaseWrapper.getCard(cardID);

        var shouldDeleteCard = false;


        // If this card exists...
        if (requestedCard) {

            // If for some reason this card does not
            // have an owner UUID set...
            if (!requestedCard.getOwnerUUID()) {
                // Mark this card as to be delete!
                shouldDeleteCard = true;
            }
            else {
                // Try to get this user from the database
                const requestedUser: user = await databaseWrapper.getUser(requestedCard.getOwnerUUID());

                // If for some reason this user does not exist...
                if (!requestedUser) {
                    // Mark this card as to be delete!
                    shouldDeleteCard = true;
                }
            }
        }


        if (shouldDeleteCard) {
            await databaseWrapper.deleteCard(cardID);
            console.log(`Deleted rogue card ${cardID}`);
        }
    }


    console.log("Done!");
}


//  WARNING!
//  
//  This method effects EVERY USER and their card in the database.
//  If you're trying to run this, BE AWARE OF WHAT YOU'RE TRYING TO DO.
//  This file only exists for development purposes. It should NEVER
//  EVER EVER be used in production. You have been warned!
//      ~Graham :)
//
//  To allow this file to run, change the variable below to
//      "Yes!!!"
//  and make sure to CHANGE IT BACK WHEN YOU'RE DONE.
//
//
//var iKnowWhatImDoing = "No I don't.";
var iKnowWhatImDoing = "Yes!!!";


if (iKnowWhatImDoing == "Yes!!!") {
    removeCardsWithoutUsers();
}
else {
    throw new Error("You don't know what you're doing.");
}

