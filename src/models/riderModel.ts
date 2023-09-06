import { DataTypes, Model, Sequelize} from 'sequelize'
//import {v4 as uuidv4 } from 'uuid';
import {db} from '../config'
import { OrderInstance } from './orderModel';
export interface RiderAttributes{
    id: string;
    email:string;
    password:string;
    name:string;
    city:string;
    salt:string;
    validID:string;
    passport:string;
    documents:string
    phone: string;
    otp: number;
    otp_expiry: Date;
    lng:number;
    lat: number;
    plateNumber?:string;
    verified:boolean;
    role:string;
}
export class RiderInstance extends Model<RiderAttributes>{}
RiderInstance.init({
    id: {
        type:DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type:DataTypes.STRING,
        allowNull: false,
        unique:true,
        validate: {
            notNull: {
                msg: 'Email address is required'
            },
            isEmail: {
                msg: "please provide only valid email"
            }
        }
    },
    password: {
        type:DataTypes.STRING,
        allowNull:false,
        validate: {
            notNull: {
                msg: "password is required"
            },
            notEmpty: {
                msg: "provide a password",
            },
        }
    },
    name:{
        type:DataTypes.STRING,
        allowNull: false,
        validate:{
            notNull:{
                msg:"Name is required"
            },
            notEmpty:{
                msg:"please input your name"
            },
        }
    },
    city:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    validID: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    passport:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    documents:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    phone: {
        type:DataTypes.STRING,
        allowNull:false,
        unique: true,
        validate: {
            notNull:{
                msg: "phone number is required"
            },
            notEmpty: {
                msg: "provide a phone number",
            },
        }
    },
    otp: {
        type:DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Otp is required"
            },
            notEmpty: {
                msg: "provdide an Otp",
            },
        }
    },
    otp_expiry: {
        type:DataTypes.DATE,
        allowNull:false,
        validate: {
            notNull: {
                msg: "Otp expired",
            },
            notEmpty: {
                msg: "provdide an Otp",
            },
        }
    },
    plateNumber: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    lat: {
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    lng: {
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    verified: {
        type:DataTypes.BOOLEAN,
        allowNull: true,
    },
    role: {
        type:DataTypes.STRING,
        allowNull:true,
    },
},
    {
        sequelize:db,
        tableName:'rider'
    }
);

RiderInstance.hasMany(OrderInstance, {
    foreignKey: "riderId",
    as: "order"
 })

OrderInstance.belongsTo(RiderInstance, {
        foreignKey: "riderId",
        as: "rider"
    })



