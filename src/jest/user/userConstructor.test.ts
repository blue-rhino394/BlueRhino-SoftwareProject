import { accountStatus } from "../../enum/accountStatus";
import { userSchema } from "../../interfaces/userSchema";
import { user } from "../../user";
import { v4 } from "uuid";
import { savedCard } from "../../interfaces/savedCard";


//Testing the get methods for User by comparing it to User Schema
describe("Get Testing Constructor Input Schema", () => {

    var testU: user = undefined;

    //User Schema used to create a new user
    const newSchema: userSchema = {
        uuid: "465116165",
        currentAccountStatus: accountStatus.Active,
        verificationCode: "165156161165",
        cardID: "16516515",
        savedCards: [{
            cardID: "1661516",
            favorited: true,
            memo: "This"
        }],
        userAccount: {
            email: v4(),
            passwordHash: "blablabla",
            public: {
                firstName: "Test",
                lastName: "User",
                customURL: v4(),
                profilePictureURL: "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
            }
        }
    }

    // before all tests are run a new user, a test User is created with values from User Schema
    beforeAll(async () => {
        testU = new user(newSchema);
    });

    test("Ensure that getUUID is equal to uuid of constructor's input schema", async () => {
        expect(testU.getUUID()).toEqual(newSchema.uuid);
    });

    test("Ensure that getCardID is equal to cardID of constructor's input schema", async () => {
        expect(testU.getCardID()).toEqual(newSchema.cardID);
    });

    test("Ensure that return is equal to constructor's input schema", async () => {
        expect(testU.getAccountSchema()).toEqual(newSchema.userAccount);
    });

    test("Expect returned result to be equal to a savedCard in constructor's input schema give it's proper ID", async () => {
        const newcard: savedCard[] = newSchema.savedCards;
        expect(testU.getSavedCard("1661516")).toEqual(newcard[0]);
    });

    test("Ensure that return result contains all the values in savedCards of constructor's input schema", async () => {
        expect(testU.getAllSavedCards()).toEqual(newSchema.savedCards);
    });

    test("Ensure that return result contains all the values in savedCards of constructor's input schema", async () => {
        expect(testU.getAccountStatus()).toEqual(newSchema.currentAccountStatus);
    });

    test("Ensure that return is equal to constructor's input schema", async () => {
        expect(testU.getVerificationCode()).toEqual(newSchema.verificationCode);
    });



});