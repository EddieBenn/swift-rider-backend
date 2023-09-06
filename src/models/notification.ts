import {  Model, DataTypes } from "sequelize";
import { db } from "../config";
import { OrderInstance } from "./orderModel";
import { UserInstance } from "./userModel";


export interface NotificationAttributes {
  id: string;
  notificationType: string;
  riderId: string;
  orderId: string;
  userId: string;
  description: string;
  read: boolean;
}
export class NotificationInstance extends Model<NotificationAttributes> {
  declare id: string;
  declare notificationType: string;
  declare riderId: string;
  declare orderId: string;
  declare userId: string;
  declare description: string;
  declare read: boolean;
}
NotificationInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    notificationType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "notificationType is required" },
        notEmpty: { msg: "Provide a notificationType " },
        // isIn: [["Order request", "rating"]],
      },
    },
    riderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    read: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "unread",
    },
  },
  {
    sequelize: db,
    tableName: "notifications",
  }
);
NotificationInstance.belongsTo(OrderInstance, {
  as: "order",
});
NotificationInstance.belongsTo(UserInstance, {
  foreignKey: "userId",
  as: "user",
});