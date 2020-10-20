import { databaseWrapper } from "../databaseWrapper";
import { userAccountSchema } from "../interfaces/userAccountSchema";
import { user } from "../user";
import { accountStatus } from "../enum/accountStatus";

const testAccountSchema: userAccountSchema = {
    email: "test@test.cool",
    passwordHash: "bonk",

    firstName: "Testy",
    lastName: "McTest",

    customURL: "test-slug",
    profilePictureURL: "https://ui-avatars.com/api/?name=Testy+McTest"
}




async function runChecks() {

    console.log("Checking to see if user exists already...");
    const oldUser: user = await databaseWrapper.getUserByEmail(testAccountSchema.email);
    if (oldUser) {
        console.log("Removing existing user " + testAccountSchema.email);
        await databaseWrapper.deleteUser(oldUser.getUUID());
    }

    console.log("\nCreating new user...");
    var newUser: user = await databaseWrapper.createUser(testAccountSchema);
    const uuid = newUser.getUUID();
    const slug = newUser.getAccountSchema().customURL;
    const email = newUser.getAccountSchema().email;

    console.log("Setting account status...");
    newUser.setAccountStatus(accountStatus.Active);





    console.log("Attempting to get user again by ID...")
    newUser = await databaseWrapper.getUser(uuid);

    if (newUser) {
        console.log("Got user again by ID!");
    }
    else {
        console.log("Strange... could not get the user again by id...?");
    }




    console.log("Attempting to get user again by slug...")
    newUser = await databaseWrapper.getUserBySlug(slug);

    if (newUser) {
        console.log("Got user again by slug!");
    }
    else {
        console.log("Strange... could not get the user again by slug...?");
    }




    console.log("Attempting to get user again by email...")
    newUser = await databaseWrapper.getUserByEmail(email);

    if (newUser) {
        console.log("Got user again by email!");
    }
    else {
        console.log("Strange... could not get the user again by email...?");
    }


    await new Promise(r => setTimeout(r, 6 * 1000));


    console.log("Attempting to get user again after cache decay by ID...")
    newUser = await databaseWrapper.getUser(uuid);

    if (newUser) {
        console.log("Got user again by ID!");
    }
    else {
        console.log("Strange... could not get the user again by id...?");
    }



    console.log("Removing new user...");
    //await databaseWrapper.deleteUser(newUser.getUUID());

    console.log("Done!");
}



runChecks().catch(console.dir);