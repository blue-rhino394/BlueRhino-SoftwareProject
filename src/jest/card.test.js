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





