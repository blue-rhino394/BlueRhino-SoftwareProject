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
import { emailWrapper } from "./emailWrapper";
import { accountStatus } from "./enum/accountStatus";

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

        //
        //      CREATE THE NEW USER!
        //

        // If there's already a session, REMOVE IT
        if (req.session.uuid) {
            req.session.uuid = undefined;
        }


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

        // Send the verification email...
        const sentEmailCorrectly: boolean = await emailWrapper.sendAccountVerificationEmail(newUser, req.get('host'));

        // If we've failed to send the account verification email...
        if (!sentEmailCorrectly) {
            // Remove the user from the database.
            await databaseWrapper.deleteUser(newUser.getUUID());

            // Pack error data...
            const responseData: postGenericResult = {
                error: "Backend failed to send verification email (something is very wrong)"
            }

            // Send it and bounce!
            res.send(responseData);
            return;
        }


        // OTHERWISE
        // ... we're golden!


        // Construct response data!
        const responseData: postGenericResult = {
            error: ""
        };
        res.send(responseData);
    });

    // Attempts to re-send the account verification email
    // To the currently signed in user.
    app.post('/api/resend-verification-email', async (req, res) => {

        // If the user is not currently logged in...
        if (!req.session.uuid) {
            // Pack error data...
            const responseData: postGenericResult = {
                error: "Not logged in"
            }

            // Send it and bounce!
            res.send(responseData);
            return;
        }

        // Get the user from the database
        const requestedUser: user = await databaseWrapper.getUser(req.session.uuid);

        // If there's no user by this uuid...
        if (!requestedUser) {
            // Pack error data...
            const responseData: postGenericResult = {
                error: "Invalid session uuid"
            }

            // Send it and bounce!
            res.send(responseData);
            return;
        }

        // If this user is not waiting to have their account verified...
        if (requestedUser.getAccountStatus() != accountStatus.EmailVerification) {
            // Pack error data...
            const responseData: postGenericResult = {
                error: "No email verification needed"
            }

            // Send it and bounce!
            res.send(responseData);
            return;
        }


        // OTHERWISE...
        // We have a legit user. They need to verify their email.
        // Let's resend them their verification email!

        // Send the verification email...
        const sentEmailCorrectly: boolean = await emailWrapper.sendAccountVerificationEmail(requestedUser, req.get('host'));

        // If we've failed to send the account verification email...
        if (!sentEmailCorrectly) {
            // Pack error data...
            const responseData: postGenericResult = {
                error: "Backend failed to send verification email (something is very wrong)"
            }

            // Send it and bounce!
            res.send(responseData);
            return;
        }


        // OTHERWISE...
        // We're golden! Email sent.

        // Pack response data!
        const responseData: postGenericResult = {
            error: ""
        }
        res.send(responseData);
    });

    // Logs in a user and configures their session object on success.
    // (if session is already logged in, send back login result even if no params are sent in query)
    app.post('/api/login', async (req, res) => {

        // If there are missing parameters
        //      AND
        // If the user is already logged in...
        if ((!req.body.email || !req.body.password) && req.session.uuid) {
            // Return with their information!

            // Get user from the database
            const existingUser: user = await databaseWrapper.getUser(req.session.uuid);

            // If this user doesn't exist...
            if (!existingUser) {
                // Pack error data...
                const responseData: postLoginResult = {
                    error: "Invalid session uuid",

                    uuid: undefined,
                    email: undefined,
                    currentAccountStatus: undefined,
                    savedCards: undefined,
                    public: undefined
                }

                // Send it and bounce!
                res.send(responseData);
                return;
            }


            // OTHERWISE...
            // The user already exists and is logged in (which should be normal)
            // So let's send back some info baby!

            const userAccount = existingUser.getAccountSchema();

            // Pack response data and bounce!
            const responseData: postLoginResult = {
                error: "",

                uuid: existingUser.getUUID(),
                email: userAccount.email,
                currentAccountStatus: existingUser.getAccountStatus(),
                savedCards: existingUser.getAllSavedCards(),
                public: userAccount.public
            };
            res.send(responseData);
            return;
        }




        // Create an empty error message string
        // If there's any missing parameters below, we'll fill this in.
        var errorMessage: string = undefined;

        // If there's no email parameter...
        if (!req.body.email) {
            errorMessage = "No email sent";
        }
        // If there's no password parameter...
        else if (!req.body.password) {
            errorMessage = "No password sent";
        }

        // If we've had an error defined in the above if-statements...
        if (errorMessage) {
            // Pack error data...
            const responseData: postLoginResult = {
                error: errorMessage,

                uuid: undefined,
                email: undefined,
                currentAccountStatus: undefined,
                savedCards: undefined,
                public: undefined
            }

            // Send it and bounce!
            res.send(responseData);
            return;
        }


        // OTHERWISE...
        // The request was sent correctly so...

        // Get the email & password parameters
        const email: string = req.body.email;
        const password: string = req.body.password;

        // Get the user with this email...
        const requestedUser: user = await databaseWrapper.getUserByEmail(email);

        // If there's no user with this email...
        if (!requestedUser) {
            // Pack error data...
            const responseData: postLoginResult = {
                error: "No user with this email",

                uuid: undefined,
                email: undefined,
                currentAccountStatus: undefined,
                savedCards: undefined,
                public: undefined
            }

            // Send it and bounce!
            res.send(responseData);
            return;
        }



        // Check to see if the password is valid...
        const isValidPassword: boolean = requestedUser.tryPassword(password);

        // If the password is WRONG...
        if (!isValidPassword) {
            // Pack error data...
            const responseData: postLoginResult = {
                error: "Incorrect password",

                uuid: undefined,
                email: undefined,
                currentAccountStatus: undefined,
                savedCards: undefined,
                public: undefined
            }

            // Send it and bounce!
            res.send(responseData);
            return;
        }



        // OTHERWISE...
        // If we're at this point, the user has provided a email & matching password so...
        // Log them in!!

        // Setup session object
        req.session.uuid = requestedUser.getUUID();

        const userAccount = requestedUser.getAccountSchema();
        
        // Pack response data
        const responseData: postLoginResult = {
            error: "",

            uuid: requestedUser.getUUID(),
            email: userAccount.email,
            currentAccountStatus: requestedUser.getAccountStatus(),
            savedCards: requestedUser.getAllSavedCards(),
            public: userAccount.public
        };
        res.send(responseData);
    });

    // Logs out a user
    app.post('/api/logout', (req, res) => {

        // If the user is NOT logged in...
        if (!req.session.uuid) {
            // Pack response data
            const responseData: postGenericResult = {
                error: "Not logged in"
            }

            // Send and bounce!
            res.send(responseData);
            return;
        }


        // OTHERWISE...
        // The user is logged in. Let's log em out!
        req.session.uuid = undefined;

        // Pack response data
        const responseData: postGenericResult = {
            error: ""
        }
        res.send(responseData);
    });

    // Updates the account settings for a user.
    app.post('/api/update-account-settings', async (req, res) => {

        // If we're not logged in...
        if (!req.session.uuid) {
            // Pack response data
            const responseData: postGenericResult = {
                error: "Not logged in"
            }

            // Send and bounce!
            res.send(responseData);
            return;
        }



        // Pack the body of the request into an update form
        const updateForm: userAccountSchema = req.body;



        // Manually check the update form for any potential errors
        //

        // If a new password is sent (will be unhashed despite name)...
        if (updateForm.passwordHash) {
            // Hash it!
            updateForm.passwordHash = await bcrypt.hash(updateForm.passwordHash, 10);
        }

        // If a new email is sent...
        if (updateForm.email) {
            // Check to see if a user already is using this email!

            // Get a user using this email
            const existingUser: user = await databaseWrapper.getUserByEmail(updateForm.email);

            // If a user exists with this email...
            if (existingUser) {
                // Pack response data
                const responseData: postGenericResult = {
                    error: "A user with this email already exists"
                }

                // Send and bounce!
                res.send(responseData);
                return;
            }
        }

        // If a new slug is sent...
        if (updateForm.public && updateForm.public.customURL) {
            // Check to see if a user is already using this slug!

            // Get a user using this slug
            const existingUser: user = await databaseWrapper.getUserBySlug(updateForm.public.customURL);

            // If a user exists with this email...
            if (existingUser) {
                // Pack response data
                const responseData: postGenericResult = {
                    error: "A user with this slug already exists"
                }

                // Send and bounce!
                res.send(responseData);
                return;
            }
        }





        // Get the user from the database
        const requestedUser: user = await databaseWrapper.getUser(req.session.uuid);

        // If this user doesn't exist...
        if (!requestedUser) {
            // Pack response data
            const responseData: postGenericResult = {
                error: "Invalid session uuid"
            }

            // Send and bounce!
            res.send(responseData);
            return;
        }



        // OTHERWISE...
        // We have the user. We have the update form.
        // Let's update!

        // Update the user's account data
        await requestedUser.updateAccountSchema(updateForm);


        // Pack response data
        const responseData: postGenericResult = {
            error: ""
        };
        res.send(responseData);
    });
}