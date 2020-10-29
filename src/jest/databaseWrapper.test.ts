import { databaseWrapper } from "../databaseWrapper";
import { userAccountSchema } from "../interfaces/userAccountSchema";
import { user } from "../user";

const dbwrapper = require("../databaseWrapper");
const { MongoClient } = require("mongodb");



test("Verify we're connected to MongoDB", async () => {
    const connectedResult = await databaseWrapper.verifyConnectedToMongoDB();

    expect(connectedResult).toBeTruthy();
});








test("Try creating a user", async () => {

    const newUserSchema: userAccountSchema = {
        email: "totallyfakeemailtotestwith@brhino.org",
        passwordHash: "blablabla",
        public: {
            firstName: "Test",
            lastName: "User",
            customURL: "totallyfakeslugthatshouldnevereverevereverbeused123",
            profilePictureURL: "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
        }
    }

    const newUser: user = await databaseWrapper.createUser(newUserSchema);
    expect(newUser).toBeTruthy();

    await databaseWrapper.deleteUser(newUser.getUUID());
});

test("Try creating a user that already exists", async () => {

    const newUserSchema: userAccountSchema = {
        email: "totallyfakeemailtotestwith@brhino.org",
        passwordHash: "blablabla",
        public: {
            firstName: "Test",
            lastName: "User",
            customURL: "totallyfakeslugthatshouldnevereverevereverbeused123",
            profilePictureURL: "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
        }
    }

    const newUser: user = await databaseWrapper.createUser(newUserSchema);
    const failedNewUser: user = await databaseWrapper.createUser(newUserSchema);

    expect(failedNewUser).toBeFalsy();

    await databaseWrapper.deleteUser(newUser.getUUID());
});








/*

describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(
      'mongodb+srv://main-access:${"Xpcdu9kTHUaaI03o"}@cluster0.x9cls.mongodb.net/${"passport"}?retryWrites=true&w=majority' +
        process.env.DATABASE,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    db = MongoClient.connection;
    const collection = process.env.COLLECTION;
    await db.createCollection(collection);
  });
  it("should create a new user", async () => {
    expect(dbwrapper.createUser()).toHaveReturned();
  });

  it("should delete new user", async () => {
    expect(dbwrapper.deleteUser()).toHaveReturned();
  });

  it("should get exisiting user", async () => {
    expect(dbwrapper.getUser()).toHaveReturned();
  });
  it("should get exisiting user by slug", async () => {
    expect(dbwrapper.getUserBySlug()).toHaveReturned();
  });

  it("should get exisiting user by emal", async () => {
    expect(dbwrapper.getUserByEmail()).toHaveReturned();
  });

  it("should create a new card", async () => {
    expect(dbwrapper.createCard()).toHaveReturned();
  });
  it("should delete new card", async () => {
    expect(dbwrapper.deleteCard()).toHaveReturned();
  });
  it("should get exisiting card", async () => {
    expect(dbwrapper.getCard()).toHaveReturned();
  });

  it("should search card using query", async () => {
    expect(dbwrapper.searchQuery()).toHaveReturned();
  });
});


*/