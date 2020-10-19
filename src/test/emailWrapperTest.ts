﻿import { emailWrapper } from "../emailWrapper";




const testEmail = "grahamplankstudent@gmail.com";
const testSubject = "Development Message";
const testContent = "<p>Testing testing 1 2 3!!</p>";


console.log("Sending test email...");
emailWrapper.sendEmail(testEmail, testSubject, testContent, (err, result) => {
    console.log(`err: ${err}\nresult: ${result}`);
});