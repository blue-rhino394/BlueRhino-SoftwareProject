import { databaseWrapper } from "../databaseWrapper";
import { userAccountSchema } from "../interfaces/userAccountSchema";
import { user } from "../user";

const testAccountSchema: userAccountSchema = {
    email: "test@test.cool",
    passwordHash: "bonk",

    firstName: "Testy",
    lastName: "McTest",

    customURL: "test-slug",
    profilePictureURL: "https://ui-avatars.com/api/?name=Testy+McTest"
}




async function createUser(): Promise<user> {
    return await databaseWrapper.createUser(testAccountSchema);
}

async function deleteUser(uuid: string): Promise<string> {
    return await databaseWrapper.deleteUser(uuid);
}

async function getByID(uuid: string): Promise<user> {
    return await databaseWrapper.getUser(uuid);
}

async function getBySlug(uuid: string): Promise<user> {
    return await databaseWrapper.getUserBySlug(uuid);
}

async function getByEmail(uuid: string): Promise<user> {
    return await databaseWrapper.getUserByEmail(uuid);
}




async function runChecks() {

    // Create the user (should work!)
    const newUser = await createUser();
    console.log(`New UUID (Should be something): ${newUser.getUUID()}`);


    // Try to create the user again (should fail)
    const emptyUser = await createUser();
    console.log(`Failed UUID (Should Be Null): ${emptyUser}`);

    // Get the user by ID (should work!)
    const userByID = await getByID(newUser.getUUID());
    console.log(`By ID (Should be ${newUser.getUUID()}): ${userByID.getUUID()}`);

    // Get the user by slug (should work!)
    const userBySlug = await getBySlug(testAccountSchema.customURL);
    console.log(`By Slug (Should be ${newUser.getUUID()}): ${userBySlug.getUUID()}`);

    // Get the user by email (should work!)
    const userByEmail = await getByEmail(testAccountSchema.email);
    console.log(`By Email (Should be ${newUser.getUUID()}): ${userByEmail.getUUID()}`);

    // Delete the user (should work!)
    const err1 = await deleteUser(newUser.getUUID());
    console.log(`Delete User Error (should be empty): ${err1}`);

    // Try to get the user by ID (should fail)
    const emptyUser2 = await getByID(newUser.getUUID());
    console.log(`By ID (Should be null): ${emptyUser2}`);

    // Try to get the user by slug (should fail)
    const emptyUser3 = await getBySlug(testAccountSchema.customURL);
    console.log(`By Slug (Should be null): ${emptyUser3}`);

    // Try to get the user by email (should fail)
    const emptyUser4 = await getByEmail(testAccountSchema.email);
    console.log(`By Email (Should be null): ${emptyUser4}`);
}




runChecks().catch(console.dir);