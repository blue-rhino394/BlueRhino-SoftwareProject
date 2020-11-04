import { card } from "../../card";
import { databaseWrapper } from "../../databaseWrapper";
import { user } from "../../user";
import { userAccountSchema } from "../../interfaces/userAccountSchema";
import { cardContent } from "../../interfaces/cardContent";
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
            const newstatArray: string[] = [newstatView, newstatView1];
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