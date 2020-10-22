import express, { Application } from "express";
import { postEmailExistsResult } from "./interfaces/post/postEmailExistsResult";
import { getDummyPostEmailExistsResult, getDummyPostSlugExistsResult, getDummyPostGenericResult, getDummyPostLoginResult } from "./test/dummyData";
import { postSlugExistsResult } from "./interfaces/post/postSlugExistsResult";
import { postGenericResult } from "./interfaces/post/postGenericResult";
import { postLoginResult } from "./interfaces/post/postLoginResult";
import { databaseWrapper } from "./databaseWrapper";
import { registerUserAccountSchema } from "./interfaces/registerUserAccountSchema";
import { user } from "./user";
import { userSchema } from "./interfaces/userSchema";
import { userAccountSchema } from "./interfaces/userAccountSchema";
import bcrypt from "bcrypt";
import util from "util";

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
    app.post('/api/register', async (req, res) => {

        // Pack the body of the request into a registration form...
        const registrationForm: registerUserAccountSchema = req.body;

        // Create an empty error message string
        // If there's any missing parameters below, we'll fill this in.
        var errorMessage: string = undefined;

        // If we're missing their email...
        if (!registrationForm.email) {
            errorMessage = "No email sent";
        }
        // If we're missing their password...
        else if (!registrationForm.password) {
            errorMessage = "No password sent";
        }
        // If we're missing their public user information...
        else if (!registrationForm.public) {
            errorMessage = "No public sent";
        }
        // Otherwise, we have all of the above parameters so...
        else {
            // If we're missing their first name...
            if (!registrationForm.public.firstName) {
                errorMessage = "No public.firstName sent";
            }
            // If we're missing their last name...
            else if (!registrationForm.public.lastName) {
                errorMessage = "No public.lastName sent";
            }
            // If we're missing their custom slug URL...
            else if (!registrationForm.public.customURL) {
                errorMessage = "No public.customURL sent";
            }
            // If we're missing their profile picture URL...
            else if (!registrationForm.public.profilePictureURL) {
                errorMessage = "No public.profilePictureURL sent";
            }
        }



        // If we've haven't had an error yet...
        // Check to see if the provided email is already in use
        // Check to see if the provided slug is already in use
        if (!errorMessage) {

            // Check to see if this email already exists.
            //
            // Try to find a user with this email
            const requestedUserByEmail: user = await databaseWrapper.getUserByEmail(registrationForm.email.toLowerCase());

            // If a user with this email exists...
            if (requestedUserByEmail) {
                errorMessage = "Email already in use";
            }
            // Otherwise, if a user with that email DOESN'T exist...
            else {

                // Check to see if this slug already exists.
                //
                // Try to find a user with this slug
                const requestedUserBySlug: user = await databaseWrapper.getUserBySlug(registrationForm.public.customURL);

                // If a user with this slug exists...
                if (requestedUserBySlug) {
                    errorMessage = "Slug already in use";
                }
            }
        }

        // If we've had an error defined in the above if-statements...
        if (errorMessage) {
            // Pack error data...
            const responseData: postGenericResult = {
                error: errorMessage
            }

            // Send it and bounce!
            res.send(responseData);
            return;
        }



        // OTHERWISE...
        // If we've hit this point, then we have a valid
        // registration form AND there's not a user that
        // will collide with this one!!


        // Take the user's password and hash it! (using 10 salt rounds)
        const hashedPassword: string = await bcrypt.hash(registrationForm.password, 10);

        // Construct a new user schema using our known information
        const newUserSchema: userAccountSchema = {
            email: registrationForm.email,
            passwordHash: hashedPassword,
            public: registrationForm.public
        }

        // Create the user in the database...
        const newUser: user = await databaseWrapper.createUser(newUserSchema);

        // Construct response data!
        const responseData: postGenericResult = {
            error: ""
        };
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