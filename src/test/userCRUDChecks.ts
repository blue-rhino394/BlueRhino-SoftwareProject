import { databaseWrapper } from "../databaseWrapper";
import { userAccountSchema } from "../interfaces/userAccountSchema";

const testAccountSchema: userAccountSchema = {
    email: "test@test.cool",
    passwordHash: "bonk",

    firstName: "Testy",
    lastName: "McTest",

    customURL: "test-slug",
    profilePictureURL: "https://ui-avatars.com/api/?name=Testy+McTest"
}




async function createUser(): Promise<string> {
    return await databaseWrapper.createUser(testAccountSchema);
}

async function deleteUser(uuid: string): Promise<string> {
    return await databaseWrapper.deleteUser(uuid);
}

async function getByID(uuid: string): Promise<string> {
    return await databaseWrapper.getUser(uuid);
}

async function getBySlug(uuid: string): Promise<string> {
    return await databaseWrapper.getUserBySlug(uuid);
}

async function getByEmail(uuid: string): Promise<string> {
    return await databaseWrapper.getUserByEmail(uuid);
}




async function runChecks() {

    // Create the user (should work!)
    const uuid = await createUser();
    console.log(`New UUID (Should be something): ${uuid}`);


    // Try to create the user again (should fail)
    const emptyUUID = await createUser();
    console.log(`Failed UUID (Should Be Empty): ${emptyUUID}`);

    // Get the user by ID (should work!)
    const uuidByID = await getByID(uuid);
    console.log(`By ID (Should be ${uuid}): ${uuidByID}`);

    // Get the user by slug (should work!)
    const uuidBySlug = await getBySlug(testAccountSchema.customURL);
    console.log(`By Slug (Should be ${uuid}): ${uuidBySlug}`);

    // Get the user by email (should work!)
    const uuidByEmail = await getByEmail(testAccountSchema.email);
    console.log(`By Email (Should be ${uuid}): ${uuidByEmail}`);

    // Delete the user (should work!)
    const err1 = await deleteUser(uuid);
    console.log(`Delete User Error (should be empty): ${err1}`);

    // Try to get the user by ID (should fail)
    const uuidByIDFailed = await getByID(uuid);
    console.log(`By ID (Should be empty): ${uuidByIDFailed}`);

    // Try to get the user by slug (should fail)
    const uuidBySlugFailed = await getBySlug(testAccountSchema.customURL);
    console.log(`By Slug (Should be empty): ${uuidBySlugFailed}`);

    // Try to get the user by email (should fail)
    const uuidByEmailFailed = await getByEmail(testAccountSchema.email);
    console.log(`By Email (Should be empty): ${uuidByEmailFailed}`);
}




runChecks().catch(console.dir);