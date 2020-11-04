import { card } from "../card";
import { databaseWrapper } from "../databaseWrapper";
import { user } from "../user";
import { userAccountSchema } from "../interfaces/userAccountSchema";
import { cardSchema } from "../interfaces/cardSchema";
import { cardContent } from "../interfaces/cardContent";
import { cardPropertyElement } from "../interfaces/cardPropertyElement";
import { cardLayout } from "../interfaces/cardLayout";
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

describe("Stat Testing", () => {

    //
    //  Settings
    //

    // The card to test with
    var testCard: card = undefined;

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

    describe("Test addStatView()", () => {
        test("Expect error when undefined is passed in", async () => {
            await expect(testCard.addStatView(undefined)).rejects.toThrow(new Error("Cannot pass undefined"));
        });

        test("Expect error when null is passed in", async () => {
            await expect(testCard.addStatView(null)).rejects.toThrow(new Error("Cannot pass null"));
        });

        test("Ensure that adding a view actually works", async () => {
            const newstatView: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";

            // Add cardViews
            await testCard.addStatView(newstatView);

            expect(testCard.getCardStats().cardViews).toEqual([newstatView]);
        });

        test("Ensure that multiple views are not added for the same ID", async () => {
            const newstatView: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            const newstatView1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            // Add cardViews
            await testCard.addStatView(newstatView);
            await testCard.addStatView(newstatView1);

            expect(testCard.getCardStats().cardViews).toEqual([newstatView]);
        });

        test("Ensure that multiple views can be added with different ID's", async () => {
            const newstatView: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            const newstatView1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cd";
            const newstatArray: string[] = [ newstatView, newstatView1];
            // Add cardViews
            await testCard.addStatView(newstatView);
            await testCard.addStatView(newstatView1);

            expect(testCard.getCardStats().cardViews).toEqual(newstatArray);
        });

    });

    describe("Test removeStatView()", () => {
        test("Expect error when undefined is passed in", async () => {
            await expect(testCard.removeStatView(undefined)).rejects.toThrow(new Error("Cannot pass undefined"));
        });

        test("Expect error when null is passed in", async () => {
            await expect(testCard.removeStatView(null)).rejects.toThrow(new Error("Cannot pass null"));
        });

        test("Ensure that removing a view actually works", async () => {
            const newstatView: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            const newstatView1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cd";
            // Remove cardViews
            await testCard.removeStatView(newstatView);

            expect(testCard.getCardStats().cardViews).toEqual([newstatView1]);
        });

        test("Ensure that removing a view actually works", async () => {
            const newstatView: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6ca";
            const newstatView1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cd";
            // Remove cardViews
            await testCard.removeStatView(newstatView);

            expect(testCard.getCardStats().cardViews).toEqual([newstatView1]);
        });

    });

    describe("Test addStatSave()", () => {
        test("Expect error when undefined is passed in", async () => {
            await expect(testCard.addStatSave(undefined)).rejects.toThrow(new Error("Cannot pass undefined"));
        });

        test("Expect error when null is passed in", async () => {
            await expect(testCard.addStatSave(null)).rejects.toThrow(new Error("Cannot pass null"));
        });

        test("Ensure that adding a save actually works", async () => {
            const newstatSave: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";

            // Add Card Saves
            await testCard.addStatSave(newstatSave);

            expect(testCard.getCardStats().saves).toEqual([newstatSave]);
        });

        test("Ensure that multiple saves are not added for the same ID", async () => {
            const newstatSave: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            const newstatSave1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            // Add Card Saves
            await testCard.addStatSave(newstatSave);
            await testCard.addStatSave(newstatSave1);

            expect(testCard.getCardStats().saves).toEqual([newstatSave]);
        });

        test("Ensure that multiple views can be added with different ID's", async () => {
            const newstatSave: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            const newstatSave1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cd";
            const newstatArray: string[] = [newstatSave, newstatSave1];
            // Add Card Saves
            await testCard.addStatSave(newstatSave);
            await testCard.addStatSave(newstatSave1);

            expect(testCard.getCardStats().saves).toEqual(newstatArray);
        });

    });

    describe("Test removeStatSave()", () => {
        test("Expect error when undefined is passed in", async () => {
            await expect(testCard.removeStatSave(undefined)).rejects.toThrow(new Error("Cannot pass undefined"));
        });

        test("Expect error when null is passed in", async () => {
            await expect(testCard.removeStatSave(null)).rejects.toThrow(new Error("Cannot pass null"));
        });

        test("Ensure that removing a save actually works", async () => {
            const newstatSave: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            const newstatSave1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cd";
            // Remove Card Save
            await testCard.removeStatSave(newstatSave);

            expect(testCard.getCardStats().saves).toEqual([newstatSave1]);
        });

        test("Expect NO ERROR if you try to remove a save that does not exist", async () => {
            const newstatSave: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6ca";
            const newstatSave1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cd";
            // Remove Card Save
            await testCard.removeStatSave(newstatSave);

            expect(testCard.getCardStats().saves).toEqual([newstatSave1]);
        });

    });

    describe("Test addStatMemo()", () => {
        test("Expect error when undefined is passed in", async () => {
            await expect(testCard.addStatMemo(undefined)).rejects.toThrow(new Error("Cannot pass undefined"));
        });

        test("Expect error when null is passed in", async () => {
            await expect(testCard.addStatMemo(null)).rejects.toThrow(new Error("Cannot pass null"));
        });

        test("Ensure that adding a memo actually works", async () => {
            const newstatMemo: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";

            // Add card Memos
            await testCard.addStatMemo(newstatMemo);

            expect(testCard.getCardStats().memos).toEqual([newstatMemo]);
        });

        test("Ensure that multiple memos are not added for the same ID", async () => {
            const newstatMemo: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            const newstatMemo1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            // Add card Memos
            await testCard.addStatMemo(newstatMemo);
            await testCard.addStatMemo(newstatMemo1);

            expect(testCard.getCardStats().memos).toEqual([newstatMemo]);
        });

        test("Ensure that multiple memos can be added w/ different ID's", async () => {
            const newstatMemo: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            const newstatMemo1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cd";
            const newstatArray: string[] = [newstatMemo, newstatMemo1];
            // Add card Memos
            await testCard.addStatMemo(newstatMemo);
            await testCard.addStatMemo(newstatMemo1);

            expect(testCard.getCardStats().memos).toEqual(newstatArray);
        });

    });

    describe("Test removeStatMemo()", () => {
        test("Expect error when undefined is passed in", async () => {
            await expect(testCard.removeStatMemo(undefined)).rejects.toThrow(new Error("Cannot pass undefined"));
        });

        test("Expect error when null is passed in", async () => {
            await expect(testCard.removeStatMemo(null)).rejects.toThrow(new Error("Cannot pass null"));
        });

        test("Ensure that removing a memo actually works", async () => {
            const newstatMemo: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            const newstatMemo1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cd";
            // Remove card memos
            await testCard.removeStatMemo(newstatMemo);

            expect(testCard.getCardStats().memos).toEqual([newstatMemo1]);
        });

        test("Expect NO ERROR if you try to remove a memo that does not exist", async () => {
            const newstatMemo: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6ca";
            const newstatMemo1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cd";
            // Remove card memos
            await testCard.removeStatMemo(newstatMemo);

            expect(testCard.getCardStats().memos).toEqual([newstatMemo1]);
        });

    });

    describe("Test addStatFavorite()", () => {
        test("Expect error when undefined is passed in", async () => {
            await expect(testCard.addStatFavorite(undefined)).rejects.toThrow(new Error("Cannot pass undefined"));
        });

        test("Expect error when null is passed in", async () => {
            await expect(testCard.addStatFavorite(null)).rejects.toThrow(new Error("Cannot pass null"));
        });

        test("Ensure that adding a memo actually works", async () => {
            const newstatFavorite: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";

            // Add card Memos
            await testCard.addStatFavorite(newstatFavorite);

            expect(testCard.getCardStats().favorites).toEqual([newstatFavorite]);
        });

        test("Ensure that multiple memos are not added for the same ID", async () => {
            const newstatFavorite: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            const newstatFavorite1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            // Add card Memos
            await testCard.addStatFavorite(newstatFavorite);
            await testCard.addStatFavorite(newstatFavorite1);

            expect(testCard.getCardStats().favorites).toEqual([newstatFavorite]);
        });

        test("Ensure that multiple memos can be added w/ different ID's", async () => {
            const newstatFavorite: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            const newstatFavorite1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cd";
            const newstatArray: string[] = [newstatFavorite, newstatFavorite1];
            // Add card Memos
            await testCard.addStatFavorite(newstatFavorite);
            await testCard.addStatFavorite(newstatFavorite1);

            expect(testCard.getCardStats().favorites).toEqual(newstatArray);
        });

    });

    describe("Test removeStatFavorite()", () => {
        test("Expect error when undefined is passed in", async () => {
            await expect(testCard.removeStatFavorite(undefined)).rejects.toThrow(new Error("Cannot pass undefined"));
        });

        test("Expect error when null is passed in", async () => {
            await expect(testCard.removeStatFavorite(null)).rejects.toThrow(new Error("Cannot pass null"));
        });

        test("Ensure that removing a memo actually works", async () => {
            const newstatFavorite: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cf";
            const newstatFavorite1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cd";
            // Remove card memos
            await testCard.removeStatFavorite(newstatFavorite);

            expect(testCard.getCardStats().favorites).toEqual([newstatFavorite1]);
        });

        test("Expect NO ERROR if you try to remove a memo that does not exist", async () => {
            const newstatFavorite: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6ca";
            const newstatFavorite1: string = "c9f1f93c-47c7-4bae-84b6-222585e5d6cd";
            // Remove card memos
            await testCard.removeStatFavorite(newstatFavorite);

            expect(testCard.getCardStats().favorites).toEqual([newstatFavorite1]);
        });

    });

});


describe("Test hasTags()", () => {
        //
    //  Settings
    //

    // The card to test with
    var testCard: card = undefined;

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
    // Test
    //

    test("Expect error when undefined is passed in", () => {
        expect(() => { testCard.hasTags(undefined); }).toThrow(new Error("Cannot pass undefined"));
    });

    test("Expect error when null is passed in", () => {
        expect(() => { testCard.hasTags(null); }).toThrow(new Error("Cannot pass null"));

    });




});