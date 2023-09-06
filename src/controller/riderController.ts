import { Request, Response, NextFunction } from "express";
import { RiderInstance, RiderAttributes } from "../models/riderModel";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  loginSchema,
  option,
  riderRegisterSchema,
  validatePassword,
  updateRiderSchema,
  verifySignature,
} from "../utils/validation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import {
  emailHtml,
  GenerateOTP,
  mailSent,
  onRequestOTP,
} from "../utils/notification";
import { FromAdminMail, userSubject } from "../config";
import { OrderInstance, OrderAttribute } from "../models/orderModel";
import { UserInstance, UserAttribute } from "../models/userModel";
import { idText } from "typescript";
import { NotificationInstance } from "../models/notification";
//@desc Register rider
//@route Post /rider/signup
//@access Public
export const registerRider = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      city,
      passport,
      validId,
      documents,
      plateNumber,
    } = req.body;
    console.log(req.body);
    const uuidrider = uuidv4();
    const validateResult = riderRegisterSchema.validate(req.body, option);
    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }
    const salt = await GenerateSalt();
    
    //trim the incoming email
    const newEmail = email.trim().toLowerCase();

    const userPassword = await GeneratePassword(password, salt);
    const { otp, expiry } = GenerateOTP();

    const riderEmail = (await RiderInstance.findOne({
      where: { email: newEmail },
    })) as unknown as RiderAttributes;

    const riderPhone = (await RiderInstance.findOne({
      where: { phone: phone },
    })) as unknown as RiderAttributes;

    const isUserEmail = (await UserInstance.findOne({
      where: { email: newEmail },
    })) as unknown as UserAttribute;
    const isUserPhone = (await RiderInstance.findOne({
      where: { phone: phone },
    })) as unknown as UserAttribute;

    let images = req.files;
    console.log("images", images)

    if (!riderEmail && !riderPhone && !isUserEmail && !isUserPhone) {
      let rider = await RiderInstance.create({
        id: uuidrider,
        name,
        email: newEmail,
        password: userPassword,
        salt,
        phone,
        documents: images[0].path,
        validID: images[2].path,
        city,
        passport: images[1].path,
        otp,
        otp_expiry: expiry,
        lng: 0,
        lat: 0,
        verified: false,
        role: "rider",
        plateNumber,
      });
      console.log(req.files)

      const html = emailHtml(otp);
      await mailSent(FromAdminMail, newEmail, userSubject, html);

      const Rider = (await RiderInstance.findOne({
        where: { email: newEmail },
      })) as unknown as RiderAttributes;

      let signature = await GenerateSignature({
        id: Rider.id,
        email: Rider.email,
        verified: Rider.verified,
      });

      return res.status(201).json({
        message: "Rider created successfully",
        signature,
        verified: Rider.verified,
      });
    }
    return res.status(400).json({ message: "Rider already exist" });
  } catch (err: any) {
    res.status(500).json({
      Error: "Internal Server error",
      message: err.stack,
      route: "/riders/signup",
      err,
    });
  }
};
export const getUserOrderById = async (req: JwtPayload, res: Response) => {
  try {
    const { id } = req.rider;

    const { orderId } = req.params;

    const rider = (await RiderInstance.findOne({
      where: { id: id },
    })) as unknown as RiderAttributes;

    if (rider) {
      const myOrder = await OrderInstance.findOne({
        where: { id: orderId },
        include: [
          {
            model: UserInstance,
            as: "user",
            attributes: ["name"],
          },
        ],
      });

      return res.status(200).json({
        message: "successfully fetched order by Id",
        myOrder,
      });
    }

    return res.status(401).json({
      Error: "user not authorized",
    });
  } catch (err) {
    return res.status(500).json({
      Error: "internal server error",
      route: "riders/get-order-byId/",
    });
  }
};

export const getOrderOwnerNameById = async (req: Request, res: Response) => {
  try {
    const { orderOwnerId } = req.params;
    const orderOwnerDetails = (await UserInstance.findOne({
      where: { id: orderOwnerId },
    })) as unknown as UserAttribute;

    if (orderOwnerDetails) {
      return res.status(200).json({
        message: "successfully fetched order by Id",
        owner: orderOwnerDetails.name,
      });
    }
    return res.status(404).json({
      Error: "Not Found",
    });
  } catch (err) {
    return res.status(500).json({
      Error: "internal server error",
      route: "riders/get-order-owner-name-byId/",
    });
  }
};

