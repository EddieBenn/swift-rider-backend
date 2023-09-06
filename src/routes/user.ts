import express, { Request, Response } from "express";
// import { orderRide } from '../controller/orderController';
import {
  UpdateUserProfile,
  Login,
  VerifyUser,
  ResendOTP,
  forgotPassword,
  resetPasswordGet,
  updatePaymentMethod,
  resetPasswordPost,
  getMyCompletedOrders,
  orderRide,
  Signup,
  getMyOrders,
  getOrder,
  deleteOrder,
  myNotification,
  updateNotification,
  getUserProfile
} from "../controller/userController";
import { auth } from "../middleware/authorization";
import { upload } from "../utils/multer";

const router = express.Router();

router.post("/signup", Signup);
router.patch("/updateUserProfile",upload.single('passport'), auth, UpdateUserProfile);
router.post("/login", Login);
router.post("/verify/:signature", VerifyUser);
router.get("/resend-otp/:signature", ResendOTP);

//routes for reset user password
router.post("/forgotpasswordd", forgotPassword);
router.get("/resetpasswordd/:token", resetPasswordGet);
router.post("/resetpasswordd/:token", resetPasswordPost);

//
router.post("/order-ride/", auth, orderRide);
router.get("/completed-orders", auth, getMyCompletedOrders);
router.get("/my-orders", auth, getMyOrders);
router.patch("/updatePaymentMethod/:id", auth, updatePaymentMethod);
router.get("/my-order/:ids", getOrder);
router.get("/get-user-profile", auth, getUserProfile);
router.delete("delete-order/:id", auth, deleteOrder);

// notification
router.get("/my-notification", auth, myNotification);
router.patch("/update-notification/:notifyId", auth, updateNotification);

export default router;
