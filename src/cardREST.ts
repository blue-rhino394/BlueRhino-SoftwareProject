import express, { Application } from "express";

export function defineCardREST(app: Application): void {

    app.post('/api/get-card', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: any = undefined;
        res.send(responseData);
    });

    app.post('/api/set-card', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: any = undefined;
        res.send(responseData);
    });

    app.post('/api/delete-card', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: any = undefined;
        res.send(responseData);
    });

    app.post('/api/get-saved-cards', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: any = undefined;
        res.send(responseData);
    });

    app.post('/api/toggle-save', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: any = undefined;
        res.send(responseData);
    });

    app.post('/api/toggle-favorite', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: any = undefined;
        res.send(responseData);
    });

    app.post('/api/set-memo', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: any = undefined;
        res.send(responseData);
    });

    app.post('/api/search-card', (req, res) => {

        // TODO - IMPLEMENT!

        // Get dummy data
        const responseData: any = undefined;
        res.send(responseData);
    });
}