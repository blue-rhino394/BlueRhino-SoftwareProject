import { card } from "../card";
import { databaseWrapper } from "../databaseWrapper";
import { user } from "../user";
import { userAccountSchema } from "../interfaces/userAccountSchema";
import { cardSchema } from "../interfaces/cardSchema";
import { cardContent } from "../interfaces/cardContent";

    // The user to test with
    //      POPULATE IN BEFORE ALL
    //      REMOVED IN AFTER ALL
    var testUser: user = undefined;


    // Before any tests execute...
    beforeAll(async () => {

        //
        //  Register test user
        //

        // Create user account schema
        const newUserAccount: userAccountSchema = {
            email: "fakeemailthatshouldneverexist@brhino.org",
            passwordHash: "blablabla",
            public: {
                firstName: "Test",
                lastName: "User",
                customURL: "fakeemailthatshouldneverexistslug",
                profilePictureURL: "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
            }
        }

        // Actually register the test user
        testUser = await databaseWrapper.createUser(newUserAccount);

        // If we failed to create a testing user...
        if (!testUser) {
            throw new Error("Failed to create testing user...");
        }
    });

    afterAll(async () => {

        //
        //  Remove Test User
        //

        // Remove the test user from the database
        await databaseWrapper.deleteUser(testUser.getUUID());
    });







    describe("Card Testing 1", () => {

        //
        //  Settings
        //

        // The card to test with
        var testCard: card = undefined;

        // The content used to create it
        const content: cardContent = {
            published: false,
            tags: ["Testing Card", "Super Cool"],
            socialMediaLinks: [],
            cardProperties: [],
            layout: {
                background: "#c7ddff",
                fontColor: "#05152e"
            }
        }



        //
        //  Setup / Teardown
        //

        // Create testCard before tests run
        beforeAll(async () => {
            testCard = await databaseWrapper.createCard(testUser.getUUID(), content);

            // If we couldn't create a card for some reason...
            if (!testCard) {
                throw new Error("Failed to create testing card...");
            }
        });

        // Destroy testCard after tests finish
        afterAll(async () => {
            await databaseWrapper.deleteCard(testUser.getCardID());
            await testUser.setCardID("");
        });



        //
        //  Tests
        //


        test("Ensure getID() returns something not empty", async () => {
            expect(testCard.getID()).toBeTruthy();
        });

        describe("Test setContent", () => {

            test("Try setting published", async () => {
                const currentPublished = testCard.getCardContent().published;
                const newPublishedValue = !currentPublished;

                // Set only published
                await testCard.setCardContent({
                    published: newPublishedValue,
                    tags: undefined,
                    socialMediaLinks: undefined,
                    cardProperties: undefined,
                    layout: undefined
                });


                const recievedPublishedValue = testCard.getCardContent().published;
                expect(recievedPublishedValue).toEqual(newPublishedValue);
            });

            test("Try setting tags", async () => {
                const newTags: string[] = ["New Tags", "Way Cooler To Test"];

                // Set only tags
                await testCard.setCardContent({
                    published: undefined,
                    tags: newTags,
                    socialMediaLinks: undefined,
                    cardProperties: undefined,
                    layout: undefined
                });

                const recievedTags = testCard.getCardContent().tags;
                expect(recievedTags).toEqual(newTags);
            });
        });
    });





