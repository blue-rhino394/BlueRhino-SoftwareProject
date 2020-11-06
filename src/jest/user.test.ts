import { user } from "../user";
import { userSchema } from "../interfaces/userSchema";
import { accountStatus } from "../enum/accountStatus";
import { databaseWrapper } from "../databaseWrapper";
import { userAccountSchema } from "../interfaces/userAccountSchema";
import { savedCard } from "../interfaces/savedCard";

// The user to test with
//      POPULATE IN BEFORE ALL
//      REMOVED IN AFTER ALL
var testUser: user = undefined;


beforeAll(async () => {

    //
    //  Register test user
    //

    

    // The user schema used to create the test user
    const newUserSchema: userAccountSchema = {
        email: "fakeemailthatshouldneverexist@brhino.org",
        passwordHash: "blablabla",
        public: {
            firstName: "Test",
            lastName: "User",
            customURL: "fakeemailthatshouldneverexistslug",
            profilePictureURL: "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
        }
    }


    //
    //  Setup / Teardown
    //

    // Create testUser before tests run

        testUser = await databaseWrapper.createUser(newUserSchema);
    });

    // Destroy testUser after tests run
    afterAll(async () => {

        if (testUser.getCardID()) {
            await databaseWrapper.deleteCard(testUser.getCardID());
        }

        await databaseWrapper.deleteUser(testUser.getUUID());
    });



describe("Testing User Getters", () => {


    describe("Test getUUID()", () => {
        test("Ensure that getUUID is truthy", () => {
            expect(testUser.getUUID()).toBeTruthy();
        });

        test("Ensure that getUUID does not change", () => {
            const receviedUUID = testUser.getUUID();
            const receviedUUID1 = testUser.getUUID();

            expect(receviedUUID).toEqual(receviedUUID1);
        });

    });

    describe("Test getCardID()", () => {
        test("Ensure that getCardID returns something defined", () => {
            expect(testUser.getCardID()).toBeDefined();
        });

        test("Ensure that getCardID returns something not null", () => {
            expect(testUser.getCardID() !== null).toBeTruthy();
        });

    });

    describe("Test getAccountSchema()", () => {
        test("Ensure that return of method is truthy", () => {
            expect(testUser.getAccountSchema()).toBeTruthy();
        });

        test("Ensure that email is truthy", () => {
            expect(testUser.getAccountSchema().email).toBeTruthy();
        });

        test("Ensure that passwordHash is truthy", () => {
            expect(testUser.getAccountSchema().passwordHash).toBeTruthy();
        });

        test("Ensure that public is truthy", () => {
            expect(testUser.getAccountSchema().public).toBeTruthy();
        });

        test("Ensure that public.firstName is truthy", () => {
            expect(testUser.getAccountSchema().public.firstName).toBeTruthy();
        });

        test("Ensure that public.lastName is truthy", () => {
            expect(testUser.getAccountSchema().public.lastName).toBeTruthy();
        });

        test("Ensure that public.customURL is truthy", () => {
            expect(testUser.getAccountSchema().public.customURL).toBeTruthy();
        });

        test("Ensure that public.profilePictureURL is truthy", () => {
            expect(testUser.getAccountSchema().public.profilePictureURL).toBeTruthy();
        });

    });

    describe("Test getSavedCard()", () => {
        test("Expect undefined when undefined is passed in", () => {
            expect(testUser.getSavedCard(undefined)).toBeUndefined();
        });

        test("Expect undefined when null is passed in", () => {
            expect(testUser.getSavedCard(null)).toBeUndefined();
        });

        test("Expect undefined when the cardID of an unsaved card is passed in", () => {
            const newcardID: string = "003261564641"
            expect(testUser.getSavedCard(newcardID)).toBeUndefined();
        });
    });

    describe("Test getAllSavedCards()", () => {
        test("Ensure that return of method is truthy", () => {
            expect(testUser.getAllSavedCards()).toBeTruthy();
        });
        //Need to add saved Cards, Need to come back to this, Brain will not work
        test("Ensure that return result sorts favorites to a lower index than non-favorites", () => {
            const newSavedArray: savedCard[] = testUser.getAllSavedCards();
            var Favorited: boolean = false;
            var unsorted: boolean = false;
            var i;
            if (newSavedArray.length < 1) {
                unsorted = false;
            }
            for (i = 0; newSavedArray.length; i++) {
                if (i = 0) {
                    Favorited = newSavedArray[i].favorited;
                }
                if (Favorited == true && newSavedArray[i].favorited == false) {
                    unsorted = true;
                }
            }
            expect(unsorted == true);
        });

    });

    describe("Test getAccountStatus()", () => {
        test("Ensure that return of method is defined", () => {
            expect(testUser.getAccountStatus()).toBeDefined();
        });

    });

    describe("Test getVerificationCode()", () => {
        test("Ensure that return of method is defined", () => {
            expect(testUser.getVerificationCode()).toBeDefined();
        });

    });


});


describe("Testing User Setters", () => {

    describe("Test setCardID()", () => {
        test("Expect error when undefined is passed in", async () => {
            await expect(testUser.setCardID(undefined)).rejects.toThrow(new Error("Cannot pass undefined"));
        });

        test("Expect error when null is passed in", async () => {
            await expect(testUser.setCardID(null)).rejects.toThrow(new Error("Cannot pass null"));
        });

        test("Ensure that setting cardID to an empty string works", async () => {
            const newcardID: string = ""
            await testUser.setCardID(newcardID);
            expect(testUser.getCardID()).toEqual(newcardID);
        });

        test("Ensure that setting cardID to a non-empty string works", async () => {
            const newcardID: string = "003261564641"
            await testUser.setCardID(newcardID);
            expect(testUser.getCardID()).toEqual(newcardID);
        });

    });

    describe("Test setAccountStatus()", () => {
        test("Expect error when undefined is passed in", async () => {
            await expect(testUser.setCardID(undefined)).rejects.toThrow(new Error("Cannot pass undefined"));
        });

        test("Expect error when null is passed in", async () => {
            await expect(testUser.setCardID(null)).rejects.toThrow(new Error("Cannot pass null"));
        });

        test("Ensure that setting account status to same value works", async () => {
            const newStatus: accountStatus = 0;
            testUser.setAccountStatus(newStatus)
            expect(testUser.getAccountStatus()).toEqual(newStatus);
        });

        test("Ensure that setting account status to another value works", async () => {
            const newStatus: accountStatus = 1;
            testUser.setAccountStatus(newStatus)
            expect(newStatus).toEqual(testUser.getAccountStatus());
        });

    });

    describe("Test setVerificationCode()", () => {
        test("Expect error when undefined is passed in", async () => {
            await expect(testUser.setCardID(undefined)).rejects.toThrow(new Error("Cannot pass undefined"));
        });

        test("Expect error when null is passed in", async () => {
            await expect(testUser.setCardID(null)).rejects.toThrow(new Error("Cannot pass null"));
        });

        test("Ensure that setting verification code to an empty string works", async () => {
            const newCode: string = "";
            testUser.setVerificationCode(newCode)
            expect(testUser.getVerificationCode()).toEqual(newCode);
        });

        test("Ensure that setting verification code to a non-empty string", async () => {
            const newCode: string = "1165156156165";
            testUser.setVerificationCode(newCode)
            expect(testUser.getVerificationCode()).toEqual(newCode);
        });

    });
});