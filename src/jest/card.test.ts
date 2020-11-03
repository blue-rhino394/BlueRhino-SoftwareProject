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

describe("Get Testing Constructor Input Schema", () => {
    //
    //
    //
    var testcard: card = undefined;

    const newcardSchema: cardSchema = {
        cardID: "003261564641",
        ownerID: "0032610452564642",
        ownerInfo: {
            firstName: "Test",
            lastName: "User",
            customURL: "fakeemailthatshouldneverexistslug",
            profilePictureURL: "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
        },
        content: {
            published: false,
            tags: ["Testing Card", "Super Cool"],
            socialMediaLinks: [],
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

    beforeAll(async () => {
        testcard = new card(newcardSchema);
    });

    test("Ensure that getID is equal to cardID of constructor's input schem", async () => {
        expect(testcard.getID()).toEqual(newcardSchema.cardID);
    });

    test("Ensure getOwnerUUID() is equal to ownerID of constructor input schema", async () => {
        expect(testcard.getOwnerUUID()).toEqual(newcardSchema.ownerID);
    });

    test("Ensure that ownerInfo is equal to ownerInfo of constructor's input schema", async () => {
        expect(testcard.getCardSchema().ownerInfo).toEqual(newcardSchema.ownerInfo);
    });

    test("Ensure that return is equal to content of constructor's input schema", async () => {
        expect(testcard.getCardSchema().content).toEqual(newcardSchema.content);
    });

    test("Ensure that return is equal to content.layout of constructor's input schema", async () => {
        expect(testcard.getCardContent().layout).toEqual(newcardSchema.content.layout);
    });

    test("Ensure that return is equal to stats of constructor's input schema", async () => {
        expect(testcard.getCardSchema().stats).toEqual(newcardSchema.stats);
    });

    test("Ensure that return is equal to constructor's input schema", async () => {
        expect(testcard.getCardSchema()).toEqual(newcardSchema);
    });

});


describe("Get Card Testing", () => {

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

    describe("Test getID()", () => {
        test("Ensure getID() returns something not empty", async () => {
            expect(testCard.getID()).toBeTruthy();
        });

        test("Ensure getID() does not change", async () => {
            const getID1 = testCard.getID();
            const getID2 = testCard.getID();
            expect(getID1).toEqual(getID2);
        });

    });

    describe("Test getOwnerUUID()", () => {
        test("Ensure getOwnerUUID() returns something not empty", async () => {
            expect(testCard.getOwnerUUID()).toBeTruthy();
        });

        test("Ensure getOwnerUUID() does not change", async () => {
            const getOwnerUUID1 = testCard.getOwnerUUID();
            const getOwnerUUID2 = testCard.getOwnerUUID();
            expect(getOwnerUUID1).toEqual(getOwnerUUID2);
        });

    });

    describe("Test getCardSchema()", () => {
        test("Ensure getCardSchema() returns something not empty", async () => {
            expect(testCard.getCardSchema()).toBeTruthy();
        });

        test("Ensure cardID returns something not empty", async () => {
            expect(testCard.getCardSchema().cardID).toBeTruthy();
        });

        test("Ensure ownerID returns something not empty", async () => {
            expect(testCard.getCardSchema().ownerID).toBeTruthy();
        });

        test("Ensure ownerinfo returns something not empty", async () => {
            expect(testCard.getCardSchema().ownerInfo).toBeTruthy();
        });

        test("Ensure content returns something not empty", async () => {
            expect(testCard.getCardSchema().content).toBeTruthy();
        });

        test("Ensure stats returns something not empty", async () => {
            expect(testCard.getCardSchema().stats).toBeTruthy();
        });

        test("Ensure ownerID is equal to getID()", async () => {
            const recievedcardID = testCard.getCardSchema().cardID;
            const recievedgetID = testCard.getID();
            expect(recievedcardID).toEqual(recievedgetID);
        });

        test("Ensure ownerID is equal to getOwnerUUID()", async () => {
            const recievedownerID = testCard.getCardSchema().ownerID;
            const recievedOwnerUUID = testCard.getOwnerUUID();
            expect(recievedownerID).toEqual(recievedOwnerUUID);
        });

        test("Ensure content is equal to getCardContent()", async () => {
            const recievedcontent = testCard.getCardSchema().content;
            const recievedCardContent = testCard.getCardContent();
            expect(recievedcontent).toEqual(recievedCardContent);
        });

        test("Ensure stats is equal to getCardStats()", async () => {
            const recievedstats = testCard.getCardSchema().stats;
            const recievedCardStats = testCard.getCardStats();
            expect(recievedstats).toEqual(recievedCardStats);
        });


    });

    describe("Test getCardContent()", () => {
        test("Ensure getCardContent() returns something not empty", async () => {
            expect(testCard.getCardContent()).toBeTruthy();
        });

        test("Ensure published is defined", async () => {
            expect(testCard.getCardContent().published).toBeDefined();
        });

        test("Ensure tags is truthy", async () => {
            expect(testCard.getCardContent().tags).toBeTruthy();
        });

        test("Ensure socialMediaLinks is truthy", async () => {
            expect(testCard.getCardContent().socialMediaLinks).toBeTruthy();
        });

        test("Ensure cardProperties is truthy", async () => {
            expect(testCard.getCardContent().cardProperties).toBeTruthy();
        });

        test("Ensure layout is truthy", async () => {
            expect(testCard.getCardContent().layout).toBeTruthy();
        });

        test("Ensure layout is equal to getCardLayout()", async () => {
            const recievedCardLayout = testCard.getCardLayout();
            const recievedlayout = testCard.getCardContent().layout;
            expect(recievedCardLayout).toEqual(recievedlayout);
        });

    });

    describe("Test getCardLayout()", () => {
        test("Ensure getCardLayout() returns something not empty", async () => {
            expect(testCard.getCardLayout()).toBeTruthy();
        });

        test("Ensure background returns something not empty", async () => {
            expect(testCard.getCardLayout().background).toBeTruthy();
        });

        test("Ensure fontColor returns something not empty", async () => {
            expect(testCard.getCardLayout().fontColor).toBeTruthy();
        });

    });

    describe("Test getCardStats()", () => {
        test("Ensure getCardStats() returns something not empty", async () => {
            expect(testCard.getCardStats()).toBeTruthy();
        });

        test("Ensure getCardStats() returns something not empty", async () => {
            expect(testCard.getCardStats().cardViews).toBeTruthy();
        });

        test("Ensure getCardStats() returns something not empty", async () => {
            expect(testCard.getCardStats().saves).toBeTruthy();
        });

        test("Ensure getCardStats() returns something not empty", async () => {
            expect(testCard.getCardStats().favorites).toBeTruthy();
        });

        test("Ensure getCardStats() returns something not empty", async () => {
            expect(testCard.getCardStats().memos).toBeTruthy();
        });

        test("Ensure getCardStats() returns something not empty", async () => {
            expect(testCard.getCardStats().social).toBeTruthy();
        });

    });
  
        
});

describe("Set Card Testing", () => {

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

    describe("Test setCardContent()", () => {
        test("Expect error when undefined is passed in", async () => {
            expect( await testCard.setCardContent(undefined) ).toThrow(new Error("Cannot pass undefinded"));
        });

        test("Expect error when null is passed in", async () => {
            expect(await testCard.setCardContent(null) ).toThrow(new Error("Cannot pass null"));
        });

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

    });

});



//describe("Test setContent", () => {

//    test("Try setting published", async () => {
//        const currentPublished = testCard.getCardContent().published;
//        const newPublishedValue = !currentPublished;

//        // Set only published
//        await testCard.setCardContent({
//            published: newPublishedValue,
//            tags: undefined,
//            socialMediaLinks: undefined,
//            cardProperties: undefined,
//            layout: undefined
//        });


//        const recievedPublishedValue = testCard.getCardContent().published;
//        expect(recievedPublishedValue).toEqual(newPublishedValue);
//    });

//    test("Try setting tags", async () => {
//        const newTags: string[] = ["New Tags", "Way Cooler To Test"];

//        // Set only tags
//        await testCard.setCardContent({
//            published: undefined,
//            tags: newTags,
//            socialMediaLinks: undefined,
//            cardProperties: undefined,
//            layout: undefined
//        });

//        const recievedTags = testCard.getCardContent().tags;
//        expect(recievedTags).toEqual(newTags);
//    });
//});