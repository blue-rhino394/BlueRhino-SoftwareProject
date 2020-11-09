import { databaseWrapper } from "../../databaseWrapper";
import { v4 } from "uuid";
import { generateRandomUserAccountSchema } from "./utilityMethods";
import { user } from "../../user";


describe("databaseWrapper.getUser()", () => {

    describe("Error Checking", () => {

        test("Expect error when undefined is passed in", async () => {
            await expect(databaseWrapper.getUser(undefined)).rejects.toThrowError("Cannot pass undefined");
        });

        test("Expect error when null is passed in", async () => {
            await expect(databaseWrapper.getUser(null)).rejects.toThrowError("Cannot pass null");
        });
    });

    describe("Expect null when passed", () => {

        test("empty string", async () => {
            const requestedUser = await databaseWrapper.getUser("");
            expect(requestedUser).toBe(null);
        });

        test("false/new UUID", async () => {
            const requestedUser = await databaseWrapper.getUser(v4());
            expect(requestedUser).toBe(null);
        });
    });

    describe("Get User", () => {

        test("Expect that the returned user's UUID is equal to the UUID used to get that user", async () => {

            // Create a new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Get the user from the database...
            const obtainedUser: user = await databaseWrapper.getUser(newUser.getUUID());


            expect(newUser.getUUID()).toEqual(obtainedUser.getUUID());

            // cleanup
            await databaseWrapper.deleteUser(newUser.getUUID());
        });

        test("Expect reference equality when the same UUID is used to get the same user more than once", async () => {

            // Create a new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Get the user from the database twice
            const obtainedUser: user = await databaseWrapper.getUser(newUser.getUUID());
            const obtainedUserAgain: user = await databaseWrapper.getUser(newUser.getUUID());

            expect(obtainedUser).toBe(obtainedUserAgain);

            // cleanup
            await databaseWrapper.deleteUser(newUser.getUUID());
        });
    });
});