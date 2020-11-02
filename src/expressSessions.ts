import express, { Application } from "express";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
const MongoDBStore = connectMongo(session);

export function defineExpressSessions(app: Application): void {

    // Construct MongoDBStore
    var store = new MongoDBStore({
        uri: `mongodb+srv://main-access:${"Xpcdu9kTHUaaI03o"}@cluster0.x9cls.mongodb.net/${"passport"}?retryWrites=true&w=majority`,
        collection: "user-sessions"
    });

    // Setup error callback so application doesn't halt on throwing an error
    store.on('error', function (error) {
        console.log(`Error from MongoDBStore: ${error}`);
    });

    // Implement MongoDBStore into Express
    app.use(session({
        secret: "The secret sauce to passport is that it's powered by actual carrier pigeons",

        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,    // cookie decays after 1 week
            httpOnly: false                     // Ensure JS frontend can see the cookie
        },

        store: store,
        resave: true,
        saveUninitialized: true
    }));
}