export const updateRiderProfile = async (req: JwtPayload, res: Response) => {
  try {
    const { id } = req.rider;
    const { name, phone, email } = req.body;
    const validateResult = updateRiderSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    const User = (await RiderInstance.findOne({
      where: { id: id },
    })) as unknown as RiderAttributes;

    //trim incoming email
    const newEmail = email.trim().toLowerCase();

    if (User) {
      const newUser = (await RiderInstance.update(
        {
          name,
          phone,
          email: newEmail,
        },
        { where: { id: id } }
      )) as unknown as RiderAttributes;
      if (newUser) {
        const User = (await RiderInstance.findOne({
          where: { id: id },
        })) as unknown as RiderAttributes;
        return res.status(200).json({
          message: "Profile updated successfully",
          User,
        });
      }
    return res.status(401).json({
      Error: "Failed to update profile",
    });
  } return res.status(401).json({
    Error: "You are not authorized"
  })
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/riders/update-rider",
    });
  }
};
/**==================Verify Users==================== **/
export const VerifyUser = async (req: Request, res: Response) => {
  try {
    const token = req.params.signature;
    const decode = await verifySignature(token);
    // check if user is a registered user
    const User = (await RiderInstance.findOne({
      where: { email: decode.email },
    })) as unknown as RiderAttributes;
    if (User) {
      const { otp } = req.body;
      //check if the otp submitted by the user is correct and is same with the one in the database
      if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
        //update user
        const updatedUser = (await RiderInstance.update(
          { verified: true },
          { where: { email: decode.email } }
        )) as unknown as RiderAttributes;
        // Generate a new Signature
        let signature = await GenerateSignature({
          id: updatedUser.id,
          email: updatedUser.email,
          verified: updatedUser.verified,
        });
        if (updatedUser) {
          const User = (await RiderInstance.findOne({
            where: { email: decode.email },
          })) as unknown as RiderAttributes;
          return res.status(200).json({
            message: "Your account have been verified successfully",
            signature,
            verified: User.verified,
          });
        }
      }
    }
    return res.status(400).json({
      Error: "invalid credentials or OTP already expired",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/verify",
    });
  }
};

/**============================Resend OTP=========================== **/
export const ResendOTP = async (req: Request, res: Response) => {
  try {
    const token = req.params.signature;
    const decode = await verifySignature(token);
    // check if user is a registered user
    const User = (await RiderInstance.findOne({
      where: { email: decode.email },
    })) as unknown as RiderAttributes;
    if (User) {
      //Generate otp
      const { otp, expiry } = GenerateOTP();
      //update user
      const updatedUser = (await RiderInstance.update(
        { otp, otp_expiry: expiry },
        { where: { email: decode.email } }
      )) as unknown as RiderAttributes;
      if (updatedUser) {
        //Send OTP to user
        // await onRequestOTP(otp, User.phone);
        //send Email
        const html = emailHtml(otp);
        await mailSent(FromAdminMail, User.email, userSubject, html);
        return res.status(200).json({
          message:
            "OTP resent successfully, kindly check your eamil or phone number for OTP verification",
        });
      }
    }
    return res.status(400).json({
      Error: "Error sending OTP",
    });
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/users/resend-otp/:signature",
    });
  }
};

//==========get all pending bids===========\\
export const getAllBiddings = async (req: JwtPayload, res: Response) => {
  try {
    let { limit, page } = req.query;
    limit = limit || 20;
    const offset = page ? page * limit : 0;
    const currentPage = page ? +page : 0;

    const bidding = await OrderInstance.findAndCountAll({
      limit: limit,
      offset: offset,
      where: { status: "pending" },
    });

    const { count, rows } = bidding;
    const totalPages = Math.ceil(count / limit);

    if (bidding) {
      return res.status(200).json({
        message: "You have successfully retrieved all pending bids",
        count,
        rows,
        currentPage,
        totalPages,
      });
    }
    return res.status(400).json({
      Error: "Error retrieving biddings",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/all-biddings",
      message: err,
    });
  }
};

