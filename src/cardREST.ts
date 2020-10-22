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

export function defineCardREST(app: Application): void {

    // TODO - omit stats if session doesn't relate to this card
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

        // Construct response data
        const responseData: postGetCardResult = {
            card: requestedCard.getCardSchema(),
            error: ""
        }

        // Send!
        res.send(responseData);
    });

    // TODO - omit stats if session doesn't relate to this card
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

        // Construct response data
        const responseData: postGetCardResult = {
            card: requestedCard.getCardSchema(),
            error: ""
        }

        // Send!
        res.send(responseData);
    });

    app.post('/api/set-card', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: postGenericResult = getDummyPostGenericResult();
        res.send(responseData);
    });

    app.post('/api/delete-card', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: postGenericResult = getDummyPostGenericResult();
        res.send(responseData);
    });

    app.post('/api/get-saved-cards', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: postGetSavedCardsResult = getDummyPostGetSavedCardsResult();
        res.send(responseData);
    });

    app.post('/api/toggle-save', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: postToggleSaveResult = getDummyPostToggleSaveResult();
        res.send(responseData);
    });

    app.post('/api/toggle-favorite', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: postToggleFavoriteResult = getDummyPostToggleFavoriteResult();
        res.send(responseData);
    });

    app.post('/api/set-memo', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: postGenericResult = getDummyPostGenericResult();
        res.send(responseData);
    });

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



        // Search the database for cards using this query
        const foundCardIDs = await databaseWrapper.searchQuery(query);


        // Create array to hold schemas in
        var foundCards: cardSchema[] = [];

        // Loop through the found card ID's and pack the cards into 
        // the foundCards array
        for (const cardID of foundCardIDs) {
            const foundCard = await databaseWrapper.getCard(cardID);

            // If the card exists and was retrieved correctly...
            if (foundCard) {
                // Add it to the foundCards array!
                foundCards.push(foundCard.getCardSchema());
            }
        }


        // Pack response data using the cards we've retrieved!
        const responseData: postSearchCardResult = {
            cards: foundCards
        };
        res.send(responseData);
    });
}