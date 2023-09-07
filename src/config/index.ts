import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const {DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD} = process.env
export const db = new Sequelize(
    DB_NAME!,
    DB_USER!,
    DB_PASSWORD,
    {
        host: "localhost",
        port: DB_PORT as unknown as number,
        logging: false,
        dialect: "postgres"
    })

// export const db = new Sequelize(process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASSWORD as string, {
//     host: "localhost",
//     port: Number(process.env.DB_PORT),
//     dialect: "postgres",
//     logging: false
// });


//SENDING OTP TO PHONE
export const accountSid = process.env.AccountSid;
export const authToken = process.env.AuthToken
export const fromAdminPhone = process.env.fromAdninPhone

//SENDING OTP TO EMAIL
export const GMAIL_USER = process.env.Gmail
export const GMAIL_PASS = process.env.GmailPass
export const FromAdminMail = process.env.FromAdminMail as string
export const userSubject = process.env.userSubject as string
export const APP_SECRET = process.env.APP_SECRET as string;
export const Base_Url = process.env.BASE_URL as string;
export const port = process.env.PORT || 4000;
