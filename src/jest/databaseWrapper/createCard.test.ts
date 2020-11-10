import { databaseWrapper } from "../../databaseWrapper";
import { generateRandomCardContent, generateRandomUserAccountSchema } from "./utilityMethods";
import { v4 } from "uuid";
import { card } from "../../card";
import { user } from "../../user";
import { unaryExpression } from "@babel/types";
import { cardPropertyElement } from "../../interfaces/cardPropertyElement";



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
            await databaseWrapper.deleteCard(newCard.getID());
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

        test("Expect return result's getID to be populated", async () => {

            // Create a new user to test with
            const newAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newAccountSchema);

            // Create a new card
            const newCardContent = generateRandomCardContent();
            const newCard: card = await databaseWrapper.createCard(newUser.getUUID(), newCardContent);


            expect(newCard.getID()).toBeTruthy();


            // clean up
            await databaseWrapper.deleteCard(newCard.getID());
            await databaseWrapper.deleteUser(newUser.getUUID());
        });
    });

    describe("XSS Prevention Checking", () => {

        var testUser: user = undefined;


        beforeAll(async () => {

            // Create a new user to test with
            const newAccountSchema = generateRandomUserAccountSchema();
            testUser = await databaseWrapper.createUser(newAccountSchema);
        });

        afterAll(async () => {

            await databaseWrapper.deleteUser(testUser.getUUID());
        });



        test("Expect XSS to be removed from tags", async () => {

            // Create new card content and put XSS in the tags
            const newCardContent = generateRandomCardContent();
            newCardContent.tags.push("<script>alert('HEY YOU!');</script>");
            newCardContent.tags.push("blabla<script>alert('This is XSS...');</script>");

            // Create a new card
            const newCard: card = await databaseWrapper.createCard(testUser.getUUID(), newCardContent);

            // Get the new card's tags and loop through them,
            // expecting them not to have the script tag.
            const newCardsTags = newCard.getCardContent().tags;
            for (const tag of newCardsTags) {

                expect(tag).not.toContain("<script>");
                expect(tag).not.toContain("</script>");
            }


            // clean up
            await databaseWrapper.deleteCard(newCard.getID()); 
            await testUser.setCardID("");
        });

        test("Expect XSS to be removed from socialMediaLinks", async () => {

            // Create new card content and put XSS in the socialMediaLinks
            const newCardContent = generateRandomCardContent();
            newCardContent.socialMediaLinks.push("<script>alert('HEY YOU!');</script>");
            newCardContent.socialMediaLinks.push("blabla<script>alert('This is XSS...');</script>");

            // Create a new card
            const newCard: card = await databaseWrapper.createCard(testUser.getUUID(), newCardContent);

            // Get the new card's socialMediaLinks and loop through them,
            // expecting them not to have the script tag.
            const newCardsSocialMediaLinks = newCard.getCardContent().socialMediaLinks;
            for (const link of newCardsSocialMediaLinks) {

                expect(link).not.toContain("<script>");
                expect(link).not.toContain("</script>");
            }


            // clean up
            await databaseWrapper.deleteCard(newCard.getID());
            await testUser.setCardID("");
        });

        test("Expect XSS to be removed from cardProperties", async () => {

            // Create new card content and put XSS in the cardProperties
            const newCardContent = generateRandomCardContent();

            const badProperty1: cardPropertyElement = {
                key: "<script>alert('THIS KEY IS ATTACKING YOU!!!');</script>",
                value: "<script>alert('Man this value is awful sus');</script>"
            };

            const badProperty2: cardPropertyElement = {
                key: "blabla<script>alert('Evil.. EVIL!!');</script>d",
                value: "garbage<script>   alert('No value... JUST KIDDING. XSS VALUE!!');   </script>"
            };

            newCardContent.cardProperties.push(badProperty1);
            newCardContent.cardProperties.push(badProperty2);



            // Create a new card
            const newCard: card = await databaseWrapper.createCard(testUser.getUUID(), newCardContent);

            // Get the new card's cardProperties and loop through them,
            // expecting them not to have the script tag.
            const newCardsCardProperties = newCard.getCardContent().cardProperties;
            for (const cardProp of newCardsCardProperties) {

                expect(cardProp.key).not.toContain("<script>");
                expect(cardProp.key).not.toContain("</script>");

                expect(cardProp.value).not.toContain("<script>");
                expect(cardProp.value).not.toContain("</script>");
            }


            // clean up
            await databaseWrapper.deleteCard(newCard.getID());
            await testUser.setCardID("");
        });

        test("Expect XSS to be removed from layout.background", async () => {

            // Create new card content and put XSS in the layout.background
            const newCardContent = generateRandomCardContent();
            newCardContent.layout.background = "<script>alert('HEY YOU!');</script>";

            // Create a new card
            const newCard: card = await databaseWrapper.createCard(testUser.getUUID(), newCardContent);

            // Get the new card's layout.background
            const newCardsLayoutBackground = newCard.getCardContent().layout.background;



            expect(newCardsLayoutBackground).not.toContain("<script>");
            expect(newCardsLayoutBackground).not.toContain("</script>");


            // clean up
            await databaseWrapper.deleteCard(newCard.getID());
            await testUser.setCardID("");
        });

        test("Expect XSS to be removed from layout.fontColor", async () => {

            // Create new card content and put XSS in the layout.fontColor
            const newCardContent = generateRandomCardContent();
            newCardContent.layout.fontColor = "<script>alert('HEY YOU!');</script>";

            // Create a new card
            const newCard: card = await databaseWrapper.createCard(testUser.getUUID(), newCardContent);

            // Get the new card's layout.fontColor
            const newCardsLayoutFontColor = newCard.getCardContent().layout.fontColor;



            expect(newCardsLayoutFontColor).not.toContain("<script>");
            expect(newCardsLayoutFontColor).not.toContain("</script>");


            // clean up
            await databaseWrapper.deleteCard(newCard.getID());
            await testUser.setCardID("");
        });
    });
});