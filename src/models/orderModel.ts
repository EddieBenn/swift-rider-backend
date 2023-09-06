import { DataTypes, Model } from "sequelize";
import { db } from "../config";
export interface OrderAttribute {
  id: string;
  otp: number;
  otp_expiry: Date;
  pickupLocation: string;
  packageDescription: string;
  dropOffLocation: string;
  dropOffPhoneNumber: string;
  offerAmount: number;
  paymentMethod: string;
  orderNumber: string;
  status: string;
  userId: string;
  dateCreated: Date;
  acceptedTime?: Date;
  completedTime?: Date;
  riderId?: string;
}
export class OrderInstance extends Model<OrderAttribute> {}
OrderInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
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
      allowNull:false,
      validate: {
        notNull: {
            msg: "Otp expired"
        },
        notEmpty: {
            msg: "provide an Otp"
        },
      }
    },
    pickupLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "pick up location is required",
        },
        notEmpty: {
          msg: "provide a pickup location",
        },
      },
    },
    packageDescription: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "package description is required",
        },
        notEmpty: {
          msg: "provide package description",
        },
      },
    },
    dropOffLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Drop of location is required",
        },
        notEmpty: {
          msg: "provide drop of location",
        },
      },
    },
    dropOffPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Drop off phone number is required",
        },
        notEmpty: {
          msg: "provide a drop off phone number",
        },
      },
    },
    offerAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: true
  },
    acceptedTime: {
      type: DataTypes.DATE,
      allowNull: true
  },
    completedTime: {
      type: DataTypes.DATE,
      allowNull: true
  },
  riderId: {
    type: DataTypes.UUID,
    allowNull: true
 }
},
  {
    sequelize: db,
    tableName: "order",
  }
);
