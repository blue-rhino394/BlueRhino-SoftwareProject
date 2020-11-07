import { databaseWrapper } from "../../databaseWrapper";
import { card } from "../../card";
import { v4 } from "uuid";
import { generateRandomUserAccountSchema, generateRandomCardContent } from "./utilityMethods";
import { user } from "../../user";



describe("databaseWrapper.getCard()", () => {

    describe("Error Checking", () => {

        test("Expect error when undefined is passed in", async () => {
            await expect(databaseWrapper.getCard(undefined)).rejects.toThrowError("requestedCardID cannot be undefined");
        });

        test("Expect error when null is passed in", async () => {
            await expect(databaseWrapper.getCard(null)).rejects.toThrowError("requestedCardID cannot be null");
        });
    });

    describe("Expect null when passed", () => {

        test("empty string", async () => {
            const requestedCard: card = await databaseWrapper.getCard("");
            expect(requestedCard).toBe(null);
        });

        test("invalid cardID", async () => {
            const requestedCard: card = await databaseWrapper.getCard(v4());
            expect(requestedCard).toBe(null);
        });
    });

    describe("Get Card", () => {

        var createdUserID: string = undefined;
        var createdCardID: string = undefined;

        beforeAll(async () => {
            // Create new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Create new card
            const newCardContent = generateRandomCardContent();
            const newCard: card = await databaseWrapper.createCard(newUser.getUUID(), newCardContent);

            createdUserID = newUser.getUUID();
            createdCardID = newCard.getID();
        });

        afterAll(async () => {
            await databaseWrapper.deleteCard(createdCardID);
            await databaseWrapper.deleteUser(createdUserID);
        });




        test("Expect returned card's ID to equal passed in ID", async () => {

            const requestedCard: card = await databaseWrapper.getCard(createdCardID);
            expect(requestedCard.getID()).toEqual(createdCardID);
        });

        test("Expect reference equality when called twice using the same ID", async () => {

            const requestedCard: card = await databaseWrapper.getCard(createdCardID);
            const requestedCardAgain: card = await databaseWrapper.getCard(createdCardID);
            expect(requestedCard).toBe(requestedCardAgain);
        });
    });
});