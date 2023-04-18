
// Módulo de Node para gestionar el envío de emails.

const nodemailer = require('nodemailer');

// Conectarme a Servicios de Google para pedir el token

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const dotenv = require('dotenv').config();
const process = require('process');
const db = require("../models"); 
const EmailService = db.EmailService;

module.exports = class emailService {

    constructor(type) {

        if(type === 'smtp') {

            this.email = process.env.EMAIL; 

            this.transport = nodemailer.createTransport({
                pool: true,
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secureConnection: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
                tls: {
                    ciphers:'SSLv3',
                }
            });

        } 
        
        else if(type === 'gmail') {

            this.email = process.env.GOOGLE_EMAIL; 

            this.transport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.GOOGLE_EMAIL,
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                    accessToken: this.getAccessToken(),
                },

            });

        }
    }

    getAccessToken() {

        const myOAuth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URL,

        )

        myOAuth2Client.setCredentials({

            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const myAccessToken = myOAuth2Client.getAccessToken();

        return myAccessToken;
    }

    sendEmail(emailContent, toEmail= this.email) {

        const emailServiceSendMail = {
            from: this.email, 
            to: emailContent.email,
            subject: emailContent.subject,
            html: emailContent.message,
            attachedFile: emailContent.attachedFile
        }

        
        this.transport.sendMail(emailServiceSendMail, (err, result) => {

            if (err) {

                console.log(err);

            } else {

                const emailServiceSendMailDDBB = {
                    fromEmail: emailServiceSendMail.from, 
                    toEmail: emailServiceSendMail.to,
                    subject: emailContent.subject,
                    message: emailContent.message,
                    attachedFile: emailContent.attachedFile
                }  



                EmailService.create(emailServiceSendMailDDBB).then(data => {
            
                    console.log("Registro Email Service en BBDD");

                }).catch(err => {

                    console.log(err);
            
                });            
            }
        });

    }
}







