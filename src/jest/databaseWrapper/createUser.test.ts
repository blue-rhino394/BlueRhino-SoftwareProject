﻿import { databaseWrapper } from "../../databaseWrapper";
import { userAccountSchema } from "../../interfaces/userAccountSchema";
import { user } from "../../user";
import { generateRandomUserAccountSchema } from "./utilityMethods";
import { reservedRoutes } from "../../reservedRoutes";
import { v4 } from "uuid";




describe("databaseWrapper.createUser()", () => {

    describe("Error Checking", () => {

        test("Expect error when undefined is passed in", async () => {
            await expect(databaseWrapper.createUser(undefined)).rejects.toThrowError("Cannot pass undefined");
        });

        test("Expect error when null is passed in", async () => {
            await expect(databaseWrapper.createUser(null)).rejects.toThrowError("Cannot pass null");
        });

        describe("Expect error when email paramater is", () => {

            // The error to expect
            const expectedError = "User schema's email paramater can not be falsy";

            // Populate in before all with a randomly generated
            // userAccountSchema
            var randomAccountSchema: userAccountSchema;

            beforeAll(() => {
                randomAccountSchema = generateRandomUserAccountSchema();
            });

            test("undefined", async () => {
                randomAccountSchema.email = undefined;
                await expect(databaseWrapper.createUser(randomAccountSchema)).rejects.toThrowError(expectedError);
            });

            test("null", async () => {
                randomAccountSchema.email = null;
                await expect(databaseWrapper.createUser(randomAccountSchema)).rejects.toThrowError(expectedError);
            });

            test("empty string", async () => {
                randomAccountSchema.email = "";
                await expect(databaseWrapper.createUser(randomAccountSchema)).rejects.toThrowError(expectedError);
            });
        });

        describe("Expect error when passwordHash paramater is", () => {

            // The error to expect
            const expectedError = "User schema's passwordHash paramater can not be falsy";

            // Populate in before all with a randomly generated
            // userAccountSchema
            var randomAccountSchema: userAccountSchema;

            beforeAll(() => {
                randomAccountSchema = generateRandomUserAccountSchema();
            });

            test("undefined", async () => {
                randomAccountSchema.passwordHash = undefined;
                await expect(databaseWrapper.createUser(randomAccountSchema)).rejects.toThrowError(expectedError);
            });

            test("null", async () => {
                randomAccountSchema.passwordHash = null;
                await expect(databaseWrapper.createUser(randomAccountSchema)).rejects.toThrowError(expectedError);
            });

            test("empty string", async () => {
                randomAccountSchema.passwordHash = "";
                await expect(databaseWrapper.createUser(randomAccountSchema)).rejects.toThrowError(expectedError);
            });
        });

        describe("Expect error when passwordHash paramater is", () => {

            // The error to expect
            const expectedError = "User schema's passwordHash paramater can not be falsy";

            // Populate in before all with a randomly generated
            // userAccountSchema
            var randomAccountSchema: userAccountSchema;

            beforeAll(() => {
                randomAccountSchema = generateRandomUserAccountSchema();
            });

            test("undefined", async () => {
                randomAccountSchema.passwordHash = undefined;
                await expect(databaseWrapper.createUser(randomAccountSchema)).rejects.toThrowError(expectedError);
            });

            test("null", async () => {
                randomAccountSchema.passwordHash = null;
                await expect(databaseWrapper.createUser(randomAccountSchema)).rejects.toThrowError(expectedError);
            });

            test("empty string", async () => {
                randomAccountSchema.passwordHash = "";
                await expect(databaseWrapper.createUser(randomAccountSchema)).rejects.toThrowError(expectedError);
            });
        });

        describe("Expect error when public paramater is", () => {

            // The error to expect
            const expectedError = "User schema's public paramater can not be falsy";

            // Populate in before all with a randomly generated
            // userAccountSchema
            var randomAccountSchema: userAccountSchema;

            beforeAll(() => {
                randomAccountSchema = generateRandomUserAccountSchema();
            });

            test("undefined", async () => {
                randomAccountSchema.public = undefined;
                await expect(databaseWrapper.createUser(randomAccountSchema)).rejects.toThrowError(expectedError);
            });

            test("null", async () => {
                randomAccountSchema.public = null;
                await expect(databaseWrapper.createUser(randomAccountSchema)).rejects.toThrowError(expectedError);
            });
        });
    });

    describe("Expect Null", () => {

        test("Expect null if user with provided email already exists", async () => {

            // Create a new user
            const legitNewUserAccountSchema = generateRandomUserAccountSchema();
            const legitNewUser: user = await databaseWrapper.createUser(legitNewUserAccountSchema);

            // Try to create another user but using the previous user's email
            const anotherNewUserAccountSchema = generateRandomUserAccountSchema();
            anotherNewUserAccountSchema.email = legitNewUserAccountSchema.email;
            const anotherNewUser: user = await databaseWrapper.createUser(anotherNewUserAccountSchema);

            expect(anotherNewUser).toBe(null);


            // clean up
            await databaseWrapper.deleteUser(legitNewUser.getUUID());
        });

        test("Expect null if user with provided slug already exists", async () => {

            // Create a new user
            const legitNewUserAccountSchema = generateRandomUserAccountSchema();
            const legitNewUser: user = await databaseWrapper.createUser(legitNewUserAccountSchema);

            // Try to create another user but using the previous user's email
            const anotherNewUserAccountSchema = generateRandomUserAccountSchema();
            anotherNewUserAccountSchema.public.customURL = legitNewUserAccountSchema.public.customURL;
            const anotherNewUser: user = await databaseWrapper.createUser(anotherNewUserAccountSchema);

            expect(anotherNewUser).toBe(null);


            // clean up
            await databaseWrapper.deleteUser(legitNewUser.getUUID());
        });

        test("Expect null if a reserved route is already using the provided slug", async () => {


            // Create a random route name and reserve it for testing
            const newRoute = v4();
            reservedRoutes.addRoute(newRoute);

            // Generate new account schema and set it's slug to the route we reserved above
            const newUserAccountSchema = generateRandomUserAccountSchema();
            newUserAccountSchema.public.customURL = newRoute;

            // Try to create a user with this schema
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            expect(newUser).toBe(null);


            // clean up
            reservedRoutes.removeRoute(newRoute);
        });
    });

    describe("User Creation", () => {

        test("Expect return result's accountSchema to equal provided accountSchema", async () => {

            const userAccountUsedToCreateUser = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(userAccountUsedToCreateUser);
            const newUserAccount = newUser.getAccountSchema();

            expect(userAccountUsedToCreateUser).toEqual(newUserAccount);

            // cleanup
            await databaseWrapper.deleteUser(newUser.getUUID());
        });

        test("Expect return result's getUUID to have a populated string", async () => {

            const userAccountUsedToCreateUser = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(userAccountUsedToCreateUser);

            expect(newUser.getUUID()).toBeTruthy();

            // cleanup
            await databaseWrapper.deleteUser(newUser.getUUID());
        });
    });

    describe("XSS Prevention Checking", () => {

        test("Expect XSS to be removed from public.firstName", async () => {

            const userAccountUsedToCreateUser = generateRandomUserAccountSchema();
            userAccountUsedToCreateUser.public.firstName = "<script>alert('HEY');</script>";

            const newUser: user = await databaseWrapper.createUser(userAccountUsedToCreateUser);
            const newUserAccount = newUser.getAccountSchema();

            expect(newUserAccount.public.firstName).not.toContain("<script>");
            expect(newUserAccount.public.firstName).not.toContain("</script>");

            // cleanup
            await databaseWrapper.deleteUser(newUser.getUUID());
        });

        test("Expect XSS to be removed from public.lastName", async () => {

            const userAccountUsedToCreateUser = generateRandomUserAccountSchema();
            userAccountUsedToCreateUser.public.lastName = "<script>alert('HEY');</script>";

            const newUser: user = await databaseWrapper.createUser(userAccountUsedToCreateUser);
            const newUserAccount = newUser.getAccountSchema();

            expect(newUserAccount.public.firstName).not.toContain("<script>");
            expect(newUserAccount.public.firstName).not.toContain("</script>");

            // cleanup
            await databaseWrapper.deleteUser(newUser.getUUID());
        });
    });
});







