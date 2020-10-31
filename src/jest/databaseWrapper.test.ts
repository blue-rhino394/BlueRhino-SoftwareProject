import { card } from "../card";
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



test("Testing deleteUSer() to deleteUSer by UUID", async () => {

  const userID: string = "23213432";
  
  const result = await dbwrapper.deleteOne({uuid:userID} );

  it('tests error with promises', () => {
    expect.assertions(result);
    return dbwrapper.removeCard.catch(e =>expect(e).toEqual({error: 'No Card by this ID', })
    )
  })
  expect(userID).toBeDefined();
  it('works with async/await and resolves', async () => {
    expect.assertions(result);
   expect(dbwrapper.deleteUser(userID)).toBeDefined();
  });
})
   

test("Testing deleteCard() to deletCard by cardID", async () => {

  const cardID: string = "23213432";
  
  const result = await dbwrapper.deleteOne({cardID:cardID} );

  it('tests error with promises', () => {
    expect.assertions(result);
    return dbwrapper.removeCard.catch(e =>expect(e).toEqual({error: 'No Card by this ID', })
    )
  })
  expect(cardID).toBeDefined();
  it('works with async/await and resolves', async () => {
    expect.assertions(result);
   expect(dbwrapper.deleteCard(cardID)).toBeDefined();
  })
  


test("Get user from user id to exist", async()=>{
  const userID: string = "23213432";
  const ExisitingUser: user = await dbwrapper.findone({uuid:userID});

expect(ExisitingUser).toEqual(userID);

});


















})











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