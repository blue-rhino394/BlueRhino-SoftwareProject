import { postEmailExistsResult } from "../interfaces/post/postEmailExistsResult";
import { postGenericResult } from "../interfaces/post/postGenericResult";
import { postGetCardResult } from "../interfaces/post/postGetCardResult";
import { cardSchema } from "../interfaces/cardSchema";
import { cardContent, cardPropertyMapToArray } from "../interfaces/cardContent";
import { cardStats, socialMapToArray } from "../interfaces/cardStats";
import { cardLayout } from "../interfaces/cardLayout";
import { postGetSavedCardsResult } from "../interfaces/post/postGetSavedCardsResult";
import { savedCard } from "../interfaces/savedCard";
import { postToggleFavoriteResult } from "../interfaces/post/postToggleFavoriteResult";
import { postToggleSaveResult } from "../interfaces/post/postToggleSaveResult";
import { postLoginResult } from "../interfaces/post/postLoginResult";
import { postSlugExistsResult } from "../interfaces/post/postSlugExistsResult";
import { postSearchCardResult } from "../interfaces/post/postSearchCardResult";
import { userAccountSchema } from "../interfaces/userAccountSchema";
import { userAccountPublicSchema } from "../interfaces/userAccountPublicSchema";



//
//      USER DATA
//

export function getDummyUserAccountSchema(): userAccountSchema {
    const userAccount: userAccountSchema = {
        email: "gfreeman@valvesoftware.com",
        passwordHash: "bla",
        public: getDummyUserAccountPublicSchema()
    }

    return userAccount;
}

export function getDummyUserAccountPublicSchema(): userAccountPublicSchema {
    const userAccountPublic: userAccountPublicSchema = {
        firstName: "Gordon",
        lastName: "Freeman",

        customURL: "gfreezy",
        profilePictureURL: "https://ui-avatars.com/api/?name=Gordon+Freeman"
    }

    return userAccountPublic;
}


//
//      CARD DATA
//



// Creates a dummy savedCard pointing to the same ID as Gordon Freeman's card
export function getDummySavedCard(): savedCard {
    const card: savedCard = {
        cardID: "b9fab74d-51e0-4d5e-9e76-92fb6379ff18",
        favorited: false,
        memo: ""
    };

    return card;
}

// Creates a dummy card schema for a person named Gordon Freeman,
// and populates it with related data.
export function getDummyCardSchema(): cardSchema {
    const card: cardSchema = {
        cardID: "b9fab74d-51e0-4d5e-9e76-92fb6379ff18",
        ownerID: "566062db-df68-434f-a56f-ef9439b93622",
        ownerInfo: getDummyUserAccountPublicSchema(),

        content: getDummyCardContent(),
        stats: getDummyCardStats()
    };

    return card;
}

// Creates dummy cardContent for Gordon Freeman
export function getDummyCardContent(): cardContent {
    const content: cardContent = {
        published: true,
        tags: ["Theoretical Physics", "Crowbar Expert"],
        socialMediaLinks: ["https://twitter.com/valvesoftware"],
        cardProperties: cardPropertyMapToArray(getDummyCardProperties()),
        layout: getDummyCardLayout()
    };

    return content;
}

// Creates a dummy card property map for Gordon Freeman
export function getDummyCardProperties(): Map<string, string> {
    var properties: Map<string, string> = new Map<string, string>();
    properties.set("Languages", "None");
    properties.set("Finished Projects", "Half-Life, Half-Life 2");

    return properties;
}

// Creates a dummy card layout for a basic blue card
export function getDummyCardLayout(): cardLayout {
    const layout: cardLayout = {
        background: "#c7ddff",
        fontColor: "#05152e"
    };

    return layout;
}

// Creates dummy cardStats for Gordon Freeman's card
export function getDummyCardStats(): cardStats {
    var socialStats: Map<string, string[]> = new Map<string, string[]>();
    socialStats.set("https://twitter.com/valvesoftware", ["dummyID0", "dummyID1", "dummyID2", "dummyID3"]);

    const stats: cardStats = {
        cardViews: ["dummyID0", "dummyID1", "dummyID2", "dummyID3", "dummyID4"],
        saves: ["dummyID0", "dummyID1", "dummyID2", "dummyID3"],
        favorites: ["dummyID0", "dummyID1"],
        memos: ["dummyID0", "dummyID1"],
        social: socialMapToArray(socialStats)
    };

    return stats;
}









//
//      POST DATA
//


// Create dummy post data indicating that there's no existing email
export function getDummyPostEmailExistsResult(): postEmailExistsResult {
    const responseData: postEmailExistsResult = {
        result: false
    };

    return responseData;
}

// Create dummy post data indicating that there's been no errors
export function getDummyPostGenericResult(): postGenericResult {
    const responseData: postGenericResult = {
        error: ""
    };

    return responseData
}

// Create dummy post data containing a single card for a user Gordon Freeman
export function getDummyPostGetCardResult(): postGetCardResult {
    const responseData: postGetCardResult = {
        error: "",
        card: getDummyCardSchema(),
    };

    return responseData;
}

// Create dummy post data containing one dummy card
export function getDummyPostGetSavedCardsResult(): postGetSavedCardsResult {
    const responseData: postGetSavedCardsResult = {
        error: "",
        savedCards: [getDummyCardSchema()]
    };

    return responseData;
}

// Create dummy post data saying that we've logged in correctly
export function getDummyPostLoginResult(): postLoginResult {
    const responseData: postLoginResult = {
        error: "",

        uuid: "566062db-df68-434f-a56f-ef9439b93622",
        email: "gfreeman@valvesoftware.com",
        firstName: "Gordon",
        lastName: "Freeman",

        customURL: "gfreezy",
        profilePictureURL: ""
    };

    return responseData;
}

export function getDummyPostSlugExistsResult(): postSlugExistsResult {
    const responseData: postSlugExistsResult = {
        result: false
    };

    return responseData;
}

// Create dummy post data indicating that we have toggled a card as favorite
export function getDummyPostToggleFavoriteResult(): postToggleFavoriteResult {
    const responseData: postToggleFavoriteResult = {
        error: "",
        isFavorited: true
    };

    return responseData;
}

// Create dummy post data indicating that we have toggled a card as saved
export function getDummyPostToggleSaveResult(): postToggleSaveResult {
    const responseData: postToggleSaveResult = {
        error: "",
        isSaved: true
    };

    return responseData;
}

// Create dummy post data with one search result - Gordon Freeman
export function getDummyPostSearchCardResult(): postSearchCardResult {
    const responseData: postSearchCardResult = {
        cards: [getDummyCardSchema()]
    };

    return responseData;
}