const card =require('../card');

test("get ID", () =>{
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


