import Pusher from "pusher";
import {Request, Response} from 'express'

export const Chat = async(req:Request,res:Response) => {
    const pusher = new Pusher({
        appId: "1543383",
        key: "e6e0a271cc1dd441c02a",
        secret: "c6c90363834102801836",
        cluster: "sa1",
        useTLS: true
      });
      
    await pusher.trigger("swiftRider", "message", {
        username: req.body.username,
        message: req.body.message,
        time: req.body.time
      });
      res.status(201).json([]);
}