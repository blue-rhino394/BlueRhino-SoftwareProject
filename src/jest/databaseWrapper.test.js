const dbwrapper= require('../databaseWrapper');


test('Uses datawrapper to create new User',async ()=>
{
    const data=await fetchData();
    expect(dbwrapper.createuser()).toReturn();
}
)

test('the fetch fails with an error', async () => {
    expect.assertions(1);
    try {
      await fetchData();
    } catch (e) {
      expect(e).toMatch('error');
    }
  });