const defineCardRest = require('./defineCardRest');

test('gets card'), ()=>{
    expect(cardRest.defineCardRest(postGetCardResult)).toBe(true);
}
 test('sets and deletes card'), ()=>{
        expect(cardRest.defineCardRest(postGenericResult)).toBe(true);
    }
test('gets saved card'), ()=>{
    expect(cardRest.defineCardRest(postGetSavedCardsResult)).toBe(true);
    }
 test('toggle save'), ()=>{
     expect(cardRest.defineCardRest(postToggleSaveResult)).toBe(true);
    }
 test('toggle favorite'), ()=>{
      expect(cardRest.defineCardRest(postToggleFavoriteResult)).toBe(true);
    }
test('generic result'), ()=>{
    expect(cardRest.defineCardRest(postGenericResult)).toBe(true);
    }
test('search result'), ()=>{
    expect(cardRest.defineCardRest(postSearchCardResultgg)).toBe(true);
    }
                    