import { userAccountSchema } from "../../interfaces/userAccountSchema";
import { v4 } from "uuid";




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