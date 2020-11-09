import { databaseWrapper } from "../../databaseWrapper";
import { card } from "../../card";
import { v4 } from "uuid";
import { generateRandomUserAccountSchema, generateRandomCardContent } from "./utilityMethods";
import { user } from "../../user";



describe("databaseWrapper.getCardBySlug()", () => {

    describe("Error Checking", () => {

        test("Expect error when undefined is passed in", async () => {
            await expect(databaseWrapper.getCardBySlug(undefined)).rejects.toThrowError("requestedCardSlug cannot be undefined");
        });

        test("Expect error when null is passed in", async () => {
            await expect(databaseWrapper.getCardBySlug(null)).rejects.toThrowError("requestedCardSlug cannot be null");
        });
    });

    describe("Expect null when passed", () => {

        test("empty string", async () => {
            const requestedCard: card = await databaseWrapper.getCardBySlug("");
            expect(requestedCard).toBe(null);
        });

        test("invalid slug", async () => {
            const requestedCard: card = await databaseWrapper.getCardBySlug(v4());
            expect(requestedCard).toBe(null);
        });

        test("valid slug on user without a card", async () => {
            // Create new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            const usersSlug = newUser.getAccountSchema().public.customURL;

            const requestedCard: card = await databaseWrapper.getCardBySlug(usersSlug);
            expect(requestedCard).toBe(null);


            // clean up
            await databaseWrapper.deleteUser(newUser.getUUID());
        });
    });

    describe("Get Card By Slug", () => {

        var createdUserID: string = undefined;
        var createdCardID: string = undefined;
        var createdCardSlug: string = undefined;

        beforeAll(async () => {
            // Create new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Create new card
            const newCardContent = generateRandomCardContent();
            const newCard: card = await databaseWrapper.createCard(newUser.getUUID(), newCardContent);

            createdUserID = newUser.getUUID();
            createdCardID = newCard.getID();
            createdCardSlug = newUser.getAccountSchema().public.customURL;
        });

        afterAll(async () => {
            await databaseWrapper.deleteCard(createdCardID);
            await databaseWrapper.deleteUser(createdUserID);
        });




        test("Expect returned card's slug to equal passed in slug", async () => {

            const requestedCard: card = await databaseWrapper.getCardBySlug(createdCardSlug);
            expect(requestedCard.getCardSchema().ownerInfo.customURL).toEqual(createdCardSlug);
        });

        test("Expect reference equality when called twice using the same slug", async () => {

            const requestedCard: card = await databaseWrapper.getCardBySlug(createdCardSlug);
            const requestedCardAgain: card = await databaseWrapper.getCardBySlug(createdCardSlug);
            expect(requestedCard).toBe(requestedCardAgain);
        });
    });
});