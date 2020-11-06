import { databaseWrapper } from "../../databaseWrapper";
import { v4 } from "uuid";
import { generateRandomUserAccountSchema } from "./utilityMethods";
import { user } from "../../user";



describe("databaseWrapper.deleteUser()", () => {

    describe("Error Checking", () => {

        test("Expect error when undefined is passed in", async () => {
            await expect(databaseWrapper.deleteUser(undefined)).rejects.toThrowError("Cannot pass undefined");
        });

        test("Expect error when null is passed in", async () => {
            await expect(databaseWrapper.deleteUser(null)).rejects.toThrowError("Cannot pass null");
        });
    });

    describe("Expect 'No user by this UUID' when passed", () => {

        const expectedMessage = "No user by this UUID";

        test("empty string", async () => {
            const message: string = await databaseWrapper.deleteUser("");
            expect(message).toBe(expectedMessage)
        });

        test("false/new UUID", async () => {
            const message: string = await databaseWrapper.deleteUser(v4());
            expect(message).toBe(expectedMessage)
        });

        test("UUID of previously deleted user", async () => {

            // Create a new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Save their UUID
            const newUsersUUID = newUser.getUUID();

            // Delete the new user
            await databaseWrapper.deleteUser(newUsersUUID);

            // Try to delete that user again
            const message: string = await databaseWrapper.deleteUser(newUsersUUID);
            expect(message).toBe(expectedMessage)
        });
    });
});