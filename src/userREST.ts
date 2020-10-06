import express, { Application } from "express";
import { postEmailExistsResult } from "./interfaces/post/postEmailExistsResult";
import { getDummyPostEmailExistsResult, getDummyPostSlugExistsResult, getDummyPostGenericResult, getDummyPostLoginResult } from "./test/dummyData";
import { postSlugExistsResult } from "./interfaces/post/postSlugExistsResult";
import { postGenericResult } from "./interfaces/post/postGenericResult";
import { postLoginResult } from "./interfaces/post/postLoginResult";

export function defineUserREST(app: Application) {

    // Tells whether or not a user with the specified email exists
    // within our system.
    app.post('/api/email-exists', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: postEmailExistsResult = getDummyPostEmailExistsResult();
        res.send(responseData);
    });

    // Tells whether ir not a specified slug is already in use
    // within our system.
    app.post('/api/slug-exist', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: postSlugExistsResult = getDummyPostSlugExistsResult();
        res.send(responseData);
    });

    // Registers a new user using provided information.
    app.post('/api/register', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: postGenericResult = getDummyPostGenericResult();
        res.send(responseData);
    });

    // Logs in a user and configures their session object on success.
    app.post('/api/login', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: postLoginResult = getDummyPostLoginResult();
        res.send(responseData);
    });

    // Updates the account settings for a user.
    app.post('/api/update-account-settings', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: postGenericResult = getDummyPostGenericResult();
        res.send(responseData);
    });
}