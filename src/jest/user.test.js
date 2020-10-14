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



