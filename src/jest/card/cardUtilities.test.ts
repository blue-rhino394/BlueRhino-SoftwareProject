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
    beforeEach(async () => {
        testCard = await databaseWrapper.createCard(testUser.getUUID(), content);

        // If we couldn't create a card for some reason...
        if (!testCard) {
            throw new Error("Failed to create testing card...");
        }

    });

    // Destroy testCard after tests finish
    afterEach(async () => {
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

    test("Expect true when empty array is passed and card has no tags", () => {
        const newTags: string[] = [];
        expect(testCard.hasTags(newTags)).toBeTruthy();
    });

    test("Expect true when array with single tag is passed, and card only has that tag", async () => {
        const newTags: string[] = ["T1"];

        // set only 1 tag
        await testCard.setCardContent({
            published: undefined,
            tags: newTags,
            socialMediaLinks: undefined,
            cardProperties: undefined,
            layout: undefined
        });

        expect(testCard.hasTags(newTags)).toBeTruthy();
    });

    test("Expect true when array with single tag is passed, and card has multiple tags INCLUDING that tag", async () => {
        const newTags: string[] = ["T1"];
        const newTags1: string[] = ["T1", "T2", "T3"];

        // set only 1 tag
        await testCard.setCardContent({
            published: undefined,
            tags: newTags1,
            socialMediaLinks: undefined,
            cardProperties: undefined,
            layout: undefined
        });

        expect(testCard.hasTags(newTags)).toBeTruthy();
    });

    test("Expect true when array with multiple tags is passed, and card only has those two tags", async () => {
        const newTags: string[] = ["T1", "T2"];
        const newTags1: string[] = ["T1", "T2"];

        // set multiple tags
        await testCard.setCardContent({
            published: undefined,
            tags: newTags1,
            socialMediaLinks: undefined,
            cardProperties: undefined,
            layout: undefined
        });

        expect(testCard.hasTags(newTags)).toBeTruthy();
    });

    test("Expect true when array with multiple tags is passed, and card has multiple tags INCLUDING those tags", async () => {
        const newTags: string[] = ["T1", "T2"];
        const newTags1: string[] = ["T1", "T2", "T3"];

        // set multiple tags
        await testCard.setCardContent({
            published: undefined,
            tags: newTags1,
            socialMediaLinks: undefined,
            cardProperties: undefined,
            layout: undefined
        });

        expect(testCard.hasTags(newTags)).toBeTruthy();
    });

    test("Expect false when array with single tag is passed, and card does not have any tags", async () => {
        const newTags: string[] = ["T1"];
        expect(testCard.hasTags(newTags)).toBeFalsy();
    });

    test("Expect false when array with single tag is passed, and card has multiple tags but not that tag", async () => {
        const newTags: string[] = ["T1"];
        const newTags1: string[] = ["T2", "T3"];

        // set only 1 tag
        await testCard.setCardContent({
            published: undefined,
            tags: newTags1,
            socialMediaLinks: undefined,
            cardProperties: undefined,
            layout: undefined
        });

        expect(testCard.hasTags(newTags)).toBeFalsy();
    });

    test("Expect false when array with multiple tag is passed, and card does not have any tags", async () => {
        const newTags: string[] = ["T1", "T2"];
        expect(testCard.hasTags(newTags)).toBeFalsy();
    });

    test("Expect false when array with multiple tag is passed, and card has multiple tags but not that tag", async () => {
        const newTags: string[] = ["T1", "T2"];
        const newTags1: string[] = ["T3", "T4", "T5"];

        // set multiple tags
        await testCard.setCardContent({
            published: undefined,
            tags: newTags1,
            socialMediaLinks: undefined,
            cardProperties: undefined,
            layout: undefined
        });

        expect(testCard.hasTags(newTags)).toBeFalsy();
    });

});

