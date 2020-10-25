import { userAccountSchema } from "../interfaces/userAccountSchema";
import { databaseWrapper } from "../databaseWrapper";
import { user } from "../user";
import bcrypt from "bcrypt";
import { cardContent, cardPropertyMapToArray } from "../interfaces/cardContent";
import { cardLayout } from "../interfaces/cardLayout";
import { card } from "../card";



const dataJSON: string = `[
  {
    "firstName": "Celeste",
    "lastName": "Rojas",
    "email": "celesterojas@brhino.org",
    "password": "rojas445",
    "customURL": "crojas365",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Celeste+Rojas&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Nieves",
    "lastName": "Boyle",
    "email": "nievesboyle@brhino.org",
    "password": "boyle244",
    "customURL": "nboyle434",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Nieves+Boyle&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Deloris",
    "lastName": "Jimenez",
    "email": "delorisjimenez@brhino.org",
    "password": "jimenez939",
    "customURL": "djimenez99",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Deloris+Jimenez&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Anne",
    "lastName": "Barber",
    "email": "annebarber@brhino.org",
    "password": "barber297",
    "customURL": "abarber873",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Anne+Barber&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Muriel",
    "lastName": "Hewitt",
    "email": "murielhewitt@brhino.org",
    "password": "hewitt738",
    "customURL": "mhewitt836",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Muriel+Hewitt&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Frankie",
    "lastName": "Nolan",
    "email": "frankienolan@brhino.org",
    "password": "nolan208",
    "customURL": "fnolan642",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Frankie+Nolan&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Gilda",
    "lastName": "Hopper",
    "email": "gildahopper@brhino.org",
    "password": "hopper753",
    "customURL": "ghopper669",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Gilda+Hopper&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Freida",
    "lastName": "Walsh",
    "email": "freidawalsh@brhino.org",
    "password": "walsh63",
    "customURL": "fwalsh52",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Freida+Walsh&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Kline",
    "lastName": "Carney",
    "email": "klinecarney@brhino.org",
    "password": "carney977",
    "customURL": "kcarney477",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Kline+Carney&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Polly",
    "lastName": "Glenn",
    "email": "pollyglenn@brhino.org",
    "password": "glenn78",
    "customURL": "pglenn720",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Polly+Glenn&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Nunez",
    "lastName": "Talley",
    "email": "nuneztalley@brhino.org",
    "password": "talley836",
    "customURL": "ntalley574",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Nunez+Talley&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Lavonne",
    "lastName": "Butler",
    "email": "lavonnebutler@brhino.org",
    "password": "butler570",
    "customURL": "lbutler490",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Lavonne+Butler&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Tammi",
    "lastName": "Blanchard",
    "email": "tammiblanchard@brhino.org",
    "password": "blanchard311",
    "customURL": "tblanchard241",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Tammi+Blanchard&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Adele",
    "lastName": "Waters",
    "email": "adelewaters@brhino.org",
    "password": "waters529",
    "customURL": "awaters219",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Adele+Waters&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Shana",
    "lastName": "Bean",
    "email": "shanabean@brhino.org",
    "password": "bean15",
    "customURL": "sbean111",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Shana+Bean&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Ola",
    "lastName": "Goff",
    "email": "olagoff@brhino.org",
    "password": "goff670",
    "customURL": "ogoff849",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Ola+Goff&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Katheryn",
    "lastName": "Byrd",
    "email": "katherynbyrd@brhino.org",
    "password": "byrd238",
    "customURL": "kbyrd423",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Katheryn+Byrd&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Nolan",
    "lastName": "Conway",
    "email": "nolanconway@brhino.org",
    "password": "conway534",
    "customURL": "nconway186",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Nolan+Conway&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Loretta",
    "lastName": "Dickson",
    "email": "lorettadickson@brhino.org",
    "password": "dickson425",
    "customURL": "ldickson783",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Loretta+Dickson&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  },
  {
    "firstName": "Sheppard",
    "lastName": "Ford",
    "email": "sheppardford@brhino.org",
    "password": "ford895",
    "customURL": "sford753",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Sheppard+Ford&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
  }
]`;

// Parse the above string into an anonymous object
const data = JSON.parse(dataJSON);
addDummies(data);



async function addDummies(data: any): Promise<void> {
    for (var i = 0; i < data.length; i++) {
        await addDummy(data[i]);
    }
    console.log("\n\nAll done!\n\n\n");
}

async function addDummy(userRegistration: any): Promise<void> {
    // Hash the password!
    const passwordHash: string = await bcrypt.hash(userRegistration.password, 10);

    // Cram all of the required variables into an interface...
    const registrationForm: userAccountSchema = {
        email: userRegistration.email,
        passwordHash: passwordHash,

        public: {
            firstName: userRegistration.firstName,
            lastName: userRegistration.lastName,

            customURL: userRegistration.customURL,
            profilePictureURL: userRegistration.profilePictureURL
        }
    }

    console.log(`\nChecking for existing user '${registrationForm.public.firstName} ${registrationForm.public.lastName}'...`);
    const oldUser: user = await databaseWrapper.getUserByEmail(registrationForm.email);
    var oldCardID: string = "";

    // If there's already a user with this email, remove them
    if (oldUser) {
        console.log(`Removing existing user '${registrationForm.public.firstName} ${registrationForm.public.lastName}'...`);

        oldCardID = oldUser.getCardID();
        await databaseWrapper.deleteUser(oldUser.getUUID());
    }


    console.log(`Adding user '${registrationForm.public.firstName} ${registrationForm.public.lastName}' to database...`);
    const newUser: user = await databaseWrapper.createUser(registrationForm);

    if (!newUser) {
        console.log(`\t\tFailed to add user '${registrationForm.public.firstName} ${registrationForm.public.lastName}'`);
        return;
    }


    if (oldCardID) {
        console.log(`Checking for existing card for '${registrationForm.public.firstName} ${registrationForm.public.lastName}'...`);
        const oldCard: card = await databaseWrapper.getCard(oldCardID);

        if (oldCard) {
            console.log(`Removing existing card for '${registrationForm.public.firstName} ${registrationForm.public.lastName}'...`);
            await databaseWrapper.deleteCard(oldCard.getID());
        }
    }
    


    const newCardLayout: cardLayout = {
        background: "#FFFFFF",
        fontColor: "#000000"
    }

    var cardProps = new Map<string, string>();
    cardProps.set("Placeholder Card Status", "100%");


    const newCardData: cardContent = {
        published: true,
        tags: ["Placeholder", "Testing"],
        socialMediaLinks: [],
        cardProperties: cardPropertyMapToArray(cardProps),
        layout: newCardLayout
    }

    const newCard: card = await databaseWrapper.createCard(newUser.getUUID(), newCardData);

    if (!newCard) {
        console.log(`\t\tFailed to add card for '${registrationForm.public.firstName} ${registrationForm.public.lastName}'`);
        return
    }
}