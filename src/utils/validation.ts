import Joi from "joi";
import bcrypt from "bcryptjs";
// import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();
import jwt, { JwtPayload } from "jsonwebtoken";
// import bcrypt from 'bcrypt';
import { APP_SECRET } from "../config/index";
import { AuthPayload } from "../interface/Auth.dto";

///rider signup
export const riderRegisterSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  confirmPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  phone: Joi.string().required(),
  city: Joi.string().required(),
  documents: Joi.string(),
  validID: Joi.string(),
  passport: Joi.string(),
  plateNumber: Joi.string().required(),
});
//Riders login
export const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
export const option = {
  abortearly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};
// Users Signup
export const registerSchema = Joi.object().keys({
  name: Joi.string(),
  email: Joi.string().required(),
  password: Joi.string().regex(/^[a-z0-9]{3,30}$/),
  phone: Joi.string(),
  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
});
export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};
export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};
export const GenerateSignature = async (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};
//GENERATE TOKEN FOR A USER
export const verifySignature = async (signature: string) => {
  return jwt.verify(signature, APP_SECRET) as JwtPayload;
};
export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};
export const editProfileSchema = Joi.object().keys({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  address: Joi.string(),
  passport: Joi.string()
});
//schema for reset Password
export const forgotPasswordSchema = Joi.object().keys({
    email:Joi.string().required()
})
export const resetPasswordSchema = Joi.object().keys({
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
    //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirm_password: Joi.any().equal(Joi.ref('password')).required().label('confirm password')
})
export const updateRiderSchema = Joi.object().keys({
    name:Joi.string().required(), 
    phone:Joi.string().required(),
    email:Joi.string().required(),
    city:Joi.string()
});

export const orderRideSchema = Joi.object().keys({
  pickupLocation: Joi.string().required(),
  packageDescription: Joi.string().required(),
  dropOffLocation: Joi.string().required(),
  dropOffPhoneNumber: Joi.string().required(),
  offerAmount: Joi.number().required(),
  paymentMethod: Joi.string().required(),
});