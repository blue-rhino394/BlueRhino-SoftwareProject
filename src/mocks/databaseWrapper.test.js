const dbwrapper= require('./databaseWrapper.ts');
jest.mock('./databaseWrapper.ts');

test('Uses mock datawrapper to create new USer',()=>
{
    expect (dbwrapper.createUser).toHaveReturned();
})