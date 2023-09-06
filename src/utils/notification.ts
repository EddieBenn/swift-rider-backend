import { accountSid, authToken, fromAdminPhone, GMAIL_USER, GMAIL_PASS, FromAdminMail, userSubject} from '../config'
import nodemailer from 'nodemailer'
import { NumberInstance } from 'twilio/lib/rest/pricing/v2/number';

export const GenerateOTP = ()=>{
  const otp = Math.floor(1000 + Math.random() * 9000);
  const expiry = new Date();
  expiry.setTime(new Date().getTime() + 60 * 60 * 1000);
  return {otp,expiry};
}

export const onRequestOTP =async (otp:number, toPhoneNumber:string)=>{
  const client = require('twilio')(accountSid, authToken);
  const response =await client.messages 
  .create({
    body: `Your OTP is ${otp}`,
    to: toPhoneNumber,
    from: fromAdminPhone
  })
  return response
}

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user:GMAIL_USER,
    pass:GMAIL_PASS
  },
  tls:{
    rejectUnauthorized:false
  }
})

export const mailSent = async(
  from:string,
  to:string,
  subject:string,
  html:string
) => {
  try{
    const response = await transport.sendMail({
    from: FromAdminMail, subject:userSubject, to, html
    })
    return response
  }catch(err){
    console.log(err)
  }
}

  export const emailHtml=(otp:number):string=> {
    let response =`
    <div style="max-width: 700px; margin:auto; border:10px solid #ddd; border-radius:25px; padding:50px 20px; font-size:110%; font-family:sans-serif;">
    <h2 style="text-align:center; text-transform:uppercase; color:teal;">
    WELCOME TO SWIFT RIDERS
    </h2>
    <p>Hi there, your otp is ${otp}</p>
    </div>
    `
    return response
  }

/**===================user mail services =========== **/
  export const mailSent2 = async (
    from: string,
    to: string,
    subject: string,
    html: string,
  )=>{
    try {
     const response = await transport.sendMail(
        { from: FromAdminMail,
            subject:
            userSubject,
            to,
            html})
            return response
    } catch (error) {
        console.log(error)
    }
}
export const emailHtml2 = (link:string):string=>{
    let response =  `
    <div style="max-width:700px;
    margin:auto;
    border:10px solid #ddd;
    padding:50px 20px;
    font-size: 110%;
    font-style: italics
    "> 
    <h2 style="text-align:center;
    text-transform:uppercase;
    color:teal;
    ">
    Swift Riders
    </h2>
    <p>Hi there, below is your password reset link and it expires in 10 mins</p>
     ${link}
     <h3>DO NOT DISCLOSE TO ANYONE<h3>
     </div>
    `
    return response
}

export const randomDriver = (length:any) => {
  const random = Math.floor(Math.random() * length)
  return random
}