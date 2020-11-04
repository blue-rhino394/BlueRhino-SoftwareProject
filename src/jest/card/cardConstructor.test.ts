import { card } from "../../card";
import { cardSchema } from "../../interfaces/cardSchema";


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