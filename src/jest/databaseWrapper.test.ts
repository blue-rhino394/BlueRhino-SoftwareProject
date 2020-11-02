import { card } from "../card";
import { databaseWrapper } from "../databaseWrapper";
import { cardSchema } from "../interfaces/cardSchema";
import { cardStats } from "../interfaces/cardStats";
import { searchQuery } from "../interfaces/searchQuery";
import { userAccountSchema } from "../interfaces/userAccountSchema";
import { getDummyUserAccountSchema } from "../test/dummyData";
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
      profilePictureURL:
        "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6",
    },
  };

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
      profilePictureURL:
        "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6",
    },
  };

  const newUser: user = await databaseWrapper.createUser(newUserSchema);
  const failedNewUser: user = await databaseWrapper.createUser(newUserSchema);

  expect(failedNewUser).toBeFalsy();

  await databaseWrapper.deleteUser(newUser.getUUID());
});

test("Testing deleteUser() to deleteUSer by UUID", async () => {
  const userID: string = "23213432";

  const result = await databaseWrapper.deleteUser(userID);
  expect(result).toBeDefined();
});

test("Get user from user id to exist", async () => {
  const userID: string = "23213432";
  const ExisitingUser: user = await databaseWrapper.getUser(userID);

  expect(ExisitingUser).toBeDefined();
});

test("Get user from user slug to exist", async () => {
  const newUserSchema: userAccountSchema = {
    email: "totallyfakeemailtotestwith@brhino.org",
    passwordHash: "blablabla",
    public: {
      firstName: "Test",
      lastName: "User",
      customURL: "totallyfakeslugthatshouldnevereverevereverbeused123",
      profilePictureURL:
        "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6",
    },
  };
  const userslug = await databaseWrapper.getUserBySlug(
    newUserSchema.public.customURL
  );
  expect(userslug).toBeDefined();
});

test("Get user from user email to exist", async () => {
  const newUserSchema: userAccountSchema = {
    email: "totallyfakeemailtotestwith@brhino.org",
    passwordHash: "blablabla",
    public: {
      firstName: "Test",
      lastName: "User",
      customURL: "totallyfakeslugthatshouldnevereverevereverbeused123",
      profilePictureURL:
        "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6",
    },
  };
  const useremail = await databaseWrapper.getUserByEmail(newUserSchema.email);

  expect(useremail).toBeDefined();
  await databaseWrapper.getUserByEmail(newUserSchema.email);
});

test("Testing createCard() to createCard by OwnerID and Conten", async () => {
  const cardstat: cardStats = {
    cardViews: undefined,
    saves: ["32"],
    favorites: undefined,
    memos: undefined,
    social: undefined,
  };
  const cardschema: cardSchema = {
    cardID: " 78232ew3",
    ownerID: undefined,
    ownerInfo: undefined,
    content: undefined,
    stats: cardstat,
  };

  const cardInsert = await databaseWrapper.createCard(
    cardschema.ownerID,
    cardschema.content
  );

  expect(cardInsert).toBeDefined();
  await databaseWrapper.createCard(cardschema.ownerID, cardschema.content);
});

test("Testing deleteCard() to deletCard by cardID", async () => {
  const cardID: string = "23213432";

  const result = await databaseWrapper.deleteCard(cardID);
  expect(result).toBeTruthy();
  await databaseWrapper.deleteCard(cardID);
});

test("Testing getCard() to getCard by cardID", async () => {
  const cardID: string = "23213432";

  const result = await databaseWrapper.getCard(cardID);
});

test("Testing getCard() to getCard by slug", async () => {
  const newUserSchema: userAccountSchema = {
    email: "totallyfakeemailtotestwith@brhino.org",
    passwordHash: "blablabla",
    public: {
      firstName: "Test",
      lastName: "User",
      customURL: "totallyfakeslugthatshouldnevereverevereverbeused123",
      profilePictureURL:
        "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6",
    },
  };

  const result = await databaseWrapper.getCardBySlug(
    newUserSchema.public.customURL
  );
  expect(result).toBeDefined();
  await databaseWrapper.getCardBySlug(newUserSchema.public.customURL);
});

test("Testing searchQuery()", async () => {
  const search: searchQuery = {
    textQuery: "Totally Fake",
    tags: ["Testing Card", "Super Cool"],
    isMyCards: undefined,
    pageNumber: undefined,
  };

  const resultText = await databaseWrapper.searchQuery(search);
  expect(resultText).toBeDefined();
  await databaseWrapper.searchQuery(search);
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
