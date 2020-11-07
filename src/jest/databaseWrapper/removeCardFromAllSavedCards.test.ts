import { databaseWrapper } from "../../databaseWrapper";
import { v4 } from "uuid";
import { generateRandomUserAccountSchema, generateRandomCardContent } from "./utilityMethods";
import { user } from "../../user";
import { card } from "../../card";


describe("databaseWrapper.removeCardFromAllSavedCards()", () => {

    describe("Error Checking", () => {

        test("Expect error when undefined is passed in", async () => {
            await expect(databaseWrapper.removeCardFromAllSavedCards(undefined)).rejects.toThrowError("cardIDToRemove cannot be undefined");
        });

        test("Expect error when null is passed in", async () => {
            await expect(databaseWrapper.removeCardFromAllSavedCards(null)).rejects.toThrowError("cardIDToRemove cannot be null");
        });
    });

    describe("Remove Card From All Saved Cards", () => {

        test("Expect empty array when passed invalid cardID", async () => {

            const effectedUUIDs: string[] = await databaseWrapper.removeCardFromAllSavedCards(v4());
            expect(effectedUUIDs).toStrictEqual([]);
        });

        test("Expect empty array when passed valid cardID that's never been saved", async () => {

            // Create new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Create new card
            const newCardContent = generateRandomCardContent();
            const newCard: card = await databaseWrapper.createCard(newUser.getUUID(), newCardContent);

            const effectedUUIDs: string[] = await databaseWrapper.removeCardFromAllSavedCards(newCard.getID());
            expect(effectedUUIDs).toStrictEqual([]);



            // clean up
            await databaseWrapper.deleteCard(newCard.getID());
            await databaseWrapper.deleteUser(newUser.getUUID());
        });

        test("Expect array with 1 UUID when passed valid cardID that's in that user's savedCards", async () => {

            // Create new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Create new card
            const newCardContent = generateRandomCardContent();
            const newCard: card = await databaseWrapper.createCard(newUser.getUUID(), newCardContent);


            // Create another new user, that will save the above user's card
            const anotherNewUserAccountSchema = generateRandomUserAccountSchema();
            const anotherNewUser: user = await databaseWrapper.createUser(anotherNewUserAccountSchema);

            // Save card
            await anotherNewUser.addSavedCard(newCard.getID());


            // Remove it from all saved cards
            const effectedUUIDs: string[] = await databaseWrapper.removeCardFromAllSavedCards(newCard.getID());
            expect(effectedUUIDs).toStrictEqual([anotherNewUser.getUUID()]);



            // clean up
            await databaseWrapper.deleteCard(newCard.getID());
            await databaseWrapper.deleteUser(newUser.getUUID());
            await databaseWrapper.deleteUser(anotherNewUser.getUUID());
        });

        test("Expect a removed card to no longer be in an effected user's savedCards list", async () => {

            // Create new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Create new card
            const newCardContent = generateRandomCardContent();
            const newCard: card = await databaseWrapper.createCard(newUser.getUUID(), newCardContent);


            // Create another new user, that will save the above user's card
            const anotherNewUserAccountSchema = generateRandomUserAccountSchema();
            const anotherNewUser: user = await databaseWrapper.createUser(anotherNewUserAccountSchema);

            // Save card
            await anotherNewUser.addSavedCard(newCard.getID());


            // Remove it from all saved cards
            const effectedUUIDs: string[] = await databaseWrapper.removeCardFromAllSavedCards(newCard.getID());
            

            expect(anotherNewUser.getSavedCard(newCard.getID())).toBeFalsy();


            // clean up
            await databaseWrapper.deleteCard(newCard.getID());
            await databaseWrapper.deleteUser(newUser.getUUID());
            await databaseWrapper.deleteUser(anotherNewUser.getUUID());
        });

        test("Expect array with multiple UUIDs when passed valid cardID that's in that multiple user's savedCards", async () => {

            // Create new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Create new card
            const newCardContent = generateRandomCardContent();
            const newCard: card = await databaseWrapper.createCard(newUser.getUUID(), newCardContent);

            // Create a list of valid UUIDs to be
            // populated in the loop below
            var moreUUIDs: string[] = [];

            for (var i = 0; i < 3; i++) {
                // Create another new user, that will save the above user's card
                const anotherNewUserAccountSchema = generateRandomUserAccountSchema();
                const anotherNewUser: user = await databaseWrapper.createUser(anotherNewUserAccountSchema);

                moreUUIDs.push(anotherNewUser.getUUID());

                // Save card
                await anotherNewUser.addSavedCard(newCard.getID());
            }

            

            // Remove it from all saved cards
            const effectedUUIDs: string[] = await databaseWrapper.removeCardFromAllSavedCards(newCard.getID());

            expect(effectedUUIDs.sort()).toEqual(moreUUIDs.sort());



            // clean up
            await databaseWrapper.deleteCard(newCard.getID());
            await databaseWrapper.deleteUser(newUser.getUUID());
            for (const uuid of moreUUIDs) {
                await databaseWrapper.deleteUser(uuid);
            } 
        });

        test("Expect a removed card to no longer be in multiple effected user's savedCards list", async () => {

            // Create new user
            const newUserAccountSchema = generateRandomUserAccountSchema();
            const newUser: user = await databaseWrapper.createUser(newUserAccountSchema);

            // Create new card
            const newCardContent = generateRandomCardContent();
            const newCard: card = await databaseWrapper.createCard(newUser.getUUID(), newCardContent);

            // Create a list of valid users to be
            // populated in the loop below
            var moreUsers: user[] = [];

            for (var i = 0; i < 3; i++) {
                // Create another new user, that will save the above user's card
                const anotherNewUserAccountSchema = generateRandomUserAccountSchema();
                const anotherNewUser: user = await databaseWrapper.createUser(anotherNewUserAccountSchema);

                moreUsers.push(anotherNewUser);

                // Save card
                await anotherNewUser.addSavedCard(newCard.getID());
            }



            // Remove it from all saved cards
            const effectedUUIDs: string[] = await databaseWrapper.removeCardFromAllSavedCards(newCard.getID());

            for (const anotherUser of moreUsers) {
                expect(anotherUser.getSavedCard(newCard.getID())).toBeFalsy();
            }
            



            // clean up
            await databaseWrapper.deleteCard(newCard.getID());
            await databaseWrapper.deleteUser(newUser.getUUID());
            for (const anotherUser of moreUsers) {
                await databaseWrapper.deleteUser(anotherUser.getUUID());
            }
        });
    });
});