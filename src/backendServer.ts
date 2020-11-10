import express, { Application } from "express";
import bodyParser from "body-parser";
import { createServer, Server as HTTPServer } from "http";
import { defineUserREST } from "./userREST";
import { defineCardREST } from "./cardREST";
import { defineExpressRoutes } from "./expressRoutes";
import { defineExpressSessions } from "./expressSessions";

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
        this.setup();
        this.port = port;
    }

    // Create and configure any objects for this class
    private setup(): void {
        this.app = express();
        this.httpServer = createServer(this.app);
        
        this.configureApp();
    }

    // Specifically configure the Express server
    private configureApp(): void {

        // Implement body-parser to parse application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({ extended: false }))

        // Implement body-parser to parse application/json
        this.app.use(bodyParser.json());

        // Implement Express Session Store
        defineExpressSessions(this.app);

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
    public async listen(callback: (port: number) => void): Promise<void> {

        // Start listening on the httpServer...
        this.httpServer.listen(this.port, () => {

            // Now that we're listening, execute callback
            callback(this.port);
        });
    }
}