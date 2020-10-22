import express, { Application } from "express";
import { postEmailExistsResult } from "./interfaces/post/postEmailExistsResult";
import { getDummyPostEmailExistsResult, getDummyPostSlugExistsResult, getDummyPostGenericResult, getDummyPostLoginResult } from "./test/dummyData";
import { postSlugExistsResult } from "./interfaces/post/postSlugExistsResult";
import { postGenericResult } from "./interfaces/post/postGenericResult";
import { postLoginResult } from "./interfaces/post/postLoginResult";
import { databaseWrapper } from "./databaseWrapper";

export function defineUserREST(app: Application): void {

    // Tells whether or not a user with the specified email exists
    // within our system.
    app.post('/api/email-exists', async (req, res) => {

        // If there's no email paramater
        if (!req.body.email) {
            // Create error data
            const responseData: postEmailExistsResult = {
                result: false
            };

            // Send, and bounce!
            res.send(responseData);
            return;
        }

        // Get email parameter
        const email: string = req.body.email;

        // Look for a user with this email in the database
        const requestedUser = await databaseWrapper.getUserByEmail(email);

        // If the user exists, then this email exists!
        const emailExists: boolean = requestedUser != null;


        // Construct response data and send it!
        const responseData: postEmailExistsResult = {
            result: emailExists
        }
        res.send(responseData);
    });

    // Tells whether ir not a specified slug is already in use
    // within our system.
    app.post('/api/slug-exists', async (req, res) => {

        // If there's no slug paramater
        if (!req.body.slug) {
            // Create error data
            const responseData: postSlugExistsResult = {
                result: false
            };

            // Send, and bounce!
            res.send(responseData);
            return;
        }

        // Get slug parameter
        const slug: string = req.body.slug;

        // Look for a user with this slug in the database
        const requestedUser = await databaseWrapper.getUserBySlug(slug);

        // If the user exists, then this slug exists!
        const slugExists: boolean = requestedUser != null;

        // Construct response data
        const responseData: postSlugExistsResult = {
            result: slugExists
        };
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
    // (if session is already logged in, send back login result even if no params are sent in query)
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