import nodemailer from "nodemailer";
import { google } from "googleapis";
import { OAuth2Client } from "googleapis-common";
import { user } from "./user";
import util from "util";
const OAuth2 = google.auth.OAuth2;



class emailWrapperClass {

    // Credentials
    private clientEmail: string;
    private clientID: string;
    private clientSecret: string;
    private clientRefreshToken: string;

    private clientOAuth2: OAuth2Client;
    private emailTransport: nodemailer.Transporter;



    //
    //  Constructor and Initialization
    //

    constructor() {
        console.log("Starting email wrapper...");

        // Get Credentials
        this.clientEmail = "brhino394@gmail.com";
        this.clientID = "539561539567-t303e2ljompm9el3a1qncihtn74iu8t7.apps.googleusercontent.com";
        this.clientSecret = "tcnlf7uWYhRO9aycC4VyYlkV";
        this.clientRefreshToken = "1//048wcitkuVHQmCgYIARAAGAQSNwF-L9Ir9lj-IRTfePRugjw_ql8d8CD6IxnxeflEZuJ6JNy0tbwPXnw1QalsxyXY02ISjTYIKgg";


        this.clientOAuth2 = this.createOAuth2Client();
        this.emailTransport = this.createEmailTransport();
    }

    // Creates and sets up an OAuth2 client
    private createOAuth2Client(): OAuth2Client {
        const client = new OAuth2Client(this.clientID, this.clientSecret);

        client.setCredentials({
            refresh_token: this.clientRefreshToken
        });

        return client;
    }

    // Creates and sets up a Nodemailer transporter
    private createEmailTransport(): nodemailer.Transporter {

        // Create the Nodemailer transporter using the provided options
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: this.clientEmail,
                clientId: this.clientID,
                clientSecret: this.clientSecret,
                refreshToken: this.clientRefreshToken
            }
        });


        return transporter;
    }





    //
    //  Public Functions
    //

    public async sendEmail(recipientEmail: string, subject: string, content: string): Promise<boolean> {

        // Construct the mail options
        const mailOptions: nodemailer.SendMailOptions = {
            from: this.clientEmail,
            to: recipientEmail,
            subject: subject,
            html: content
        }



        // Actually send the mail
        var sentEmail = true;
        await this.emailTransport.sendMail(mailOptions).catch(err => {

            console.log(err);
            sentEmail = false;
        });

        return sentEmail;
    }

    public async sendAccountVerificationEmail(userToSendTo: user, baseURL: string): Promise<boolean> {

        // Construct the link that'll get sent to actually verify the user's account
        const verifyLink = baseURL + "/verify-email?verificationToken=" + userToSendTo.getVerificationCode() + "&uuid=" + userToSendTo.getUUID();

        var emailContents = "<h1>Welcome to Passport!</h1>\n";
        emailContents += "<p>Click the link below to verify your email.</p>\n";
        emailContents += "<a href='http://" + verifyLink + "'>Verify Email</a>";

        const email = userToSendTo.getAccountSchema().email;


        return await this.sendEmail(email, "Passport Email Verification", emailContents);
    }
}


let emailWrapper: emailWrapperClass = new emailWrapperClass();
export { emailWrapper };