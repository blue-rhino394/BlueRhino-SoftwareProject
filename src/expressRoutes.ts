import express, { Application } from "express";
import { databaseWrapper } from "./databaseWrapper";
import { user } from "./user";
import { accountStatus } from "./enum/accountStatus";
import { card } from "./card";
import { reservedRoutes } from "./reservedRoutes";
const path = require('path');

export function defineExpressRoutes(app: Application): void {

    //
    //  Functional Routes
    //

    // Social Link
    // Redirect the current user to a provided URL and log statistics on this redirect
    // (uses the parameter url from request body to redirect)
    app.get('/social-link', async (request, response) => {
        
        // If there's no url or slug parameter set...
        if (!request.query.url || !request.query.slug) {
            // Bounce and just redirect to the base site!
            response.redirect("/");
            return;
        }

        // Otherwise...
        // Let's properly log and redirect!

        // Get the URL passed in with this GET request
        const redirectURL: string = request.query.url.toString();

        // Redirect ASAP
        response.redirect(301, redirectURL);


        // If the user is not logged in...
        if (!request.session.uuid) {
            // ... bounce!
            return;
        }


        // Get the slug passed in with this GET request
        const cardSlug: string = request.query.slug.toString();

        // Try to get the card by this slug
        const requestedCard: card = await databaseWrapper.getCardBySlug(cardSlug);

        // If there's no card with this slug...
        if (!requestedCard) {
            // ... bounce!
            return;
        }

        // Otherwise, we've got a card to log!
        // Log the view statistic
        await requestedCard.addStatView(request.session.uuid);
    });


    // Email Verification
    // Attempt to verify the user's account
    // (this URL will be sent via email)
    app.get('/verify-email', async (request, response) => {

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

    // Publish the 'Card Creation Survey' page
    app.get('/cardcreationsurvey', (request, response) => {
        response.sendFile(path.join(__dirname, '../frontend/cardcreationsurvey.html'));
    });

    // Publish the 'Card Creation Survey' page under a cleaner name
    app.get('/create', (request, response) => {
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

    // Publish the 'About Us' page to redirect to carrier pigeon
    app.get('/aboutus', (request, response) => {
        response.sendFile(path.join(__dirname, '../frontend/cpigeon.html'));
    });

    // Publish the 'FAQ' page to redirect to carrier pigeon
    app.get('/faq', (request, response) => {
        response.sendFile(path.join(__dirname, '../frontend/cpigeon.html'));
    });

    // Setup Carrier Pigeon Wildcard system
    // (Routes anything other than the above definitions to the carrier pigeon HTML)
    // THIS SHOULD BE THE LAST DEFINITION! ANYTHING AFTER THIS WILL BE DISCARDED!
    app.get('*', (request, response) => {
        response.sendFile(path.join(__dirname, '../frontend/cpigeon.html'));
    });



    // Once the above definitions are complete,
    // take the definitions from express and 
    // add them to reservedRoutes

    // If there's an app stack
    if (app._router.stack && app._router.stack.length > 0) {

        const routeStack = app._router.stack;

        for (var x = 0; x < routeStack.length; x++) {
            if (routeStack[x].route) {
                reservedRoutes.addRoute(routeStack[x].route.path);
            }
        }
    }
    else {
        console.error("Could not define reserved routes...!");
    }
}