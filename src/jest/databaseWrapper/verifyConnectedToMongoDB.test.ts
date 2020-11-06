import { databaseWrapper } from "../../databaseWrapper";


describe("databaseWrapper.verifyConnectedToMongoDB()", () => {

    test("Expect mongoDB to be connected", async () => {
        const connectionResult: boolean = await databaseWrapper.verifyConnectedToMongoDB();
        expect(connectionResult).toBe(true);
    });

})