//============== Rider accept bid==================\\
export const acceptBid = async (req: JwtPayload, res: Response) => {
  try {
    const { id } = req.rider;
    const { orderId } = req.params;

    const rider = await RiderInstance.findOne({ where: { id: id } });
    const order = await OrderInstance.findOne({ where: { id: orderId } });

    if (rider) {
      const { otp, expiry } = GenerateOTP()
      const updatedBidding = await OrderInstance.update(
        { status: "accepted", riderId: id, acceptedTime: new Date() },
        { where: { id: orderId } }
      );
      
      
      // const order = await OrderInstance.findOne({ where: { riderId: id } }) as unknown as OrderAttribute
      const user = await UserInstance.findOne({ where: { id: order!.dataValues.userId } }) as unknown as UserAttribute
      const html = emailHtml(otp);
      await mailSent(FromAdminMail, user.email, userSubject, html);
      

    //  console.log("updated bid", order)
      if (updatedBidding) {
        await NotificationInstance.create({
          id: uuidv4(),
          notificationType: "Accepted",
          riderId: id,
          orderId: orderId,
          userId: order!.dataValues.userId,
          description: order!.dataValues.packageDescription,
          read: false
        })
         return res.status(200).json({
          message: "Rider has accepted your order",
          data: {
            rider,
            user
          }
        },
        );

      }
      return res.status(400).json({
        Error: "Error accepting bid",
      });
    }
    return res.status(400).json({
      Error: "You are not authorised to view this page",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/rider/accept-bid/:id",
      message: err,
    });
  }
};

export const getOrderById = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.params.id;
    const riderId = req.rider.id;
    const rider = (await RiderInstance.findOne({
      where: { id: riderId },
    })) as unknown as RiderAttributes;
    if (rider) {
      const order = (await OrderInstance.findOne({
        where: { id: id },
      })) as unknown as OrderAttribute;

      if (order) {
        return res.status(200).json({
          message: "Order retrieved successfully",
          order,
        });
      }
    }

    return res.status(400).json({
      Error: "Not authorized",
    });
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/rider/get-order-by-id/:id",
    });
  }
};

/**============================Rider History=========================== **/
export const RiderHistory = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.rider.id;
    const Rider = await RiderInstance.findOne({ where: { id: id } });
    if (Rider) {
      const history = await OrderInstance.findAndCountAll({
        where: { riderId: id },
      });

      if (!history)
        return res.status(404).json({
          Error: "no data available",
        });
      return res.status(200).json({
        rows: history.rows,
        count: history.count,
      });
    }
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/riders/rider-history",
      err: err,
    });
  }
};

/** ============= Get Rider Profile  =====================*/
export const getRiderProfile = async (req: Request, res: Response) => {
  try {
    const { riderId } = req.params;
    const order = await OrderInstance.findOne({
      where: { riderId: riderId },
      include: [
        {
          model: RiderInstance,
          as: "rider",
          attributes: ["id", "name", "phone", "plateNumber", "passport"],
        },
      ],
    });

    if (order) {
      return res.status(200).json({
        message: "You have successfully retrieved your profile",
        order,
      });
    }
    return res.status(400).json({
      Error: "Error retrieving profile",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/rider-order-profile",
      message: err,
    });
  }
};

