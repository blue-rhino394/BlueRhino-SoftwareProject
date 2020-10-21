const DBWrapper = require('./databaseWrapper');

test('Checking if the DB is connecting',()=>
{
    expect(DBWrapper.verifyConnectedToMongoDB).toBe(true);
}
)
test('Creating a new User', ()=>

    expect(DBWrapper.createUser(newAccountSchema));
 
})
