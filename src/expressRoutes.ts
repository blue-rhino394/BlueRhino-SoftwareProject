import express, { Application } from "express";
import { databaseWrapper } from "./databaseWrapper";
import { user } from "./user";
import { accountStatus } from "./enum/accountStatus";
const path = require('path');

export function defineExpressRoutes(app: Application): void {

    //
    //  Functional Routes
    //

    // Social Link
    // Redirect the current user to a provided URL and log statistics on this redirect
    // (uses the parameter url from request body to redirect)
    app.get('/social-link', (request, response) => {
        
        // If there's no URL parameter set...
        if (!request.query.url) {
            // Bounce and just redirect to the base site!
            response.redirect("/");
            return;
        }

        // Get the URL passed in with this GET request
        const redirectURL: string = request.query.url.toString();

        // Otherwise...
        // Let's properly log and redirect!

        // TODO - Log link statistics!

        // Redirect to the desired URL
        response.redirect(301, redirectURL);
    });


    // Email Verification
    // Attempt to verify the user's account
    // (this URL will be sent via email)
    app.get('/email-verify', async (request, response) => {

        // If there's no verification token parameter set
        //      OR
        // If there's no uuid parameter set...
        if (!request.query.verificationToken || !request.query.uuid) {
            // Bounce and just redirect to the base site!
            response.redirect("/");
            return;
        }

        // Get the verification token passed in with this GET request
        const verificationToken: string = request.query.verificationToken.toString();

        // Get the UUID passed in with this GET request
        const uuid: string = request.query.uuid.toString();



        // Get the user with this ID
        const requestedUser: user = await databaseWrapper.getUser(uuid);

        // If there's no user with this ID...
        if (!requestedUser) {
            // Bounce!
            response.redirect("/");
            return;
        }

        // OTHERWISE... We've got the user we want to verify. Let's verify them!

        // If the user is NOT waiting for their account to be verified...
        if (requestedUser.getAccountStatus() != accountStatus.EmailVerification) {
            // Bounce!
            response.redirect("/");
            return;
        }

        // Verify the user's email :D
        requestedUser.setAccountStatus(accountStatus.Active);

        // Redirect to the base site!
        response.redirect("/");
    });




    //
    //  Directory Routes
    //

    // Publish content in public folder
    app.use(express.static(path.join(__dirname, '../public')));

    // Publish content in the frontend folder
    app.use(express.static(path.join(__dirname, '../frontend')));




    //
    //  Specific File Routes
    //

    // Publish the 'About Us' page
    app.get('/aboutus', (request, response) => {
        response.sendFile(path.join(__dirname, '../frontend/aboutus.html'));
    });

    // Publish the 'FAQ' page
    app.get('/faq', (request, response) => {
        response.sendFile(path.join(__dirname, '../frontend/faq.html'));
    });

    // Publish the 'Card Creation Survey' page
    app.get('/cardcreationsurvey', (request, response) => {
        response.sendFile(path.join(__dirname, '../frontend/cardcreationsurvey.html'));
    });

    // Publish the 'Register Survey' page
    app.get('/registersurvey', (request, response) => {
        response.sendFile(path.join(__dirname, '../frontend/registersurvey.html'));
    });

    // Publish the 'Register Survey' page under a cleaner name
    app.get('/register', (request, response) => {
        response.sendFile(path.join(__dirname, '../frontend/registersurvey.html'));
    });




    //
    //  Carrier Pigeon
    //

    // Setup Carrier Pigeon Wildcard system
    // (Routes anything other than the above definitions to the carrier pigeon HTML)
    // THIS SHOULD BE THE LAST DEFINITION! ANYTHING AFTER THIS WILL BE DISCARDED!
    app.get('*', (request, response) => {
        response.sendFile(path.join(__dirname, '../frontend/cpigeon.html'));
    });
}