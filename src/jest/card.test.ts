import { card } from "../card";
import { databaseWrapper } from "../databaseWrapper";
import { user } from "../user";
import { userAccountSchema } from "../interfaces/userAccountSchema";
import { cardSchema } from "../interfaces/cardSchema";
import { cardContent } from "../interfaces/cardContent";

// The user to test with
//      POPULATE IN BEFORE ALL
//      REMOVED IN AFTER ALL
var testUser: user = undefined;

// Before any tests execute...
beforeAll(async () => {
  //
  //  Register test user
  //

  // Create user account schema
  const newUserAccount: userAccountSchema = {
    email: "validtestemaildontactuallyusethisjoemama@brhino.org",
    passwordHash: "blablabla",

    public: {
      firstName: "joe",
      lastName: "mama",

      customURL:
        "brhinotestaccount-joemama-brhinotestaccount-dontactuallyusethis",
      profilePictureURL:
        "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6",
    },
  };

  // Actually register the test user
  testUser = await databaseWrapper.createUser(newUserAccount);
});

afterAll(async () => {
  //
  //  Remove Test User

  // Remove the test user from the database
  await databaseWrapper.deleteUser(testUser.getUUID());

});

describe("Card Testing 1", () => {
  //
  //  Settings
  //

  // The card to test with
  var testCard: card = undefined;

  // The content used to create it
  const content: cardContent = {
    published: false,
    tags: ["Testing Card", "Super Cool"],
    socialMediaLinks: [],
    cardProperties: [],
    layout: {
      background: "#c7ddff",
      fontColor: "#05152e",
    }
  }

  //
  //  Setup / Teardown
  //

  // Create testCard before tests run
  beforeAll(async () => {
    testCard = await databaseWrapper.createCard(testUser.getUUID(), content);
  });

  // Destroy testCard after tests finish
  afterAll(async () => {
    await testUser.setCardID("");
    await databaseWrapper.deleteCard(testUser.getCardID());
  });

  //
  //  Tests
  //

  test("Ensure getID() to return some cardid", async () => {
    expect(testCard.getID()).toBeTruthy();
  });
  test("Ensure getOwnerID() to return some ownerid", async () => {
    expect(testCard.getOwnerUUID()).toBeTruthy();
  });

  test("Ensure getCardSchemaID() to return some cardschema", async () => {
    expect(testCard.getCardSchema()).toBeTruthy();
  });

  describe("Testing CardContent()", () => {
    test("Ensure that tags is defined", () => {
      expect(testCard.getCardContent().tags).toBeDefined();
    });
    test("Ensure that socialMediaLinks is defined", () => {
      expect(testCard.getCardContent().socialMediaLinks).toBeDefined();
    });
    test("Ensure that cardProperties is defined", () => {
      expect(testCard.getCardContent().cardProperties).toBeDefined();
    });
    test("Ensure that layout is defined", () => {
      expect(testCard.getCardContent().layout).toBeDefined();
    });
  });

  describe("Testing getCardLayout()", () => {
    test("Ensure that cardlayout background is defined", () => {
      expect(testCard.getCardLayout().background).toBeDefined();
    });
    test("Ensure that cardlayout fontcolor is defined", () => {
      expect(testCard.getCardLayout().fontColor).toBeDefined();
    });
  });

  describe("Testing getCardStats()", () => {
    test("Ensure that cardstats cardviews is defined", () => {
      expect(testCard.getCardStats().cardViews).toBeDefined();
    });
    test("Ensure that cardstats saves is defined", () => {
      expect(testCard.getCardStats().saves).toBeDefined();
    });

    test("Ensure that cardstats favorites is defined", () => {
      expect(testCard.getCardStats().favorites).toBeDefined();
    });

    test("Ensure that cardstats memos is defined", () => {
      expect(testCard.getCardStats().memos).toBeDefined();
    });
    test("Ensure that cardstats social is defined", () => {
      expect(testCard.getCardStats().social).toBeDefined();
    });
  });

  describe("Test setContent", () => {
    test("Try setting published", async () => {
      const currentPublished = testCard.getCardContent().published;
      const newPublishedValue = !currentPublished;

      // Set only published
      await testCard.setCardContent({
        published: newPublishedValue,
        tags: undefined,
        socialMediaLinks: undefined,
        cardProperties: undefined,
        layout: undefined,
      });

      const recievedPublishedValue = testCard.getCardContent().published;
      expect(recievedPublishedValue).toEqual(newPublishedValue);
    });

    test("Try setting tags", async () => {
      const newTags: string[] = ["New Tags", "Way Cooler To Test"];

      // Set only tags
      await testCard.setCardContent({
        published: undefined,
        tags: newTags,
        socialMediaLinks: undefined,
        cardProperties: undefined,
        layout: undefined,
      });

      const recievedTags = testCard.getCardContent().tags;
      expect(recievedTags).toEqual(newTags);
    });
  });
  describe("Test setOwnerInfo", () => {
    test("Try setting ownerinfo", async () => {
      const currentOwner = testCard.getCardSchema().ownerInfo;


      // Set only published
      await testCard.setOwnerInfo({
        ownerInfo:currentOwner
      });

      const recievedOwner = testCard.getCardSchema().ownerInfo;
      expect(recievedOwner).toEqual(currentOwner);
    })
    
    
    describe("Test Stats", () => {
      
      test("Ensures that addStatView() is defined", () => {
      expect(testCard.addStatView(testCard.getCardStats().cardViews[1])).toBeDefined();
    })
  })
  test("Ensures that addStatFavorite() is defined", () => {
    expect(testCard.addStatFavorite(testCard.getCardStats().favorites[1])).toBeDefined();
  })
  test("Ensures that removeStatFavorite() is defined", () => {
    expect(testCard.removeStatFavorite(testCard.getCardStats().favorites[1])).toBeDefined();
  })
test("Ensures that addStatMemo() is defined", () => {
  expect(testCard.addStatMemo(testCard.getCardStats().memos[1])).toBeDefined();
})

test("Ensures that removeStatMemo() is defined", () => {
  expect(testCard.removeStatMemo(testCard.getCardStats().memos[1])).toBeDefined();
})

describe("Test Utility Methods", () => {

  test("Ensures that hasTags() has tags", () => {
    expect(testCard.hasTags(content.tags)).toBeDefined();
  })
  test("Ensures that hasText() has text", () => {
    expect(testCard.hasText("Joe Mama")).toBeDefined();
  })
})
})

/*


test("get ID", () => {

    const cardToTest: card = new card();


    expect(card.getId).toHaveReturned();
    expect(card.getOwnderUUID).toHaveReturned();
});
test("get this Card Schema", () =>{
    expect(card.getCardSchema).toHaveReturned();
})

test("gets the Card Content", () =>{
    expect(card.getCardContent).toHaveReturned();
})
test("gets the Card Layout", () =>{
    expect(card.getCardLayout).toHaveReturned();
})
test("gets the Card Stats", () =>{
    expect(card.getCardStats).toHaveReturned();
})
test("sets Card Contents", () =>{
    expect(card.setCardStats).toHaveReturned();
})

test('removes uuid from stats views', () =>{
    expect(card.removeStat).toHaveReturned();
})
test('add uuid to stats views', () =>{
    expect(card.addStat).toHaveReturned();
})
test('saves uuid to stats views', () =>{
    expect(card.addStatSave).toHaveReturned();
})

test('removes uuid to stats views', () =>{
    expect(card.removeStatSave).toHaveReturned();
})

test('Adds uuid to the favorites stat on this card',()=>{
    expect(card.addStatFavorite).toHaveReturned();
})
test('removes uuid from favorite stats views', () =>{
    expect(card.addStatFavorite).toHaveReturned();
})
test('add uuid to the memo stat on this card', () =>{
    expect(card.addStatMemo).toHaveReturned();
})
test('removes uuid from memos stats', () =>{
    expect(card.addStat).toHaveReturned();
})

test('Update the internal card content variables using a provided cardContent interface.', () =>{
    expect(card.updateInternalCardContent).toHaveReturned();
})
test('Update the internal card content variables using a provided cardContent interface.', () =>{
    expect(card.createJsonContentUpdateData).toHaveReturned();
})
test('Update the internal card content variables using a provided cardContent interface.', () =>{
    expect(card.createJsonLayoutUpdateData).toHaveReturned();
})
*/





