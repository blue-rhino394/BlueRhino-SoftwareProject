import { databaseWrapper } from "../databaseWrapper";
import { userAccountSchema } from "../interfaces/userAccountSchema";
import { user } from "../user";

const dbwrapper = require("../databaseWrapper");
const { MongoClient } = require("mongodb");



test("Verify we're connected to MongoDB", async () => {
    const connectedResult = await databaseWrapper.verifyConnectedToMongoDB();

    expect(connectedResult).toBeTruthy();
});








test("Try creating a user", async () => {

    const newUserSchema: userAccountSchema = {
        email: "totallyfakeemailtotestwith@brhino.org",
        passwordHash: "blablabla",
        public: {
            firstName: "Test",
            lastName: "User",
            customURL: "totallyfakeslugthatshouldnevereverevereverbeused123",
            profilePictureURL: "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
        }
    }

    const newUser: user = await databaseWrapper.createUser(newUserSchema);
    expect(newUser).toBeTruthy();

    await databaseWrapper.deleteUser(newUser.getUUID());
});

test("Try creating a user that already exists", async () => {

    const newUserSchema: userAccountSchema = {
        email: "totallyfakeemailtotestwith@brhino.org",
        passwordHash: "blablabla",
        public: {
            firstName: "Test",
            lastName: "User",
            customURL: "totallyfakeslugthatshouldnevereverevereverbeused123",
            profilePictureURL: "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
        }
    }

    const newUser: user = await databaseWrapper.createUser(newUserSchema);
    const failedNewUser: user = await databaseWrapper.createUser(newUserSchema);

    expect(failedNewUser).toBeFalsy();

    await databaseWrapper.deleteUser(newUser.getUUID());
});