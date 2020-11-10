import { user } from "../../user";
import { databaseWrapper } from "../../databaseWrapper";
import { card } from "../../card";


const slugsToDelete: string[] = ["Testslug", "testslug1", "testt", "Test", "Testslug100", "Nope", "asses", "personal", "Joepoe.com", "testbye", "fugly.com", "wfjkowekf", "fwfewf", "fewfwef", "fwefew", "fjiwef", "fwefwe", "ewkfwo", "Teste", "funny", "google.com", "test", "daddy", "nocard", "MRXSS", "Brhinotestaccount-joemama-brhinotestaccount-dontactuallyusethis", "atestusersslug", "garbagetestslug", "testuser2", "testuser3", "testuser4", "testaccountsluggg", "greatest", "Qwhy8~", "batman", "1234", "newgrounds", "slugc415eb71-7b3c-47ba-a1d5-e3272115b5fd", "Slugc415eb71-7b3c-47ba-a1d5-e3272115b5fd", "7dc65c6d-4797-4e03-a330-39bee1e56e13", "fakeemailthatshouldneverexistslug", "d05632bf-c65b-42b5-be89-6de3373ebbaa", "2c416800-540e-47d1-be2c-78397f89d26d", "b5fc34c6-2b72-45ef-a472-86d71b7bc8d9", "09fede30-5a57-4696-8f3a-8a6b68e57a14", "20669964-f119-49f6-9f49-10e77098ddc9", "nusdf", "firefox", "fwfewfw", "woowoo", "slug33bbc162-16fa-4d96-97f7-423278cbad37", "slug5ae62f97-bf36-4a56-bcf5-bc3370ec5d7d", "slug43d31ef3-a6f5-4d8f-8c51-756574543f24", "slug1918b37b-88e4-4748-b36c-e24d3fd6e6de", "e01a661f-6ab6-4db1-add4-7ff70acdc9b6", "3bbb1d42-f329-4b4d-b4cb-52daa604752f", "931b0f09-72ad-4fcc-90ff-a23dd6a1e15f", "f823067a-70c7-47cf-8e49-ff63372c03da", "f78c1682-5fa0-4482-87e2-348eeeaf59e6"];





async function removeUsersBySlug(slugsToDelete: string[]): Promise<void> {

    var hasFoundUser = true;

    while (hasFoundUser) {

        // Set to false so that we finish when we're done with the for loop
        // UNLESS the for loop finds a user.
        hasFoundUser = false;

        for (const slug of slugsToDelete) {

            console.log(`Checking ${slug.toLowerCase()}...`);

            // Get the user
            const requestedUser: user = await databaseWrapper.getUserBySlug(slug.toLowerCase());

            // Get their card
            const requestedCard: card = await databaseWrapper.getCardBySlug(slug.toLowerCase());



            // If this card ACTUALLY exists...
            if (requestedCard) {

                // set the while loop to loop again for sure.
                hasFoundUser = true;

                // Remove from other user's savedCards
                await databaseWrapper.removeCardFromAllSavedCards(requestedCard.getID());

                // Delete card
                await databaseWrapper.deleteCard(requestedCard.getID());

                console.log(`Removed slug ${slug}'s card`);
            }

            // If this user ACTUALLY exists...
            if (requestedUser) {

                // set the while loop to loop again for sure.
                hasFoundUser = true;

                // Delete user
                await databaseWrapper.deleteUser(requestedUser.getUUID());

                console.log(`Removed slug ${slug.toLowerCase()}'s user`);
            }
        }
    }

    
}




removeUsersBySlug(slugsToDelete);