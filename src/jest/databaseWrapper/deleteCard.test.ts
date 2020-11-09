import { databaseWrapper } from "../../databaseWrapper";
import { v4 } from "uuid";
import { generateRandomUserAccountSchema, generateRandomCardContent } from "./utilityMethods";
import { user } from "../../user";
import { card } from "../../card";


describe("databaseWrapper.deleteCard()", () => {

    describe("Error Checking", () => {

        test("Expect error when undefined is passed in", async () => {
            await expect(databaseWrapper.deleteCard(undefined)).rejects.toThrowError("cardIDToDelete cannot be undefined");
        });

        test("Expect error when null is passed in", async () => {
            await expect(databaseWrapper.deleteCard(null)).rejects.toThrowError("cardIDToDelete cannot be null");
        });
    });

    describe("Expect 'No card by this ID' when passed", () => {

        const expectedMessage = "No card by this ID";

        test("empty string", async () => {
            const message: string = await databaseWrapper.deleteCard("");
            expect(message).toBe(expectedMessage);
        });

        test("non-existent cardID", async () => {
            const message: string = await databaseWrapper.deleteCard(v4());
            expect(message).toBe(expectedMessage);
        });

        test("previously deleted cardID", async () => {

            // Create a new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Create a new card
            const newCardContent = generateRandomCardContent();
            const newCard: card = await databaseWrapper.createCard(newUser.getUUID(), newCardContent);

            const newCardsID: string = newCard.getID();


            // Remove new card
            await databaseWrapper.deleteCard(newCardsID);

            // Try to remove that card again
            const message: string = await databaseWrapper.deleteCard(newCardsID);
            expect(message).toBe(expectedMessage);




            // clean up
            await databaseWrapper.deleteUser(newUser.getUUID());
        });
    });

    describe("Delete Card", () => {

        test("Expect empty string when a valid existing cardID is used", async () => {

            // Create a new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Create a new card
            const newCardContent = generateRandomCardContent();
            const newCard: card = await databaseWrapper.createCard(newUser.getUUID(), newCardContent);

            const message: string = await databaseWrapper.deleteCard(newCard.getID());
            expect(message).toBe("");



            // clean up
            await databaseWrapper.deleteUser(newUser.getUUID());
        });
    });
});