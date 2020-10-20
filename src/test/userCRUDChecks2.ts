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
    const newUser: user = await databaseWrapper.createUser(testAccountSchema);


    console.log("Setting account status...");
    newUser.setAccountStatus(accountStatus.Active);



    //console.log("Removing new user...");
    //await databaseWrapper.deleteUser(newUser.getUUID());

    console.log("Done!");
}



runChecks().catch(console.dir);