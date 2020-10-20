const dBWrapper = require('./databaseWrapper');

test('Checking if the DB is connecting',()=>
{
    expect(dbWrapper.verifyConnectedToMongoDB).toBe(true);
}
)
test('Creating a new User', ()=>

    expect(dbWrapper.createUser(newAccountSchema))
 
}
