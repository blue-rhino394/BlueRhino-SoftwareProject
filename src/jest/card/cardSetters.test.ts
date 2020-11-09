import { card } from "../../card";
import { databaseWrapper } from "../../databaseWrapper";
import { user } from "../../user";
import { userAccountSchema } from "../../interfaces/userAccountSchema";
import { cardSchema } from "../../interfaces/cardSchema";
import { cardContent } from "../../interfaces/cardContent";
import { cardPropertyElement } from "../../interfaces/cardPropertyElement";
import { cardLayout } from "../../interfaces/cardLayout";
import { v4 } from "uuid";

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
        email: v4(),
        passwordHash: "blablabla",
        public: {
            firstName: "Test",
            lastName: "User",
            customURL: v4(),
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








describe("Set Card Testing", () => {

    //
    //  Settings
    //

    // The card to test with
    var testCard: card = undefined;
    var testCard2: card = undefined;

    // The content used to create it
    const content: cardContent = {
        published: false,
        tags: [],
        socialMediaLinks: [],
        cardProperties: [],
        layout: {
            background: "#c7ddfd",
            fontColor: "#05152f"
        }
    }

    const newcardSchema: cardSchema = {
        cardID: "003261564641",
        ownerID: "0032610452564642",
        ownerInfo: {
            firstName: "Test",
            lastName: "testing",
            customURL: "https://brhino.org/testing",
            profilePictureURL: "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
        },
        content: {
            published: true,
            tags: [],
            socialMediaLinks: ["https://instgram.com"],
            cardProperties: [],
            layout: {
                background: "#c7ddff",
                fontColor: "#05152e"
            }
        },
        stats: {
            cardViews: [],
            saves: [],
            favorites: [],
            memos: [],
            social: []
        }
    }



    //
    //  Setup / Teardown
    //

    // Create testCard before tests run
    beforeEach(async () => {
        testCard = await databaseWrapper.createCard(testUser.getUUID(), content);

        // If we couldn't create a card for some reason...
        if (!testCard) {
            throw new Error("Failed to create testing card...");
        }

        testCard2 = new card(newcardSchema);
    });

    // Destroy testCard after tests finish
    afterEach(async () => {
        await databaseWrapper.deleteCard(testUser.getCardID());
        await testUser.setCardID("");
    });



    //
    //  Tests
    //

    describe("Test setCardContent()", () => {
        test("Expect error when undefined is passed in", async () => {
            await expect(testCard.setCardContent(undefined)).rejects.toThrow(new Error("Cannot pass undefined"));
        });

        test("Expect error when null is passed in", async () => {
            await expect(testCard.setCardContent(null)).rejects.toThrow(new Error("Cannot pass null"));
        });

        test("Ensure that setting only published works", async () => {
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

        test("Ensure that setting only tags works", async () => {
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

        test("Ensure that setting only socialMediaLinks works", async () => {
            const newSocial: string[] = ["https://instgram.com"];

            // Set only Social Media Links
            await testCard.setCardContent({
                published: undefined,
                tags: undefined,
                socialMediaLinks: newSocial,
                cardProperties: undefined,
                layout: undefined
            });

            const recievedSocial = testCard.getCardContent().socialMediaLinks;
            expect(recievedSocial).toEqual(newSocial);
        });

        test("Ensure that setting only cardProperties works", async () => {
            const newProperties: cardPropertyElement[] = [
                { key: "bla bla key", value: "bla value" },
                { key: "another key", value: "bla value" },
                { key: "wow, three keys?", value: "THIS VALUE is cool" }
            ];

            // Set only card porperties
            await testCard.setCardContent({
                published: undefined,
                tags: undefined,
                socialMediaLinks: undefined,
                cardProperties: newProperties,
                layout: undefined
            });

            const recievedProperties = testCard.getCardContent().cardProperties;
            expect(recievedProperties).toEqual(newProperties);
        });

        test("Ensure that setting only layout works", async () => {
            const newlayout: cardLayout =
            {
                background: "#c7ddff",
                fontColor: "#05152e"
            };

            // Set only layout
            await testCard.setCardContent({
                published: undefined,
                tags: undefined,
                socialMediaLinks: undefined,
                cardProperties: undefined,
                layout: newlayout
            });

            const recievedlayout = testCard.getCardContent().layout;
            expect(recievedlayout).toEqual(newlayout);
        });

        test("Ensure that setting multiple fields for CardContent works", async () => {
            const newlayout: cardLayout = { background: "#c7ddff", fontColor: "#05152e" };

            const newSocial: string[] = ["https://instgram.com"];

            const currentPublished = testCard.getCardContent().published;
            const newPublishedValue = !currentPublished;

            // Set multiple fields
            await testCard.setCardContent({
                published: newPublishedValue,
                tags: undefined,
                socialMediaLinks: newSocial,
                cardProperties: undefined,
                layout: newlayout
            });

            expect(testCard.getCardContent()).toEqual(testCard2.getCardContent());
        });

    });

    describe("Test setOwnerInfo()", () => {
        test("Expect error when undefined is passed in", async () => {
            await expect(testCard.setOwnerInfo(undefined)).rejects.toThrow(new Error("Cannot pass undefined"));
        });

        test("Expect error when null is passed in", async () => {
            await expect(testCard.setOwnerInfo(null)).rejects.toThrow(new Error("Cannot pass null"));
        });

        test("Ensure that setting firstName works", async () => {
            const newfirstName: string = "testing";

            // Set only firstname
            await testCard.setOwnerInfo({
                firstName: newfirstName,
                lastName: undefined,
                customURL: undefined,
                profilePictureURL: undefined
            });

            const recievedfirstName = testCard.getCardSchema().ownerInfo.firstName;
            expect(recievedfirstName).toEqual(newfirstName);
        });

        test("Ensure that setting lastName works", async () => {
            const newlastName: string = "testing";

            // Set only lastname
            await testCard.setOwnerInfo({
                firstName: undefined,
                lastName: newlastName,
                customURL: undefined,
                profilePictureURL: undefined
            });

            const recievedlastName = testCard.getCardSchema().ownerInfo.lastName;
            expect(recievedlastName).toEqual(newlastName);
        });

        test("Ensure that setting customURL works", async () => {
            const newcustomURL: string = "https://brhino.org/testing";

            // Set only customURL
            await testCard.setOwnerInfo({
                firstName: undefined,
                lastName: undefined,
                customURL: newcustomURL,
                profilePictureURL: undefined
            });

            const recievedcustomURL = testCard.getCardSchema().ownerInfo.customURL;
            expect(recievedcustomURL).toEqual(newcustomURL);
        });

        test("Ensure that setting profilePictureURL works", async () => {
            const newprofileURL: string = "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6";

            // Set only ProfilePictureURL
            await testCard.setOwnerInfo({
                firstName: undefined,
                lastName: undefined,
                customURL: undefined,
                profilePictureURL: newprofileURL
            });

            const recievedprofileURL = testCard.getCardSchema().ownerInfo.profilePictureURL;
            expect(recievedprofileURL).toEqual(newprofileURL);
        });

        test("Ensure that setting multiple fields for OwnerInfo works", async () => {
            const newprofileURL: string = "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6";
            const newcustomURL: string = "https://brhino.org/testing";
            const newlastName: string = "testing";

            // Set multiple fields
            await testCard.setOwnerInfo({
                firstName: undefined,
                lastName: newlastName,
                customURL: newcustomURL,
                profilePictureURL: newprofileURL
            });

            expect(testCard.getCardSchema().ownerInfo).toEqual(testCard2.getCardSchema().ownerInfo);
        });

    });

});