import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { DataTypes, Model } from "sequelize";
import { db } from "../config";
import { OrderInstance } from "./orderModel";

export interface UserAttribute {
  id: string;
  phone: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  address: string;
  otp: number;
  otp_expiry: Date;
  longitude: number;
  latitude: number;
  verified:boolean
  role: string;
  passport?: string;
}
export class UserInstance extends Model<UserAttribute> {}

UserInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please input phone number",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email address is required",
        },
        isEmail: {
          msg: "Please provide a valid email",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please input password",
        },
      },
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passport: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "otp required",
        },
      },
    },
    otp_expiry: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
            msg: "Otp expired"
        },
        notEmpty: {
            msg: "provide an Otp"
        },
      }
    },
    longitude: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    verified:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        validate:{
            notNull:{
                msg:"user must be verified"
            },
            notEmpty:{
                msg:"User not verified"
            }
        }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },

  {
    sequelize: db,
    tableName: "user",
  }
);


UserInstance.hasMany(OrderInstance, {foreignKey:'userId', as:'order'});
OrderInstance.belongsTo(UserInstance, {foreignKey:'userId', as:'user' } );