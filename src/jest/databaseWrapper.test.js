const dbwrapper = require("../databaseWrapper");
const { MongoClient } = require("mongodb");

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
