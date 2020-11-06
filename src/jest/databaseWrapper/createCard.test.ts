import { databaseWrapper } from "../../databaseWrapper";
import { generateRandomCardContent, generateRandomUserAccountSchema } from "./utilityMethods";
import { v4 } from "uuid";
import { card } from "../../card";
import { user } from "../../user";



describe("databaseWrapper.createCard()", () => {

    describe("Error Checking", () => {

        test("Expect error when undefined is passed in for cardOwnerID", async () => {
            const randomCardContent = generateRandomCardContent();
            await expect(databaseWrapper.createCard(undefined, randomCardContent)).rejects.toThrowError("cardOwnerID cannot be undefined");
        });

        test("Expect error when null is passed in for cardOwnerID", async () => {
            const randomCardContent = generateRandomCardContent();
            await expect(databaseWrapper.createCard(null, randomCardContent)).rejects.toThrowError("cardOwnerID cannot be null");
        });

        test("Expect error when empty string is passed in for cardOwnerID", async () => {
            const randomCardContent = generateRandomCardContent();
            await expect(databaseWrapper.createCard("", randomCardContent)).rejects.toThrowError("cardOwnerID cannot be empty");
        });

        test("Expect error when undefined is passed in for newContent", async () => {
            const randomOwnerID = v4();
            await expect(databaseWrapper.createCard(randomOwnerID, undefined)).rejects.toThrowError("newContent cannot be undefined");
        });

        test("Expect error when null is passed in for newContent", async () => {
            const randomOwnerID = v4();
            await expect(databaseWrapper.createCard(randomOwnerID, null)).rejects.toThrowError("newContent cannot be null");
        });

        describe("Expect error when newContent.tags is", () => {

            const expectedMessage = "newContent.tags cannot be falsy";

            const ownerID = v4();
            const randomCardContent = generateRandomCardContent();

            test("undefined", async () => {
                randomCardContent.tags = undefined;
                await expect(databaseWrapper.createCard(ownerID, randomCardContent)).rejects.toThrowError(expectedMessage);
            });

            test("null", async () => {
                randomCardContent.tags = null;
                await expect(databaseWrapper.createCard(ownerID, randomCardContent)).rejects.toThrowError(expectedMessage);
            });
        });

        describe("Expect error when newContent.socialMediaLinks is", () => {

            const expectedMessage = "newContent.socialMediaLinks cannot be falsy";

            const ownerID = v4();
            const randomCardContent = generateRandomCardContent();

            test("undefined", async () => {
                randomCardContent.socialMediaLinks = undefined;
                await expect(databaseWrapper.createCard(ownerID, randomCardContent)).rejects.toThrowError(expectedMessage);
            });

            test("null", async () => {
                randomCardContent.socialMediaLinks = null;
                await expect(databaseWrapper.createCard(ownerID, randomCardContent)).rejects.toThrowError(expectedMessage);
            });
        });

        describe("Expect error when newContent.cardProperties is", () => {

            const expectedMessage = "newContent.cardProperties cannot be falsy";

            const ownerID = v4();
            const randomCardContent = generateRandomCardContent();

            test("undefined", async () => {
                randomCardContent.cardProperties = undefined;
                await expect(databaseWrapper.createCard(ownerID, randomCardContent)).rejects.toThrowError(expectedMessage);
            });

            test("null", async () => {
                randomCardContent.cardProperties = null;
                await expect(databaseWrapper.createCard(ownerID, randomCardContent)).rejects.toThrowError(expectedMessage);
            });
        });

        describe("Expect error when newContent.layout is", () => {

            const expectedMessage = "newContent.layout cannot be falsy";

            const ownerID = v4();
            const randomCardContent = generateRandomCardContent();

            test("undefined", async () => {
                randomCardContent.layout = undefined;
                await expect(databaseWrapper.createCard(ownerID, randomCardContent)).rejects.toThrowError(expectedMessage);
            });

            test("null", async () => {
                randomCardContent.layout = null;
                await expect(databaseWrapper.createCard(ownerID, randomCardContent)).rejects.toThrowError(expectedMessage);
            });
        });

        describe("Expect error when newContent.layout.background is", () => {

            const ownerID = v4();
            const randomCardContent = generateRandomCardContent();

            test("undefined", async () => {
                const expectedMessage = "newContent.layout.background cannot be undefined";
                randomCardContent.layout.background = undefined;
                await expect(databaseWrapper.createCard(ownerID, randomCardContent)).rejects.toThrowError(expectedMessage);
            });

            test("null", async () => {
                const expectedMessage = "newContent.layout.background cannot be null";
                randomCardContent.layout.background = null;
                await expect(databaseWrapper.createCard(ownerID, randomCardContent)).rejects.toThrowError(expectedMessage);
            });
        });

        describe("Expect error when newContent.layout.fontColor is", () => {

            const ownerID = v4();
            const randomCardContent = generateRandomCardContent();

            test("undefined", async () => {
                const expectedMessage = "newContent.layout.fontColor cannot be undefined";
                randomCardContent.layout.fontColor = undefined;
                await expect(databaseWrapper.createCard(ownerID, randomCardContent)).rejects.toThrowError(expectedMessage);
            });

            test("null", async () => {
                const expectedMessage = "newContent.layout.fontColor cannot be null";
                randomCardContent.layout.fontColor = null;
                await expect(databaseWrapper.createCard(ownerID, randomCardContent)).rejects.toThrowError(expectedMessage);
            });
        });
    });

    describe("Expect Null", () => {

        test("Expect null when invalid UUID is passed in for cardOwnerID", async () => {
            const invalidUUID = v4();
            const randomCardContent = generateRandomCardContent();
            const newCard: card = await databaseWrapper.createCard(invalidUUID, randomCardContent);

            expect(newCard).toBe(null);
        });

        test("Expect null when a UUID is passed in resolving to a user that already has a card", async () => {

            // Create new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Create a new card for the user
            const newCardContent = generateRandomCardContent();
            const newCard: card = await databaseWrapper.createCard(newUser.getUUID(), newCardContent);

            // Assign it to the user
            await newUser.setCardID(newCard.getID());


            // Try to create another new card for the user
            const anotherNewCardContent = generateRandomCardContent();
            const anotherNewCard: card = await databaseWrapper.createCard(newUser.getUUID(), anotherNewCardContent);


            expect(anotherNewCard).toBe(null);

            // clean up
            await databaseWrapper.deleteUser(newUser.getUUID());
        });
    });

    describe("Create Card", () => {

        test("Expect return result's getCardContent() to equal cardContent used to create it", async () => {

            // Create a new user to test with
            const newAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newAccountSchema);

            // Create a new card
            const newCardContent = generateRandomCardContent();
            const newCard: card = await databaseWrapper.createCard(newUser.getUUID(), newCardContent);


            expect(newCard.getCardContent()).toEqual(newCardContent);


            // clean up
            await databaseWrapper.deleteCard(newCard.getID());
            await databaseWrapper.deleteUser(newUser.getUUID());
        });
    });

    describe("XSS Prevention Checking", () => {



        beforeAll(async () => {

        });

        afterAll(async () => {

        });



        test("Expect XSS to be removed from tags", async () => {


        });
    });
});