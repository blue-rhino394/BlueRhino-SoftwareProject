import { user } from "../user";
import { userSchema } from "../interfaces/userSchema";
import { accountStatus } from "../enum/accountStatus";
import { databaseWrapper } from "../databaseWrapper";
import { userAccountSchema } from "../interfaces/userAccountSchema";



describe("User Testing 1", () => {

    //
    //  Settings
    //

    // The user to test with
    var testUser: user = undefined;

    // The user schema used to create the test user
    const newUserSchema: userAccountSchema = {
        email: "fakeemailthatshouldneverexist@brhino.org",
        passwordHash: "blablabla",
        public: {
            firstName: "Test",
            lastName: "User",
            customURL: "fakeemailthatshouldneverexistslug",
            profilePictureURL: "https://ui-avatars.com/api/?name=Joe+Mama&format=png&font-size=0.33&rounded=true&size=300&bold=true&color=FFFFF&background=29b6f6"
        }
    }


    
    //
    //  Setup / Teardown
    //

    // Create testUser before tests run
    beforeAll(async () => {
        testUser = await databaseWrapper.createUser(newUserSchema);
    });

    // Destroy testUser after tests run
    afterAll(async () => {

        if (testUser.getCardID()) {
            await databaseWrapper.deleteCard(testUser.getCardID());
        }

        await databaseWrapper.deleteUser(testUser.getUUID());
    });





    test("Ensure getUUID() returns something defined", () => {
        expect(testUser.getUUID()).toBeDefined();
    });

    describe("Test getAccountSchema()", () => {

        test("Ensure that email was set correctly", () => {
            expect(testUser.getAccountSchema().email).toEqual(newUserSchema.email);
        });

        test("Ensure that password Hash was set correctly",()=>{
            expect(testUser.getAccountSchema().passwordHash).toEqual(newUserSchema.passwordHash);
        });
        test("Ensure that first name was set correctly",()=>{
            expect(testUser.getAccountSchema().public.firstName).toEqual(newUserSchema.public.firstName);
        });
        test("Ensure that first name was set correctly",()=>{
            expect(testUser.getAccountSchema().public.lastName).toEqual(newUserSchema.public.lastName);
        });
        test("Ensure that first name was set correctly",()=>{
            expect(testUser.getAccountSchema().public.customURL).toEqual(newUserSchema.public.customURL);
        });
        test("Ensure that first name was set correctly",()=>{
            expect(testUser.getAccountSchema().public.profilePictureURL).toEqual(newUserSchema.public.profilePictureURL);
        });


    });


    test("Ensures getCardID() returns something defined", () =>{
        expect(testUser.getCardID()).toBeDefined();
    });
    
    test("Ensures getSavedCard() returns something defined", () =>{
    expect(testUser.getSavedCard('1232354')).toBeDefined();
})
test("Ensures that getAllSaveCards() returns something defined",()=>
{
    expect(testUser.getAllSavedCards()).toBeDefined();
})

test("Ensures that getAccoutStatus returns something defined", () => {
    expect(testUser.getAccountStatus()).toBeDefined();
})

test("Ensures that getVerificationCode() returnes something defined",()=>{

    expect(testUser.getVerificationCode()).toBeDefined();

})




describe ("Test setCardID()",() =>{
    
    test("Ensures that card id will be set correctly",()=>
    {
         expect(testUser.setCardID(testUser.getCardID())).toBeDefined();
        })
/* 
        test("Ensures that the filter will be set correctly",()=>
        {
            expect(testUser.setCardID().filter).toEqual(testUser.getUUID);
        })
        test("Ensures that options will be set correctly",()=>
        {
            expect(testUser.setCardID().options).toBeFalsy();
        }) */
        })


        describe ("Test setAccountStatus()",() =>{
    
        
                test("Ensures that Account Status will be set correctly",()=>
                {
                    expect(testUser.setAccountStatus(testUser.getAccountStatus())).toBeDefined();
                })/* 
                test("Ensures that options will be set correctly",()=>
                {
                    expect(testUser.setAccountStatus().options).toBeFalsy();
                }) */
                })

                describe ("Test setVerficationCode()",() =>{
    
        
                    test("Ensures that the Verfication Code will be set correctly",()=>
                    {
                        expect(testUser.setVerificationCode(testUser.getVerificationCode())).toBeDefined();
                    })
     /*                test("Ensures that options will be set correctly",()=>
                    {
                        expect(testUser.setVerficationCode().options).toBeFalsy();
                    }) */
                    })


test("Ensures that tryPassword() is defined",()=>
{
    expect(testUser.tryPassword(newUserSchema.passwordHash)).toBeTruthy();
})

describe("Test addSavedCard()",()=>
{
    test("Ensures that savedCards is defined",()=>
{
    expect(testUser.addSavedCard('1232354')).toBeDefined();
          })
      })


      describe("Test updateSavedCard()",()=>
      {
          test("Ensures that savedCard update return true",()=>
      {
          expect(testUser.updateSavedCard(testUser.getSavedCard('1232354'))).toBeTruthy();
                })
            })


            describe("Test removeSavedCard()",()=>
            {
                test("Ensures that savedCard is removed return true",()=>
            {
                expect(testUser.removeSavedCard('1232354')).toBeTruthy();
                      })
                  })
                  

            describe("Test updateAccountSchema()",()=>
            {
                test("Ensures that savedCard is removed return true",()=>
            {
                expect(testUser.updateAccountSchema(testUser.getAccountSchema())).toBeDefined();
                      })
                  })
})







                    /*
test('sets Card ID', () => {
    expect(user.setCardID).toHaveReturned();
})
test("sets Account Status", () => {
    expect(user.setAccountStatus).toHaveReturned();
})

test("Utility method tries Password", ()=>{
    expect(user.tryPassword).toHaveReturned();
})
test("Utility method adds Saved Card", ()=>{
    expect(user.addSavedCard).toHaveReturned();
})

test("Utility method removes Saved Card", ()=>{
    expect(user.removeSavedCard).toHaveReturned();
})

test("Utility method updates Account Schema", ()=>{
    expect(user.updateAccountSchema).toHaveReturned();
})

test('Helper Method Updates internal Account Schema',()=>{
    expect(user.updateInternalAccountSchema).toHaveReturned();
})

test('Helper Method  Creates Json Account Update',()=>{
    expect(user.createJsonAccountUpdateData).toHaveReturned();
})




*/