describe("Test hasText()", () => {
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
    beforeEach(async () => {
        testCard = await databaseWrapper.createCard(testUser.getUUID(), content);

        // If we couldn't create a card for some reason...
        if (!testCard) {
            throw new Error("Failed to create testing card...");
        }

    });

    // Destroy testCard after tests finish
    afterEach(async () => {
        await databaseWrapper.deleteCard(testUser.getCardID());
        await testUser.setCardID("");
    });

    //
    // Test
    //

    test("Expect error when undefined is passed in", () => {
        expect(() => { testCard.hasText(undefined); }).toThrow(new Error("Cannot pass undefined"));
    });

    test("Expect error when null is passed in", () => {
        expect(() => { testCard.hasText(null); }).toThrow(new Error("Cannot pass null"));

    });

    test("Expect true when firstName is passed in", async () => {
        const newfirstName: string = "testing";

        // Set only firstName
        await testCard.setOwnerInfo({
            firstName: newfirstName,
            lastName: undefined,
            customURL: undefined,
            profilePictureURL: undefined
        });

        expect(testCard.hasText(newfirstName)).toBeTruthy();
    });

    test("Expect true when lastName is passed in", async () => {
        const newlastName: string = "testing";

        // Set only firstName
        await testCard.setOwnerInfo({
            firstName: undefined,
            lastName: newlastName,
            customURL: undefined,
            profilePictureURL: undefined
        });

        expect(testCard.hasText(newlastName)).toBeTruthy();
    });

    test("Expect true when firstName and lastName seperate by a space is passed in", async () => {
        const newlastName: string = "testing";
        const newfirstName: string = "testing";
        // Set only firstName
        await testCard.setOwnerInfo({
            firstName: newfirstName,
            lastName: newlastName,
            customURL: undefined,
            profilePictureURL: undefined
        });

        expect(testCard.hasText(newfirstName + " " + newlastName)).toBeTruthy();
    });

    test("Expect true when a substring of firstName is passed in", async () => {
        const newfirstName: string = "testing";
        const newfirstSubstring: string = "test";

        // Set only firstName
        await testCard.setOwnerInfo({
            firstName: newfirstName,
            lastName: undefined,
            customURL: undefined,
            profilePictureURL: undefined
        });

        expect(testCard.hasText(newfirstSubstring)).toBeTruthy();
    });

    test("Expect true when a substring of lastName is passed in", async () => {
        const newlastName: string = "testing";
        const newlastSubString: string = "test";

        // Set only firstName
        await testCard.setOwnerInfo({
            firstName: undefined,
            lastName: newlastName,
            customURL: undefined,
            profilePictureURL: undefined
        });

        expect(testCard.hasText(newlastSubString)).toBeTruthy();
    });

    test("Ensure that hasText is not case sensitive", async () => {
        const newfirstName: string = "testing";
        const newfirstUpperCase: string = "TESTING";

        // Set only firstName
        await testCard.setOwnerInfo({
            firstName: newfirstName,
            lastName: undefined,
            customURL: undefined,
            profilePictureURL: undefined
        });

        expect(testCard.hasText(newfirstUpperCase)).toBeTruthy();
    });

    test("Expect true when empty string is passed in", async () => {
        const newemptyString: string = "";
        expect(testCard.hasText(newemptyString)).toBeTruthy();
    });

    test("Expect false when wrong firstName is passed in", async () => {
        const newfirstName: string = "testing";
        const newWrongName: string = "name";

        // Set only firstName
        await testCard.setOwnerInfo({
            firstName: newfirstName,
            lastName: undefined,
            customURL: undefined,
            profilePictureURL: undefined
        });

        expect(testCard.hasText(newWrongName)).toBeFalsy();
    });

    test("Expect false when wrong lastName is passed in", async () => {
        const newlastName: string = "testing";
        const newWrongName: string = "name";

        // Set only firstName
        await testCard.setOwnerInfo({
            firstName: undefined,
            lastName: newlastName,
            customURL: undefined,
            profilePictureURL: undefined
        });

        expect(testCard.hasText(newWrongName)).toBeFalsy();
    });

});