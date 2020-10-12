﻿import { userSchema } from "./interfaces/userSchema";
import { accountStatus } from "./enum/accountStatus";
import { savedCard } from "./interfaces/savedCard";
import { userAccountSchema } from "./interfaces/userAccountSchema";
import { PassThrough } from "stream";
import { databaseWrapper } from "./databaseWrapper";
import bcrypt from "bcrypt";

export class user {

    // User Schema
    private uuid: string;
    private currentAccountStatus: accountStatus;
    private verificationCode: string;
    private cardID: string;
    private savedCards: Map<string, savedCard>;

    // User Account Schema
    private email: string;
    private passwordHash: string;
    private firstName: string;
    private lastName: string;
    private customURL: string;
    private profilePictureURL: string;





    //
    //  Construction / Initialization
    //

    constructor(newUserSchema: userSchema) {
        this.initializeInternalUserSchema(newUserSchema);
    }

    // Populate internal variables related to userSchema
    private initializeInternalUserSchema(newUserSchema: userSchema): void {
        this.uuid = newUserSchema.uuid;
        this.currentAccountStatus = newUserSchema.currentAccountStatus;
        this.verificationCode = newUserSchema.verificationCode;
        this.cardID = newUserSchema.cardID;

        this.savedCards = new Map<string, savedCard>();
        for (const card of newUserSchema.savedCards) {
            this.savedCards.set(card.cardID, card);
        }

        this.initializeInternalUserAccountSchema(newUserSchema.userAccount);
    }

    // Populate internal variables related to userAccountSchema
    private initializeInternalUserAccountSchema(newUserAccountSchema: userAccountSchema): void {
        this.email = newUserAccountSchema.email;
        this.passwordHash = newUserAccountSchema.passwordHash;
        this.firstName = newUserAccountSchema.firstName;
        this.lastName = newUserAccountSchema.lastName;
        this.customURL = newUserAccountSchema.customURL;
        this.profilePictureURL = newUserAccountSchema.profilePictureURL;
    }






    //
    //  Getters
    //

    public getUUID(): string {
        return this.uuid;
    }

    public getAccountSchema(): userAccountSchema {
        const output: userAccountSchema = {
            email: this.email,
            passwordHash: this.passwordHash,
            firstName: this.firstName,
            lastName: this.lastName,
            customURL: this.customURL,
            profilePictureURL: this.profilePictureURL
        }

        return output;
    }

    public getCardID(): string {
        return this.cardID;
    }

    public getSavedCard(savedCardID: string): savedCard {
        return this.savedCards.get(savedCardID);
    }

    public getAllSavedCards(): savedCard[] {
        return Array.from(this.savedCards.values());
    }

    public getAccountStatus(): accountStatus {
        return this.currentAccountStatus;
    }




    //
    //  Setters
    //

    public setCardID(newCardID: string): void {

        // Set the cardID in memory
        this.cardID = newCardID;

        // Update the user in the database
        databaseWrapper.runMongoOperation(async (database) => {

            // Get user collection from database
            var userCollection = await database.collection("users");

            // Create a filter indicating that we want THIS user
            const filter = { uuid: this.getUUID() }

            // Create options explicitly saying that we do NOT want to upsert (create new data if it doesn't exist)
            const options = { upsert: false }

            // Create the update data, saying that we want to set the cardID
            const updateData = {
                $set: {
                    cardID: newCardID
                }
            };

            // Apply update operation!
            const updateResult = await userCollection.updateOne(filter, updateData, options);


            // If we wanted to check if it actually updated something at this point,
            // we would check to see if updateResult.modifiedCount is greater than zero!
        });
    }

    public setAccountStatus(newAccountStatus: accountStatus): void {
        // Set the account status in memory
        this.currentAccountStatus = newAccountStatus;

        // Update the user in the database
        databaseWrapper.runMongoOperation(async (database) => {

            // Get user collection from database
            var userCollection = await database.collection("users");

            // Create a filter indicating that we want THIS user
            const filter = { uuid: this.getUUID() }

            // Create options explicitly saying that we do NOT want to upsert (create new data if it doesn't exist)
            const options = { upsert: false }

            // Create the update data, saying that we want to set the cardID
            const updateData = {
                $set: {
                    currentAccountStatus: newAccountStatus
                }
            };

            // Apply update operation!
            const updateResult = await userCollection.updateOne(filter, updateData, options);


            // If we wanted to check if it actually updated something at this point,
            // we would check to see if updateResult.modifiedCount is greater than zero!
        });
    }




    //
    //  Utility Methods
    //

