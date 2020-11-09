import { userAccountSchema } from "../../interfaces/userAccountSchema";
import { v4 } from "uuid";
import { cardContent } from "../../interfaces/cardContent";
import { cardLayout } from "../../interfaces/cardLayout";
import { cardPropertyElement } from "../../interfaces/cardPropertyElement";




// Generates a random userAccountSchema using a bunch of randomly
// generated UUIDs.
export function generateRandomUserAccountSchema(): userAccountSchema {
    return {
        email: `${v4()}@${v4()}.com`,
        passwordHash: v4(),
        public: {
            firstName: `firstName${v4()}`,
            lastName: `lastName${v4()}`,
            customURL: `slug${v4()}`,
            profilePictureURL: "https://ui-avatars.com/api/?name=Test+User&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
        }
    }
}

// Generates a random cardContent using random values and randomly
// sized arrays
export function generateRandomCardContent(): cardContent {

    const published = true;
    const tagCount = Math.round(Math.random() * 3);
    const socialMediaLinkCount = Math.round(Math.random() * 3);
    const cardPropertyCount = Math.round(Math.random() * 3);
    const layout: cardLayout = {
        background: "#FFFFFF",
        fontColor: "#000000"
    }

    var tags: string[] = [];
    for (var i = 0; i < tagCount; i++) {
        tags.push(v4());
    }

    var socialMediaLinks: string[] = [];
    for (var i = 0; i < socialMediaLinkCount; i++) {
        socialMediaLinks.push(v4());
    }

    var cardProperties: cardPropertyElement[] = [];
    for (var i = 0; i < cardPropertyCount; i++) {
        cardProperties.push({
            key: v4(),
            value: v4()
        });
    }


    return {
        published: published,
        tags: tags,
        socialMediaLinks: socialMediaLinks,
        cardProperties: cardProperties,
        layout: layout
    }
}