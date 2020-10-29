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
        email: "validtestemaildontactuallyusethisjoemama@brhino.org",
        passwordHash: "blablabla",

        public: {
            firstName: "joe",
            lastName: "mama",

            customURL: "brhinotestaccount-joemama-brhinotestaccount-dontactuallyusethis",
            profilePictureURL: "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
        }
    }

    // Actually register the test user
    testUser = await databaseWrapper.createUser(newUserAccount);
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
    });

    // Destroy testCard after tests finish
    afterAll(async () => {
        await testUser.setCardID("");
        await databaseWrapper.deleteCard(testUser.getCardID());
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





/*


test("get ID", () => {

    const cardToTest: card = new card();


    expect(card.getId).toHaveReturned();
    expect(card.getOwnderUUID).toHaveReturned();
});
test("get this Card Schema", () =>{
    expect(card.getCardSchema).toHaveReturned();
})

test("gets the Card Content", () =>{
    expect(card.getCardContent).toHaveReturned();
})
test("gets the Card Layout", () =>{
    expect(card.getCardLayout).toHaveReturned();
})
test("gets the Card Stats", () =>{
    expect(card.getCardStats).toHaveReturned();
})
test("sets Card Contents", () =>{
    expect(card.setCardStats).toHaveReturned();
})

test('removes uuid from stats views', () =>{
    expect(card.removeStat).toHaveReturned();
})
test('add uuid to stats views', () =>{
    expect(card.addStat).toHaveReturned();
})
test('saves uuid to stats views', () =>{
    expect(card.addStatSave).toHaveReturned();
})

test('removes uuid to stats views', () =>{
    expect(card.removeStatSave).toHaveReturned();
})

test('Adds uuid to the favorites stat on this card',()=>{
    expect(card.addStatFavorite).toHaveReturned();
})
test('removes uuid from favorite stats views', () =>{
    expect(card.addStatFavorite).toHaveReturned();
})
test('add uuid to the memo stat on this card', () =>{
    expect(card.addStatMemo).toHaveReturned();
})
test('removes uuid from memos stats', () =>{
    expect(card.addStat).toHaveReturned();
})

test('Update the internal card content variables using a provided cardContent interface.', () =>{
    expect(card.updateInternalCardContent).toHaveReturned();
})
test('Update the internal card content variables using a provided cardContent interface.', () =>{
    expect(card.createJsonContentUpdateData).toHaveReturned();
})
test('Update the internal card content variables using a provided cardContent interface.', () =>{
    expect(card.createJsonLayoutUpdateData).toHaveReturned();
})





*/