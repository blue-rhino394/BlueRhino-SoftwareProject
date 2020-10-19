import express, { Application } from "express";
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
    app.get('/email-verify', (request, response) => {

        // If there's no verification token parameter set...
        if (!request.query.verificationToken) {
            // Bounce and just redirect to the base site!
            response.redirect("/");
            return;
        }

        // Get the verification token passed in with this GET request
        const verificationToken: string = request.query.verificationToken.toString();

        // TODO - ... Actually verify the user
        // Placeholder - in the meantime, just redirect the URL using the token.
        response.redirect(verificationToken);
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