    public tryPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.passwordHash);
    }

    public addSavedCard(cardToAddID: string): savedCard {

        // Construct savedCard interface
        const newSavedCard: savedCard = {
            cardID: cardToAddID,
            favorited: false,
            memo: ""
        }

        // Add to data structure in memory
        this.savedCards.set(cardToAddID, newSavedCard);

        // Add to the array in the database
        databaseWrapper.runMongoOperation(async (database) => {

            // Get user collection from database
            var userCollection = await database.collection("users");

            // Create a filter indicating that we want THIS user
            const filter = { uuid: this.getUUID() }

            // Create options explicitly saying that we do NOT want to upsert (create new data if it doesn't exist)
            const options = { upsert: false }

            // Create the update data, saying that we want to push the new savedCard to the savedCard array
            const updateData = {
                $push: {
                    savedCards: newSavedCard
                }
            };

            // Apply push operation!
            const pushResult = await userCollection.updateOne(filter, updateData, options);


            // If we wanted to check if it actually updated something at this point,
            // we would check to see if pushResult.modifiedCount is greater than zero!
        });



        return newSavedCard;
    }

    public removeSavedCard(cardToRemoveID: string): boolean {

        // Remove from data structure in memory
        const result = this.savedCards.delete(cardToRemoveID);

        // Remove from the array in the database
        databaseWrapper.runMongoOperation(async (database) => {

            // Get user collection from database
            var userCollection = await database.collection("users");

            // Create a filter indicating that we want THIS user
            const filter = { uuid: this.getUUID() }

            // Create options explicitly saying that we do NOT want to upsert (create new data if it doesn't exist)
            const options = { upsert: false }

            // Create the update data, saying that we want to remove a savedCard from the array by it's ID
            const updateData = {
                $pull: {
                    savedCards: { cardID: cardToRemoveID }
                }
            };

            // Apply push operation!
            const pushResult = await userCollection.updateOne(filter, updateData, options);


            // If we wanted to check if it actually updated something at this point,
            // we would check to see if pushResult.modifiedCount is greater than zero!
        });



        return result;
    }

    public updateAccountSchema(accountSchemaUpdate: userAccountSchema): void {
        // Update the account schema in memory
        this.updateInternalAccountSchema(accountSchemaUpdate);

        // Update the user in the database
        databaseWrapper.runMongoOperation(async (database) => {

            // Get user collection from database
            var userCollection = await database.collection("users");

            // Create a filter indicating that we want THIS user
            const filter = { uuid: this.getUUID() }

            // Create options explicitly saying that we do NOT want to upsert (create new data if it doesn't exist)
            const options = { upsert: false }

            // Create the update data, saying that we want to update user account data
            const updateData = {
                $set: {
                    userAccount: this.createJsonAccountUpdateData(accountSchemaUpdate)
                }
            };

            // Apply update operation!
            const updateResult = await userCollection.updateOne(filter, updateData, options);


            // If we wanted to check if it actually updated something at this point,
            // we would check to see if updateResult.modifiedCount is greater than zero!
        });
    }









    //
    //  Helper Methods
    //

    private updateInternalAccountSchema(accountSchemaUpdate: userAccountSchema): void {
        if (accountSchemaUpdate.email != null) {
            this.email = accountSchemaUpdate.email;
        }

        if (accountSchemaUpdate.passwordHash != null) {
            this.passwordHash = accountSchemaUpdate.passwordHash;
        }

        if (accountSchemaUpdate.firstName != null) {
            this.firstName = accountSchemaUpdate.firstName;
        }

        if (accountSchemaUpdate.lastName != null) {
            this.lastName = accountSchemaUpdate.lastName;
        }

        if (accountSchemaUpdate.customURL != null) {
            this.customURL = accountSchemaUpdate.customURL;
        }

        if (accountSchemaUpdate.profilePictureURL != null) {
            this.profilePictureURL = accountSchemaUpdate.profilePictureURL;
        }
    }

    private createJsonAccountUpdateData(accountSchemaUpdate: userAccountSchema): any {
        var output: Record<string, any> = {};

        if (accountSchemaUpdate.email != null) {
            output.email = accountSchemaUpdate.email;
        }

        if (accountSchemaUpdate.passwordHash != null) {
            output.passwordHash = accountSchemaUpdate.passwordHash;
        }

        if (accountSchemaUpdate.firstName != null) {
            output.firstName = accountSchemaUpdate.firstName;
        }

        if (accountSchemaUpdate.lastName != null) {
            output.lastName = accountSchemaUpdate.lastName;
        }

        if (accountSchemaUpdate.customURL != null) {
            output.customURL = accountSchemaUpdate.customURL;
        }

        if (accountSchemaUpdate.profilePictureURL != null) {
            output.profilePictureURL = accountSchemaUpdate.profilePictureURL;
        }

        return output;
    }
}