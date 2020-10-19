﻿import express, { Application } from "express";
import { createServer, Server as HTTPServer } from "http";
import { defineUserREST } from "./userREST";
import { defineCardREST } from "./cardREST";
import { databaseWrapper } from "./databaseWrapper";
import { defineExpressRoutes } from "./expressRoutes";
const path = require('path');



export class backendServer {

    // The express server that this server uses.
    private app: Application;
    // The HTTP Server to use with Express
    private httpServer: HTTPServer;

    // The port to run the webserver on
    private port: number;









    //
    //  Construction an initialization
    //

    // Constructor!
    constructor(port: number) {
        this.initialize();
        
        this.port = port;
    }

    // Create and configure any objects for this class
    private initialize(): void {
        this.app = express();
        this.httpServer = createServer(this.app);
        databaseWrapper.verifyConnectedToMongoDB().catch(console.dir);

        this.configureApp();
    }

    // Specifically configure the Express server
    private configureApp(): void {
        
        // Implement express GET Routes
        defineExpressRoutes(this.app);
       
        // Implement User REST API
        defineUserREST(this.app);

        // Implement Card REST API
        defineCardREST(this.app);
    }










    // Start the server and begin listening on the port provided
    // via the constructor.
    //
    // Executes callback when the server has begun listening
    public listen(callback: (port: number) => void): void {

        // Start listening on the httpServer...
        this.httpServer.listen(this.port, () => {

            // Now that we're listening, execute callback
            callback(this.port);
        });
    }
}