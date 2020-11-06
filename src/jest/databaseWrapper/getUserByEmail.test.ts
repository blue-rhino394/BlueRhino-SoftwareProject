import { databaseWrapper } from "../../databaseWrapper";
import { v4 } from "uuid";
import { generateRandomUserAccountSchema } from "./utilityMethods";
import { user } from "../../user";


describe("databaseWrapper.getUserByEmail()", () => {

    describe("Error Checking", () => {

        test("Expect error when undefined is passed in", async () => {
            await expect(databaseWrapper.getUserByEmail(undefined)).rejects.toThrowError("Cannot pass undefined");
        });

        test("Expect error when null is passed in", async () => {
            await expect(databaseWrapper.getUserByEmail(null)).rejects.toThrowError("Cannot pass null");
        });
    });

    describe("Expect null when passed", () => {

        test("empty string", async () => {
            const requestedUser = await databaseWrapper.getUserByEmail("");
            expect(requestedUser).toBe(null);
        });

        test("false/new email", async () => {
            const requestedUser = await databaseWrapper.getUserByEmail(`${v4()}@${v4()}.com`);
            expect(requestedUser).toBe(null);
        });
    });

    describe("Get User", () => {

        test("Expect that the returned user's email is equal to the email used to get that user", async () => {

            // Create a new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Get the user from the database...
            const obtainedUser: user = await databaseWrapper.getUserByEmail(newUser.getAccountSchema().email);


            expect(newUser.getAccountSchema().email).toEqual(obtainedUser.getAccountSchema().email);

            // cleanup
            await databaseWrapper.deleteUser(newUser.getUUID());
        });

        test("Expect reference equality when the same email is used to get the same user more than once", async () => {

            // Create a new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Get the user from the database twice
            const obtainedUser: user = await databaseWrapper.getUserByEmail(newUser.getAccountSchema().email);
            const obtainedUserAgain: user = await databaseWrapper.getUserByEmail(newUser.getAccountSchema().email);

            expect(obtainedUser).toBe(obtainedUserAgain);

            // cleanup
            await databaseWrapper.deleteUser(newUser.getUUID());
        });
    });
});