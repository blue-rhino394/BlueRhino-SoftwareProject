const Emwrapper = require("../emailWrapper");
it("Send a email for new user", () =>{
    expect(Emwrapper.sendEmail).toHaveReturned();
})
it("Send Account verification Email", () =>{
    expect(Emwrapper. sendAccountVerificationEmail).toHaveReturned();
})
