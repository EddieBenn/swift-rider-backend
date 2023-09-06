import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const db = new Sequelize(process.env.CONNECTION_STRING!, 
    {
        logging: false,
        dialectOptions: {
            ssl: {
                require: false
            }
        }
    })

// export const db = new Sequelize(process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASSWORD as string, {
//     host: "localhost",
//     port: Number(process.env.DB_PORT),
//     dialect: "postgres",
//     logging: false
// });


//SENDING OTP TO PHONE
export const accountSid = process.env.ACCOUNTSID;
export const authToken = process.env.AUTHTOKEN
export const fromAdminPhone = process.env.FROMADMINPHONE

//SENDING OTP TO EMAIL
export const GMAIL_USER = process.env.Gmail
export const GMAIL_PASS = process.env.GmailPass
export const FromAdminMail = process.env.FromAdminMail as string
export const userSubject = process.env.userSubject as string
export const APP_SECRET = process.env.APP_SECRET as string;
export const Base_Url = process.env.BASE_URL as string;
export const URL = process.env.URL as string;
export const port = process.env.PORT || 4000;
