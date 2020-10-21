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

    app.post('/api/get-card', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: postGetCardResult = getDummyPostGetCardResult();
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
        const query: searchQuery = req.body;

        // Stays true unless
        //      textQuery is undefined
        //      tags is undefined
        //      isMyCards is undefined
        //      pageNumber is undefined
        var properlyFormattedRequest = true;
        properlyFormattedRequest = properlyFormattedRequest && query.textQuery != undefined;    
        properlyFormattedRequest = properlyFormattedRequest && query.tags != undefined;
        properlyFormattedRequest = properlyFormattedRequest && query.isMyCards != undefined;
        properlyFormattedRequest = properlyFormattedRequest && query.pageNumber != undefined;

        // If the request is not properly formatted...
        if (!properlyFormattedRequest) {

            // Return an empty array and bounce!
            const responseData: postSearchCardResult = {
                cards: []
            };
            res.send(responseData);
            return;
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