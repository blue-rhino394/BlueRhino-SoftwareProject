import express, { Application } from "express";
import { postGetCardResult } from "./interfaces/post/postGetCardResult";
import { getDummyPostGetCardResult, getDummyPostGenericResult, getDummyPostGetSavedCardsResult, getDummyPostToggleSaveResult, getDummyPostToggleFavoriteResult, getDummyPostSearchCardResult } from "./test/dummyData";
import { postGenericResult } from "./interfaces/post/postGenericResult";
import { postGetSavedCardsResult } from "./interfaces/post/postGetSavedCardsResult";
import { postToggleSaveResult } from "./interfaces/post/postToggleSaveResult";
import { postToggleFavoriteResult } from "./interfaces/post/postToggleFavoriteResult";
import { postSearchCardResult } from "./interfaces/post/postSearchCardResult";

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

    app.post('/api/search-card', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: postSearchCardResult = getDummyPostSearchCardResult();
        res.send(responseData);
    });
}