/**==================Delivery OTP==================== **/
export const VerifyDeliveryOtp = async (req: JwtPayload, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const riderId = req.rider.id;
    // const token = req.params.signature    // const decode = await verifySignature(riderId)
    // // check if user is a registered user
    const order = (await OrderInstance.findOne({
      where: { id: orderId, riderId: riderId, status: "accepted" },
    })) as unknown as OrderAttribute;
    
    console.log(order);
    if (order) {
      //check if the otp submitted by the user is correct and is same with the one in the database
      const { otp } = req.body;
      const hour = 100 * 60 * 60;
      const anHour = Date();
      const newDate = new Date();
      const getHrAgo = (e:any) => {
        return new Date(e - hour);
      };
      if (order.otp == parseInt(otp) && order.otp_expiry >= getHrAgo(newDate)) {
        //update user
        const updatedOrder = (await OrderInstance.update(
          { status: "completed", completedTime: new Date() },
          { where: { otp: order.otp } }
        )) as unknown as OrderAttribute;
        console.log(order);
        if (updatedOrder) {
          const Order = (await OrderInstance.findOne({
            where: { id: orderId },
          })) as unknown as OrderAttribute;
          return res.status(200).json({
            message: "Otp successfully verified",
          });
        }
        return res.status(400).json({
          Error: "invalid credentials or OTP already expired",
        });
      }
      return res.status(400).json({
        Error: "OTP has expired",
      });
    }
    return res.status(400).json({
      Error: "Order does not exist",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      Error: "Internal server Error",
      route: "/riders/delivery-verify",
    });
  }
};
/**============================Resend OTP=========================== **/
export const DeliveryResendOTP = async (req: JwtPayload, res: Response) => {
  try {
    const orderId = req.params.orderId;
    // const riderId = req.rider.id;

    console.log(orderId)
    const order = (await OrderInstance.findOne({
      where: { id: orderId },
    })) as unknown as OrderAttribute;
    console.log("oder", order)
    if (order) {
      //Generate otp
      const { otp, expiry } = GenerateOTP();
      //update user
      const updatedOrder = (await OrderInstance.update(
        { otp: otp, otp_expiry: expiry },
        { where: { id: order.id } }
      )) as unknown as OrderAttribute;
      if (updatedOrder) {
        //Send OTP to user
        // await onRequestOTP(otp, User.phone);
        //send Email
        const user = (await UserInstance.findOne({
          where: { id: order.userId },
        })) as unknown as UserAttribute;
        const html = emailHtml(otp);
        await mailSent(FromAdminMail, user.email, userSubject, html);
        return res.status(200).json({
          message:
            "OTP resent successfully, kindly check your email or phone number for OTP verification",
        });
      }
    }
    return res.status(400).json({
      Error: "Error sending OTP",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/riders/resend-otp/:signature",
    });
  }
};

/**============================Earnings=========================== **/

export const RiderEarnings = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.rider.id;
    const Rider = await RiderInstance.findOne({ where: { id: req.rider.id } });
    if (Rider) {
      const result = await OrderInstance.findAndCountAll({
        limit: 10,
        offset: 0,
        order: [["completedTime", "DESC"]],
        where: {
          riderId: id,
          status: "completed",
        },
      });

      return res.status(201).json({
        message: "You have successfully retrieved your earnings",
        rows: result.rows,
        count: result.count,
      });
    }
    return res.status(401).json({
      Error: "You must be a registered rider",
    });
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/riders/rider-earnings",
      err: err,
    });
  }
};

/**==================Get Rider Details==================== **/
export const getRider = async (req:JwtPayload, res:Response) => {
  try{
    const {id} = req.rider;

    const isRider = (await RiderInstance.findOne(
      {
        where: {id: id},
        attributes: ["name", "phone", "email"]
      },
    
    ));

    if(!isRider) return res.status(404).json({
      Error: "User not found"
    })

    return res.status(200).json({
      message: "request was successful",
      isRider
    })

  }catch(err) {
    return res.status(500).json({
      Error: "Internal server error",
      route: "rider/get-user-profile"
    })
  }
}
/*************************GET ALL COMPLETED ORDERS ****************************/
export const getMyCompletedRides = async (req: JwtPayload, res: Response) => {
  try {
    const { id } = req.rider;

    const user = (await RiderInstance.findOne({
      where: { id: id },
    })) as unknown as RiderAttributes;

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const completedOrders = await OrderInstance.findAndCountAll({
      where: { riderId: id, status: "completed" },
    });

    if (!completedOrders) {
      return res.status(400).json({
        message: "No orders found",
      });
    }

    return res.status(200).json({
      message: "Orders fetched successfully",
      count: completedOrders.count,
    });
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/riders-completed-rides",
      msg: error,
    });
  }
};
//==========================GET Accepted Biddings====================**/
export const getAcceptedBid = async (req: JwtPayload, res: Response) => {
  try {
    const { id } = req.rider;
    const user = (await RiderInstance.findOne({
      where: { id: id },
    })) as unknown as RiderAttributes;
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const Orders = await OrderInstance.findAndCountAll({
      where: { riderId: id, status: "accepted" },
    });
    if (!Orders) {
      return res.status(400).json({
        message: "No orders found",
      });
    }
    return res.status(200).json({
      message: "Orders fetched successfully",
      rows: Orders.rows,
      count: Orders.count,
    });
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/get-all-rides",
      msg: error,
    });
  }
};
