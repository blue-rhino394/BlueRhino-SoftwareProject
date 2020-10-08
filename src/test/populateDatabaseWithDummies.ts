import { userAccountSchema } from "../interfaces/userAccountSchema";
import { databaseWrapper } from "../databaseWrapper";

const passwordHashLibrary = require('password-hash');



const dataJSON: string = `[
  {
    "firstName": "Celeste",
    "lastName": "Rojas",
    "email": "celesterojas@brhino.org",
    "password": "rojas445",
    "customURL": "crojas365",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Celeste+Rojas"
  },
  {
    "firstName": "Nieves",
    "lastName": "Boyle",
    "email": "nievesboyle@brhino.org",
    "password": "boyle244",
    "customURL": "nboyle434",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Nieves+Boyle"
  },
  {
    "firstName": "Deloris",
    "lastName": "Jimenez",
    "email": "delorisjimenez@brhino.org",
    "password": "jimenez939",
    "customURL": "djimenez99",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Deloris+Jimenez"
  },
  {
    "firstName": "Anne",
    "lastName": "Barber",
    "email": "annebarber@brhino.org",
    "password": "barber297",
    "customURL": "abarber873",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Anne+Barber"
  },
  {
    "firstName": "Muriel",
    "lastName": "Hewitt",
    "email": "murielhewitt@brhino.org",
    "password": "hewitt738",
    "customURL": "mhewitt836",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Muriel+Hewitt"
  },
  {
    "firstName": "Frankie",
    "lastName": "Nolan",
    "email": "frankienolan@brhino.org",
    "password": "nolan208",
    "customURL": "fnolan642",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Frankie+Nolan"
  },
  {
    "firstName": "Gilda",
    "lastName": "Hopper",
    "email": "gildahopper@brhino.org",
    "password": "hopper753",
    "customURL": "ghopper669",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Gilda+Hopper"
  },
  {
    "firstName": "Freida",
    "lastName": "Walsh",
    "email": "freidawalsh@brhino.org",
    "password": "walsh63",
    "customURL": "fwalsh52",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Freida+Walsh"
  },
  {
    "firstName": "Kline",
    "lastName": "Carney",
    "email": "klinecarney@brhino.org",
    "password": "carney977",
    "customURL": "kcarney477",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Kline+Carney"
  },
  {
    "firstName": "Polly",
    "lastName": "Glenn",
    "email": "pollyglenn@brhino.org",
    "password": "glenn78",
    "customURL": "pglenn720",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Polly+Glenn"
  },
  {
    "firstName": "Nunez",
    "lastName": "Talley",
    "email": "nuneztalley@brhino.org",
    "password": "talley836",
    "customURL": "ntalley574",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Nunez+Talley"
  },
  {
    "firstName": "Lavonne",
    "lastName": "Butler",
    "email": "lavonnebutler@brhino.org",
    "password": "butler570",
    "customURL": "lbutler490",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Lavonne+Butler"
  },
  {
    "firstName": "Tammi",
    "lastName": "Blanchard",
    "email": "tammiblanchard@brhino.org",
    "password": "blanchard311",
    "customURL": "tblanchard241",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Tammi+Blanchard"
  },
  {
    "firstName": "Adele",
    "lastName": "Waters",
    "email": "adelewaters@brhino.org",
    "password": "waters529",
    "customURL": "awaters219",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Adele+Waters"
  },
  {
    "firstName": "Shana",
    "lastName": "Bean",
    "email": "shanabean@brhino.org",
    "password": "bean15",
    "customURL": "sbean111",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Shana+Bean"
  },
  {
    "firstName": "Ola",
    "lastName": "Goff",
    "email": "olagoff@brhino.org",
    "password": "goff670",
    "customURL": "ogoff849",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Ola+Goff"
  },
  {
    "firstName": "Katheryn",
    "lastName": "Byrd",
    "email": "katherynbyrd@brhino.org",
    "password": "byrd238",
    "customURL": "kbyrd423",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Katheryn+Byrd"
  },
  {
    "firstName": "Nolan",
    "lastName": "Conway",
    "email": "nolanconway@brhino.org",
    "password": "conway534",
    "customURL": "nconway186",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Nolan+Conway"
  },
  {
    "firstName": "Loretta",
    "lastName": "Dickson",
    "email": "lorettadickson@brhino.org",
    "password": "dickson425",
    "customURL": "ldickson783",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Loretta+Dickson"
  },
  {
    "firstName": "Sheppard",
    "lastName": "Ford",
    "email": "sheppardford@brhino.org",
    "password": "ford895",
    "customURL": "sford753",
    "profilePictureURL": "https://ui-avatars.com/api/?name=Sheppard+Ford"
  }
]`;

// Parse the above string into an anonymous object
const data = JSON.parse(dataJSON);

// Loop through each object...
data.forEach(function (userRegistration) {

    // Hash the password!
    const passwordHash = passwordHashLibrary.generate(userRegistration.password);

    // Cram all of the required variables into an interface...
    const registrationForm: userAccountSchema = {
        email: userRegistration.email,
        passwordHash: passwordHash,

        firstName: userRegistration.firstName,
        lastName: userRegistration.lastName,

        customURL: userRegistration.customURL,
        profilePictureURL: userRegistration.profilePictureURL
    }

    console.log(`Adding user '${registrationForm.firstName} ${registrationForm.lastName}' to database...`);
    databaseWrapper.createUser(registrationForm).then(function (success) {

        if (success) {
            console.log(`\t\tAdded user '${registrationForm.firstName} ${registrationForm.lastName}' correctly!!`);
        }
        else {
            console.log(`\t\tFailed to add user '${registrationForm.firstName} ${registrationForm.lastName}'...`);
        }
    });

});