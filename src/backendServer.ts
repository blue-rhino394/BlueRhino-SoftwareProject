import express, { Application } from "express";
import { createServer, Server as HTTPServer } from "http";
import { defineUserREST } from "./userREST";
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

        this.configureApp();
    }

    // Specifically configure the Express server
    private configureApp(): void {
        // Publish content in public folder
        this.app.use(express.static(path.join(__dirname, '../public')));

        // Implement User REST API
        defineUserREST(this.app);
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