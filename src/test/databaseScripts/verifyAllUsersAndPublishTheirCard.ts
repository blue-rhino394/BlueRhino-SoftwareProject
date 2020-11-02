import { databaseWrapper } from "../../databaseWrapper";
import { user } from "../../user";
import { card } from "../../card";
import { accountStatus } from "../../enum/accountStatus";






async function getAllUsersFromDatabase(): Promise<string[]> {
    var foundUUIDs: string[] = [];

    // Run a mongoDB operation getting all users from
    // the database and adding their UUID to a list.
    await databaseWrapper.runMongoOperation(async (db) => {

        // Get the users collection
        const userCollection = db.collection("users");

        // Create an empty query
        // (Should match to everything!)
        const query = {

        }

        // Create an options query
        // with a projection that should
        // only return to us the UUID of a document
        const options = {
            projection: {
                _id: 0,
                uuid: 1,
            }
        }

        // Start find operation
        const cursor = userCollection.find(query, options);

        // Loop over each found document and add it to the
        // foundUUIDs array
        await cursor.forEach((foundUser) => {
            foundUUIDs.push(foundUser.uuid);
        })
    });

    return foundUUIDs;
}

async function verifyAllUsersAndPublishTheirCard(): Promise<void> {

    // Get every user from the database
    const allUUIDs: string[] = await getAllUsersFromDatabase();


    // Loop through each uuid...
    for (const uuid of allUUIDs) {

        // Get this user from the database
        const requestedUser: user = await databaseWrapper.getUser(uuid);

        // If this user exists...
        if (requestedUser) {


            // Set this user's account to active!
            await requestedUser.setAccountStatus(accountStatus.Active);
            console.log(`Set ${uuid}'s account to Active.`);


            // If this user has a cardID...
            if (requestedUser.getCardID()) {
                // Get the card from the database
                const requestedCard: card = await databaseWrapper.getCard(requestedUser.getCardID());

                // If this card exists...
                if (requestedCard) {

                    // Set the card to published!
                    await requestedCard.setCardContent({
                        published: true,
                        socialMediaLinks: undefined,
                        tags: undefined,
                        cardProperties: undefined,
                        layout: undefined
                    });

                    console.log(`Set ${uuid}'s card to published.`);
                }
            }
        }
    }
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
var iKnowWhatImDoing = "No I don't.";


if (iKnowWhatImDoing == "Yes!!!") {
    verifyAllUsersAndPublishTheirCard();
}
else {
    throw new Error("You don't know what you're doing.");
}