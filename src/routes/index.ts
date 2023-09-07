import express, {Request, Response} from 'express';
import { UserInstance } from '../models/userModel';
import { OrderInstance } from '../models/orderModel';

const router = express.Router();

router.get('/', async (req:Request, res:Response) => {
    const allUsers = await UserInstance.findAll({})
    const allOrders = await OrderInstance.findAll({})
    return res.status(200).json({
        message: `All Orders Fetched`,
         Orders: allOrders,
         Users: allUsers,
    })
})

// res.status(200).send(`WELCOME TO SWIFT RIDER, CLICK TO VIEW DOCUMENTATION`)

export default router;