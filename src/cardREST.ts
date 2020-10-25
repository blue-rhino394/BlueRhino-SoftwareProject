import express, { Application } from "express";
import { postGetCardResult } from "./interfaces/post/postGetCardResult";
import { getDummyPostGetCardResult, getDummyPostGenericResult, getDummyPostGetSavedCardsResult, getDummyPostToggleSaveResult, getDummyPostToggleFavoriteResult, getDummyPostSearchCardResult } from "./test/dummyData";
import { postGenericResult } from "./interfaces/post/postGenericResult";
import { postGetSavedCardsResult } from "./interfaces/post/postGetSavedCardsResult";
import { postToggleSaveResult } from "./interfaces/post/postToggleSaveResult";
import { postToggleFavoriteResult } from "./interfaces/post/postToggleFavoriteResult";
import { postSearchCardResult } from "./interfaces/post/postSearchCardResult";
import { searchQuery } from "./interfaces/searchQuery";
import { databaseWrapper } from "./databaseWrapper";
import { cardSchema } from "./interfaces/cardSchema";
import { user } from "./user";
import { card } from "./card";
import { cardContent } from "./interfaces/cardContent";
import { defineExpressRoutes } from "./expressRoutes";
import { savedCard } from "./interfaces/savedCard";

export function defineCardREST(app: Application): void {

    // Gets a card from the database using a cardID
    //
    // If the card requested doesn't belong to the currently signed in
    // user, then it's stats are ommitted.
    app.post('/api/get-card', async (req, res) => {

        // If the's no cardID parameter...
        if (!req.body.cardID) {
            // Create error data
            const responseData: postGetCardResult = {
                error: "No cardID sent",
                card: undefined
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }


        // Get the cardID from the post request
        const cardID: string = req.body.cardID;

        // Get the card from the database
        const requestedCard = await databaseWrapper.getCard(cardID);

        // If there's no card by this ID in the database...
        if (!requestedCard) {
            // Create error data
            const responseData: postGetCardResult = {
                error: "Card not found",
                card: undefined
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }


        // Generate the card schema from the requested card
        const cardSchema = requestedCard.getCardSchema();

        // If the user is NOT logged in
        //      OR
        // The user is logged in and this is NOT their card...
        if (!req.session.uuid || req.session.uuid != requestedCard.getOwnerUUID()) {
            // Remove the stats from cardSchema
            cardSchema.stats = undefined;
        }

        // If the user is logged in...
        if (req.session.uuid) {
            // Log this card as viewed, if it hasn't been already!
            //      NOTE:   This is an async function but
            //              we're not awaiting it to save
            //              response time :)
            logViewStatOnCard(requestedCard, req.session.uuid);
        }


        // Construct response data
        const responseData: postGetCardResult = {
            card: cardSchema,
            error: ""
        }

        // Send!
        res.send(responseData);
    });

    // Gets a card from the database using a slug
    //
    // If the card requested doesn't belong to the currently signed in
    // user, then it's stats are ommitted.
    app.post('/api/get-card-by-slug', async (req, res) => {

        // If the's no slug parameter...
        if (!req.body.slug) {
            // Create error data
            const responseData: postGetCardResult = {
                error: "No slug sent",
                card: undefined
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }


        // Get the slug from the post request
        const slug: string = req.body.slug;

        // Get the card from the database
        const requestedCard = await databaseWrapper.getCardBySlug(slug);

        // If there's no card by this slug in the database...
        if (!requestedCard) {
            // Create error data
            const responseData: postGetCardResult = {
                error: "Card not found",
                card: undefined
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }



        // Generate the card schema from the requested card
        const cardSchema = requestedCard.getCardSchema();

        // If the user is NOT logged in
        //      OR
        // The user is logged in and this is NOT their card...
        if (!req.session.uuid || req.session.uuid != requestedCard.getOwnerUUID()) {
            // Remove the stats from cardSchema
            cardSchema.stats = undefined;
        }

        // If the user is logged in...
        if (req.session.uuid) {
            // Log this card as viewed, if it hasn't been already!
            //      NOTE:   This is an async function but
            //              we're not awaiting it to save
            //              response time :)
            logViewStatOnCard(requestedCard, req.session.uuid);
        }

        // Construct response data
        const responseData: postGetCardResult = {
            card: cardSchema,
            error: ""
        }

        // Send!
        res.send(responseData);
    });

    // Sets properties on the card of the currently logged in user
    app.post('/api/set-card', async (req, res) => {

        // If the user is not logged in...
        if (!req.session.uuid) {
            // Create error data
            const responseData: postGenericResult = {
                error: "Not logged in"
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }

        // Get the user from the database
        const requestedUser: user = await databaseWrapper.getUser(req.session.uuid);

        // If there's no user with this uuid in the database...
        if (!requestedUser) {
            // Create error data
            const responseData: postGenericResult = {
                error: "Invalid session uuid"
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }


        // OTHERWISE...
        // We have a valid user. Lets see if they have a card...
        // Get the user's card ID
        const cardID: string = requestedUser.getCardID();

        // If the user doesn't have a card ID then...
        //
        //      CREATE NEW CARD FOR THIS USER
        // 
        if (!cardID) {

            // Pack the body of the request into a creation form
            const creationForm: cardContent = req.body;

            var errorMessage: string = undefined;

            // If we're missing the published parameter...
            if (creationForm.published == undefined) {
                errorMessage = "No published sent";
            }
            // If we're missing the tags parameter...
            else if (creationForm.tags == undefined) {
                errorMessage = "No tags sent";
            }
            // If we're missing the socialMediaLinks parameter...
            else if (creationForm.socialMediaLinks == undefined) {
                errorMessage = "No socialMediaLinks sent";
            }
            // If we're missing the cardProperties parameter...
            else if (creationForm.cardProperties == undefined) {
                errorMessage = "No cardProperties sent";
            }
            // Otherwise...
            else {

                // If we're missing the layout parameter...
                if (creationForm.layout == undefined) {
                    errorMessage = "No layout sent";
                }
                // If we HAVE the layout parameter...
                else {
                    // If we're missing the layout.background parameter...
                    if (creationForm.layout.background == undefined) {
                        errorMessage = "No layout.background sent";
                    }
                    // If we're missing the layout.fontColor parameter...
                    else if (creationForm.layout.fontColor == undefined) {
                        errorMessage = "No layout.fontColor sent";
                    }
                }
            }


            // If there's been an error in the above if-statement
            if (errorMessage) {
                // Create error data
                const responseData: postGenericResult = {
                    error: errorMessage
                }

                // Send, and bounce!
                res.send(responseData);
                return;
            }




            // OTHERWISE
            // If we've hit this point, then the creation form
            // is valid so...
            // Let's create this new card!

            // Create a new card
            const newCard: card = await databaseWrapper.createCard(requestedUser.getUUID(), creationForm);

            // If somehow there was an error creating this card...
            if (!newCard) {
                // Create error data
                const responseData: postGenericResult = {
                    error: "Database error when creating new card"
                }

                // Send, and bounce!
                res.send(responseData);
                return;
            }

            // Assign this card to the user!
            await requestedUser.setCardID(newCard.getID());

            // Construct response data and send!
            const responseData: postGenericResult = {
                error: ""
            };
            res.send(responseData);
        }
        // Otherwise, this user has a card...
        // 
        //      UPDATE CARD FOR THIS USER
        //
        else {

            // Get the card from the database
            const requestedCard: card = await databaseWrapper.getCard(requestedUser.getCardID());

            // If somehow there was an error getting this user's card...
            if (!requestedCard) {
                // Create error data
                const responseData: postGenericResult = {
                    error: "User has invalid cardID"
                }

                // Send, and bounce!
                res.send(responseData);
                return;
            }

            // Pack the body of the request into an update form
            const updateForm: cardContent = req.body;

            // Update the card!
            await requestedCard.setCardContent(updateForm);

            // Construct response data and send!
            const responseData: postGenericResult = {
                error: ""
            };
            res.send(responseData);
        }
    });

    // Deletes the card of the currently logged in user
    app.post('/api/delete-card', async (req, res) => {

        // If the user is not logged in...
        if (!req.session.uuid) {
            // Create error data
            const responseData: postGenericResult = {
                error: "Not logged in"
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }

        // Get the user from the database
        const requestedUser: user = await databaseWrapper.getUser(req.session.uuid);

        // If there's no user with this uuid in the database...
        if (!requestedUser) {
            // Create error data
            const responseData: postGenericResult = {
                error: "Invalid session uuid"
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }


        // OTHERWISE...
        // We have a valid user. Lets see if they have a card...
        // Get the user's card ID
        const cardID: string = requestedUser.getCardID();

        // If this user doesn't have a card...
        if (!requestedUser) {
            // Create error data
            const responseData: postGenericResult = {
                error: "Invalid session uuid"
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }


        // Actually remove the card!
        //

        // Remove the card from the user
        await requestedUser.setCardID("");

        // Remove the card in the database and store any errors
        const deleteCardError: string = await databaseWrapper.deleteCard(cardID);
        

        // Pack response data
        const responseData: postGenericResult = {
            error: deleteCardError
        };
        res.send(responseData);
    });

    // Toggles whether or not the provided card is
    // saved to the currently logged in user's list of saved cards
    app.post('/api/toggle-save', async (req, res) => {

        // Get the cardID parameter
        const cardID: string = req.body.cardID;



        var errorMessage: string = undefined;

        // If the user is not logged in
        if (!req.session.uuid) {
            errorMessage = "User not logged in"
        }
        // If no cardID was sent...
        else if (!cardID) {
            errorMessage = "No cardID sent";
        }

        // If there was an error with one of the above statements...
        if (errorMessage) {
            // Create error data
            const responseData: postToggleSaveResult = {
                error: errorMessage,
                isSaved: false
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }




        // Get the card from the database
        const requestedCard: card = await databaseWrapper.getCard(cardID);

        // If there's no card by this ID in the database...
        if (!requestedCard) {
            // Create error data
            const responseData: postToggleSaveResult = {
                error: "No card with this cardID",
                isSaved: false
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }


        // Get the currently logged in user
        const requestedUser: user = await databaseWrapper.getUser(req.session.uuid);

        // If there's no user with this uuid in the database...
        if (!requestedUser) {
            // Create error data
            const responseData: postToggleSaveResult = {
                error: "Invalid session uuid",
                isSaved: false
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }




        // OTHERWISE
        // We've got the card that this user wants to toggle, and the user
        // that will be doing the toggling. Let's do it!

        // Try to get the saved card
        const currentlySavedCard: savedCard = requestedUser.getSavedCard(cardID);
        var isSaved: boolean = false;

        // If this card is not saved...
        if (!currentlySavedCard) {
            // Save it!
            await requestedUser.addSavedCard(cardID);
            await requestedCard.addStatSave(requestedUser.getUUID());
            isSaved = true;
        }
        // OTHERWISE, if this card IS saved...
        else {
            // Unsave it!
            await requestedUser.removeSavedCard(cardID);
            await requestedCard.removeStatSave(requestedUser.getUUID());
            isSaved = false;
        }


        // Pack response data
        const responseData: postToggleSaveResult = {
            error: "",
            isSaved: isSaved
        };
        res.send(responseData);
    });

    // Toggles whether or not the provided card is
    // marked as a favorite in the user's list of saved cards
    app.post('/api/toggle-favorite', async (req, res) => {

        // Get the cardID parameter
        const cardID: string = req.body.cardID;



        var errorMessage: string = undefined;

        // If the user is not logged in
        if (!req.session.uuid) {
            errorMessage = "User not logged in"
        }
        // If no cardID was sent...
        else if (!cardID) {
            errorMessage = "No cardID sent";
        }

        // If there was an error with one of the above statements...
        if (errorMessage) {
            // Create error data
            const responseData: postToggleFavoriteResult = {
                error: errorMessage,
                isFavorited: false
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }




        // Get the card from the database
        const requestedCard: card = await databaseWrapper.getCard(cardID);

        // If there's no card by this ID in the database...
        if (!requestedCard) {
            // Create error data
            const responseData: postToggleSaveResult = {
                error: "No card with this cardID",
                isSaved: false
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }


        // Get the currently logged in user
        const requestedUser: user = await databaseWrapper.getUser(req.session.uuid);

        // If there's no user with this uuid in the database...
        if (!requestedUser) {
            // Create error data
            const responseData: postToggleSaveResult = {
                error: "Invalid session uuid",
                isSaved: false
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }




        // OTHERWISE
        // We've got the card that this user wants to toggle, and the user
        // that will be doing the toggling. Let's do it!

        // Check to see if we have this card as a saved card
        var requestedSavedCard: savedCard = requestedUser.getSavedCard(cardID);

        // If this card isn't already saved...
        if (!requestedSavedCard) {
            // Mark it as saved!
            requestedSavedCard = await requestedUser.addSavedCard(cardID);
        }

        // Toggle the favorited value on this savedCard
        requestedSavedCard.favorited = !requestedSavedCard.favorited;

        // Update the saved card on the user
        const didUpdate: boolean = await requestedUser.updateSavedCard(requestedSavedCard);

        // Update the favorited stat
        if (requestedSavedCard.favorited) {
            await requestedCard.addStatFavorite(requestedUser.getUUID());
        }
        else {
            await requestedCard.removeStatFavorite(requestedUser.getUUID());
        }

        // If for some reason it failed to update this saved card...
        if (!didUpdate) {
            // Create error data
            const responseData: postToggleSaveResult = {
                error: "Failed to update card for unknown reason",
                isSaved: false
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }




        // Pack response data
        const responseData: postToggleFavoriteResult = {
            error: "",
            isFavorited: requestedSavedCard.favorited
        };
        res.send(responseData);
    });

    // Adds memo text to the provided card in
    // the user's list of saved cards
    app.post('/api/set-memo', async (req, res) => {

        // Get the cardID & memoText parameters
        const cardID: string = req.body.cardID;
        const memoText: string = req.body.memoText;


        var errorMessage: string = undefined;

        // If the user is not logged in
        if (!req.session.uuid) {
            errorMessage = "User not logged in"
        }
        // If no cardID was sent...
        else if (!cardID) {
            errorMessage = "No cardID sent";
        }
        // If no memoText was sent...
        else if (!memoText) {
            errorMessage = "No memoText sent";
        }

        // If there was an error with one of the above statements...
        if (errorMessage) {
            // Create error data
            const responseData: postGenericResult = {
                error: errorMessage
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }




        // Get the card from the database
        const requestedCard: card = await databaseWrapper.getCard(cardID);

        // If there's no card by this ID in the database...
        if (!requestedCard) {
            // Create error data
            const responseData: postGenericResult = {
                error: "No card with this cardID"
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }


        // Get the currently logged in user
        const requestedUser: user = await databaseWrapper.getUser(req.session.uuid);

        // If there's no user with this uuid in the database...
        if (!requestedUser) {
            // Create error data
            const responseData: postGenericResult = {
                error: "Invalid session uuid"
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }




        // OTHERWISE
        // We've got the card that this user wants to set a memo on, and the user
        // that will be holding said memo. Let's do it!

        // Check to see if we have this card as a saved card
        var requestedSavedCard: savedCard = requestedUser.getSavedCard(cardID);

        // If this card isn't already saved...
        if (!requestedSavedCard) {
            // Mark it as saved!
            requestedSavedCard = await requestedUser.addSavedCard(cardID);
        }

        // Set the memo text and update the database
        requestedSavedCard.memo = memoText;

        // Update the saved card on the user
        const didUpdate: boolean = await requestedUser.updateSavedCard(requestedSavedCard);

        // Update the memo stat
        if (requestedSavedCard.memo) {
            await requestedCard.addStatMemo(requestedUser.getUUID());
        }
        else {
            await requestedCard.removeStatMemo(requestedUser.getUUID());
        }

        // If for some reason it failed to update this saved card...
        if (!didUpdate) {
            // Create error data
            const responseData: postGenericResult = {
                error: "Failed to update card for unknown reason"
            }

            // Send, and bounce!
            res.send(responseData);
            return;
        }




        // Pack response data
        const responseData: postGenericResult = {
            error: ""
        };
        res.send(responseData);
    });







    // Searches for cards across either the entire database, or just
    // in the user's list of saved cards.
    //
    // If searching through the user's list of saved cards and an
    // empty string is sent, all saved cards will be returned
    app.post('/api/search-card', async (req, res) => {

        // Cram the body into a query interface
        var query: searchQuery = req.body;

        // Stays true unless
        //      textQuery is undefined
        var properlyFormattedRequest = true;
        properlyFormattedRequest = properlyFormattedRequest && query.textQuery != undefined;    

        // If the request is not properly formatted...
        if (!properlyFormattedRequest) {

            // Return an empty array and bounce!
            const responseData: postSearchCardResult = {
                cards: []
            };
            res.send(responseData);
            return;
        }

        // If tags aren't sent, fix the interface to use an empty array
        if (query.tags == undefined) {
            query.tags = [];
        }

        // If isMyCards isn't specified, default to false
        if (query.isMyCards == undefined) {
            query.isMyCards = false;
        }

        // If pageNumber isn't specified, default to zero
        if (query.pageNumber == undefined) {
            query.pageNumber = 0;
        }



        var foundCardIDs: string[] = [];

        // If we're supposed to be searching through the user's cards
        if (query.isMyCards) {

            // If the user is logged in...
            if (req.session.uuid) {
                // Get the user from the database
                const requestedUser: user = await databaseWrapper.getUser(req.session.uuid);

                // If this user actually exists...
                if (requestedUser) {
                    // Search the database for cards using this query
                    foundCardIDs = await databaseWrapper.searchQuery(query, requestedUser);
                }
            }
        }
        // Otherwise... Search through the whole database.
        else {
            // Search the database for cards using this query
            foundCardIDs = await databaseWrapper.searchQuery(query);
        }

        


        // Create array to hold schemas in
        var foundCards: cardSchema[] = [];

        // Loop through the found card ID's and pack the cards into 
        // the foundCards array
        for (const cardID of foundCardIDs) {
            const foundCard = await databaseWrapper.getCard(cardID);

            // If the card exists and was retrieved correctly...
            if (foundCard) {

                // Grab the schema
                const foundSchema = foundCard.getCardSchema();

                // Omit stats!
                foundSchema.stats = undefined;

                // Add it to the foundCards array!
                foundCards.push(foundSchema);
            }
        }


        // Pack response data using the cards we've retrieved!
        const responseData: postSearchCardResult = {
            cards: foundCards
        };
        res.send(responseData);
    });

    // Fetches the top 10 most popular cards in the system
    app.post('/api/hot-cards', async (req, res) => {

        var resultIDs: string[] = [];


        await databaseWrapper.runMongoOperation(async (database) => {

            // Get the card collection from the database
            const cardCollection = database.collection("cards");

            // Aggregate the top 10 search results.
            //
            // Note for the future: This can be optimized
            // by caching a cardViewCount variable inside stats!
            // That way, we don't have to manually calculate it
            // every time we run this aggregation
            //
            // Works by:
            // Adding a new field to the search result that's
            // equal to the size of the cardViews array in stats.
            // Then, sorting the returned collection by the calculated viewCount.
            // Then, limiting the return results to 10 objects.
            const cursor = cardCollection.aggregate([
                {
                    $project: {
                        _id: 0,
                        cardID: 1,
                        viewCount: { $size: { "$ifNull": ["$stats.cardViews", []] } }
                    }
                },
                {
                    $sort: { "viewCount": -1 }
                },
                {
                    $limit: 10
                }
            ]);




            // Manually iterate through
            // AggregationCursor because
            // for some reason the mongoDB
            // implementation doesn't
            // have a forEach process
            // like it's other cursors do...

            var cursorLocation = await cursor.next();

            while (cursorLocation) {

                resultIDs.push(cursorLocation["cardID"]);
                cursorLocation = await cursor.next();
            }
        });


        console.log(resultIDs);

        // Create array to hold schemas in
        var foundCards: cardSchema[] = [];

        // Loop through the found card ID's and pack the cards into 
        // the foundCards array
        for (const cardID of resultIDs) {
            const foundCard = await databaseWrapper.getCard(cardID);

            // If the card exists and was retrieved correctly...
            if (foundCard) {

                // Grab the schema
                const foundSchema = foundCard.getCardSchema();

                // Omit stats!
                foundSchema.stats = undefined;

                // Add it to the foundCards array!
                foundCards.push(foundSchema);
            }
        }


        // Pack response data using the cards we've retrieved!
        const responseData: postSearchCardResult = {
            cards: foundCards
        };
        res.send(responseData);
    });
}












//
//  Utility Functions
//

// Counts the provided UUID as a view on the provided card.
// If the uuid isn't legit, then it's not logged.
async function logViewStatOnCard(cardToUse: card, uuidToLog: string): Promise<void> {

    // Get the user from the database.
    const requestedUser: user = await databaseWrapper.getUser(uuidToLog);

    // If there's not a user by this ID in the database...
    if (!requestedUser) {
        // Bounce!
        return;
    }


    // OTHERWISE...
    // Let's log this stat!

    await cardToUse.addStatView(uuidToLog);
}