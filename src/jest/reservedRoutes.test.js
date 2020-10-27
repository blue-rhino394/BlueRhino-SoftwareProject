const Route = require("../reservedRoutes");

test("Adds a route to this object", () =>{

    expect(Route.addRoute).toHaveReturned();
})

test(" Removes a route from this object", () =>{
    expect(Route.removeRoute).toHaveReturned();

test("Looks to see if the provided route is in this object",()=>
{
    expect(Route.hasRoute).toHaveReturned();

})
