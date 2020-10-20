const user =require('../user');

test("get user ID", () =>{
    expect(user.getUUID).toHaveReturned();
});
test("get user Accounts Schema", () =>{
    expect(user.getAccountSchema).toHaveReturned();
})

test("gets the Card ID", () =>{
    expect(user.getCardID).toHaveReturned();
})
test("gets the user saved Cards", () =>{
    expect(user.getSavedCard).toHaveReturned();
})
test("gets Account Status", () => {
    expect(user.getAccountStatus).toHaveReturned();
})

test('sets Card ID", () => {
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




   