const Emwrapper = require("../emailWrapper");
test("Send a email for new user", () =>{
    expect(Emwrapper.sendEmail).toHaveReturned();
})
test("Send Account verification Email", () =>{
    expect(Emwrapper. sendAccountVerificationEmail).toHaveReturned();
})
