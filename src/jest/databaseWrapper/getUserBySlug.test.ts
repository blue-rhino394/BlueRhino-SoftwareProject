import { databaseWrapper } from "../../databaseWrapper";
import { v4 } from "uuid";
import { generateRandomUserAccountSchema } from "./utilityMethods";
import { user } from "../../user";
import { reservedRoutes } from "../../reservedRoutes";


describe("databaseWrapper.getUserBySlug()", () => {

    describe("Error Checking", () => {

        test("Expect error when undefined is passed in", async () => {
            await expect(databaseWrapper.getUserBySlug(undefined)).rejects.toThrowError("Cannot pass undefined");
        });

        test("Expect error when null is passed in", async () => {
            await expect(databaseWrapper.getUserBySlug(null)).rejects.toThrowError("Cannot pass null");
        });
    });

    describe("Expect null when passed", () => {

        test("empty string", async () => {
            const requestedUser = await databaseWrapper.getUserBySlug("");
            expect(requestedUser).toBe(null);
        });

        test("non-existing slug", async () => {
            const requestedUser = await databaseWrapper.getUserBySlug(v4());
            expect(requestedUser).toBe(null);
        });

        test("a reserved route", async () => {

            // Create a random route name and reserve it for testing
            const newRoute = v4();
            reservedRoutes.addRoute(newRoute);

            const requestedUser = await databaseWrapper.getUserBySlug(newRoute);
            expect(requestedUser).toBe(null);


            // clean up
            reservedRoutes.removeRoute(newRoute);
        });
    });

    describe("Get User", () => {

        test("Expect that the returned user's slug is equal to the slug used to get that user", async () => {

            // Create a new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Get the user from the database...
            const obtainedUser: user = await databaseWrapper.getUserBySlug(newUserAccountSchema.public.customURL);


            expect(newUserAccountSchema.public.customURL).toEqual(obtainedUser.getAccountSchema().public.customURL);

            // cleanup
            await databaseWrapper.deleteUser(newUser.getUUID());
        });

        test("Expect reference equality when the same slug is used to get the same user more than once", async () => {

            // Create a new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Get the user from the database twice
            const obtainedUser: user = await databaseWrapper.getUserBySlug(newUserAccountSchema.public.customURL);
            const obtainedUserAgain: user = await databaseWrapper.getUserBySlug(newUserAccountSchema.public.customURL);

            expect(obtainedUser).toBe(obtainedUserAgain);

            // cleanup
            await databaseWrapper.deleteUser(newUser.getUUID());
        });
    });
});