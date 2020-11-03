import { user } from "../user";
import { userSchema } from "../interfaces/userSchema";
import { accountStatus } from "../enum/accountStatus";
import { databaseWrapper } from "../databaseWrapper";
import { userAccountSchema } from "../interfaces/userAccountSchema";



describe("User Testing 1", () => {

    //
    //  Settings
    //

    // The user to test with
    var testUser: user = undefined;

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
    beforeAll(async () => {
        testUser = await databaseWrapper.createUser(newUserSchema);
    });

    // Destroy testUser after tests run
    afterAll(async () => {

        if (testUser.getCardID()) {
            await databaseWrapper.deleteCard(testUser.getCardID());
        }

        await databaseWrapper.deleteUser(testUser.getUUID());
    });





    test("Ensure getUUID() returns something defined", () => {
        expect(testUser.getUUID()).toBeDefined();
    });

    describe("Test getAccountSchema()", () => {

        test("Ensure that email was set correctly", () => {
            expect(testUser.getAccountSchema().email).toEqual(newUserSchema.email);
        });

    });
});
