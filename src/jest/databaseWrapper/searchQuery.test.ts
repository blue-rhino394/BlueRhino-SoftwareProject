import { databaseWrapper } from "../../databaseWrapper";
import { searchQuery } from "../../interfaces/searchQuery";
import { user } from "../../user";
import { card } from "../../card";
import { generateRandomUserAccountSchema, generateRandomCardContent } from "./utilityMethods";




describe("databaseWrapper.searchQuery()", () => {

    describe("Error Checking", () => {

        test("Expect error when undefined is passed in", async () => {
            await expect(databaseWrapper.searchQuery(undefined)).rejects.toThrowError("requestedQuery cannot be undefined");
        });

        test("Expect error when null is passed in", async () => {
            await expect(databaseWrapper.searchQuery(null)).rejects.toThrowError("requestedQuery cannot be null");
        });




        test("Expect NO errror when proper query is defined, but currentUser is not passed in", async () => {
            const query: searchQuery = {
                textQuery: "test",
                isMyCards: false,
                tags: [],
                pageNumber: 0
            }

            await expect(databaseWrapper.searchQuery(query)).resolves.toBeTruthy();
        });

        test("Expect NO errror when proper query is defined, but currentUser is undefined", async () => {
            const query: searchQuery = {
                textQuery: "test",
                isMyCards: false,
                tags: [],
                pageNumber: 0
            }

            await expect(databaseWrapper.searchQuery(query, undefined)).resolves.toBeTruthy();
        });

        test("Expect NO errror when proper query is defined, but currentUser is null", async () => {
            const query: searchQuery = {
                textQuery: "test",
                isMyCards: false,
                tags: [],
                pageNumber: 0
            }

            await expect(databaseWrapper.searchQuery(query, null)).resolves.toBeTruthy();
        });
    });

    describe("Search Query", () => {

        describe("Search for known card in the whole database", () => {

            var createdUser: user = undefined;
            var createdCard: card = undefined;

            beforeAll(async () => {
                // Create new user
                const newUserAccountSchema = generateRandomUserAccountSchema();
                createdUser = await databaseWrapper.createUser(newUserAccountSchema);

                // Create new card
                const newCardContent = generateRandomCardContent();
                createdCard = await databaseWrapper.createCard(createdUser.getUUID(), newCardContent);
            });

            afterAll(async () => {
                await databaseWrapper.deleteCard(createdCard.getID());
                await databaseWrapper.deleteUser(createdUser.getUUID());
            });



            test("Search by first name", async () => {
                const query: searchQuery = {
                    textQuery: createdUser.getAccountSchema().public.firstName,
                    isMyCards: false,
                    tags: [],
                    pageNumber: 0
                }

                const foundUUIDs = await databaseWrapper.searchQuery(query);
                expect(foundUUIDs).toContain(createdCard.getID());
            });

            test("Search by last name", async () => {
                const query: searchQuery = {
                    textQuery: createdUser.getAccountSchema().public.lastName,
                    isMyCards: false,
                    tags: [],
                    pageNumber: 0
                }

                const foundUUIDs = await databaseWrapper.searchQuery(query);
                expect(foundUUIDs).toContain(createdCard.getID());
            });

            test("Search by first and last name", async () => {

                const publicAccount = createdUser.getAccountSchema().public;
                const firstAndLastName = `${publicAccount.firstName} ${publicAccount.lastName}`;

                const query: searchQuery = {
                    textQuery: firstAndLastName,
                    isMyCards: false,
                    tags: [],
                    pageNumber: 0
                }

                const foundUUIDs = await databaseWrapper.searchQuery(query);
                expect(foundUUIDs).toContain(createdCard.getID());
            });

            test("Search by partial first and last name", async () => {

                const publicAccount = createdUser.getAccountSchema().public;
                const firstAndLastName = `${publicAccount.firstName} ${publicAccount.lastName}`;
                const partialFirstAndLastName = firstAndLastName.substring(0, firstAndLastName.length / 2);

                const query: searchQuery = {
                    textQuery: partialFirstAndLastName,
                    isMyCards: false,
                    tags: [],
                    pageNumber: 0
                }

                const foundUUIDs = await databaseWrapper.searchQuery(query);
                expect(foundUUIDs).toContain(createdCard.getID());
            });
        });

        describe("Search for known card in saved cards", () => {

            var createdUser: user = undefined;
            var createdCard: card = undefined;

            beforeAll(async () => {
                // Create new user
                const newUserAccountSchema = generateRandomUserAccountSchema();
                createdUser = await databaseWrapper.createUser(newUserAccountSchema);

                // Create new card
                const newCardContent = generateRandomCardContent();
                createdCard = await databaseWrapper.createCard(createdUser.getUUID(), newCardContent);
            });

            afterAll(async () => {
                await databaseWrapper.deleteCard(createdCard.getID());
                await databaseWrapper.deleteUser(createdUser.getUUID());
            });



            test("Search saved cards without passing in a user, but search for an existing card", async () => {
                const query: searchQuery = {
                    textQuery: createdUser.getAccountSchema().public.firstName,
                    isMyCards: true,
                    tags: [],
                    pageNumber: 0
                }

                const foundUUIDs = await databaseWrapper.searchQuery(query);
                expect(foundUUIDs).toContain(createdCard.getID());
            });

            test("Search saved cards for a card NOT in a provided user's savedCards list", async () => {

                // Create new user
                const newUserAccountSchema = generateRandomUserAccountSchema();
                const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);


                // Create search query
                const query: searchQuery = {
                    textQuery: createdUser.getAccountSchema().public.firstName,
                    isMyCards: true,
                    tags: [],
                    pageNumber: 0
                }

                const foundUUIDs = await databaseWrapper.searchQuery(query, newUser);
                expect(foundUUIDs).not.toContain(createdCard.getID());


                // clean up
                await databaseWrapper.deleteUser(newUser.getUUID());
            });

            test("Search saved cards for a card that IS in a provided user's savedCards list by firstName", async () => {

                // Create new user
                const newUserAccountSchema = generateRandomUserAccountSchema();
                const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

                // Save createdCard
                await newUser.addSavedCard(createdCard.getID());

                // Create search query
                const query: searchQuery = {
                    textQuery: createdUser.getAccountSchema().public.firstName,
                    isMyCards: true,
                    tags: [],
                    pageNumber: 0
                }

                const foundUUIDs = await databaseWrapper.searchQuery(query, newUser);
                expect(foundUUIDs).toContain(createdCard.getID());


                // clean up
                await databaseWrapper.deleteUser(newUser.getUUID());
            });

            test("Search saved cards for a card that IS in a provided user's savedCards list by lastName", async () => {

                // Create new user
                const newUserAccountSchema = generateRandomUserAccountSchema();
                const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

                // Save createdCard
                await newUser.addSavedCard(createdCard.getID());

                // Create search query
                const query: searchQuery = {
                    textQuery: createdUser.getAccountSchema().public.lastName,
                    isMyCards: true,
                    tags: [],
                    pageNumber: 0
                }

                const foundUUIDs = await databaseWrapper.searchQuery(query, newUser);
                expect(foundUUIDs).toContain(createdCard.getID());


                // clean up
                await databaseWrapper.deleteUser(newUser.getUUID());
            });

            test("Search saved cards for a card that IS in a provided user's savedCards list by firstName AND lastName", async () => {

                // Create new user
                const newUserAccountSchema = generateRandomUserAccountSchema();
                const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

                // Save createdCard
                await newUser.addSavedCard(createdCard.getID());

                const publicAccount = createdUser.getAccountSchema().public;
                const firstAndLastName = `${publicAccount.firstName} ${publicAccount.lastName}`;

                // Create search query
                const query: searchQuery = {
                    textQuery: firstAndLastName,
                    isMyCards: true,
                    tags: [],
                    pageNumber: 0
                }

                const foundUUIDs = await databaseWrapper.searchQuery(query, newUser);
                expect(foundUUIDs).toContain(createdCard.getID());


                // clean up
                await databaseWrapper.deleteUser(newUser.getUUID());
            });

            test("Search saved cards for a card that IS in a provided user's savedCards list by partial firstName AND lastName", async () => {

                // Create new user
                const newUserAccountSchema = generateRandomUserAccountSchema();
                const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

                // Save createdCard
                await newUser.addSavedCard(createdCard.getID());

                const publicAccount = createdUser.getAccountSchema().public;
                const firstAndLastName = `${publicAccount.firstName} ${publicAccount.lastName}`;
                const partialFirstAndLastName = firstAndLastName.substring(0, firstAndLastName.length / 2);

                // Create search query
                const query: searchQuery = {
                    textQuery: partialFirstAndLastName,
                    isMyCards: true,
                    tags: [],
                    pageNumber: 0
                }

                const foundUUIDs = await databaseWrapper.searchQuery(query, newUser);
                expect(foundUUIDs).toContain(createdCard.getID());


                // clean up
                await databaseWrapper.deleteUser(newUser.getUUID());
            });
        });
    });
});