import express, {Request, Response} from 'express';
import {Chat} from '../controller/chatController'

const router = express.Router();

router.post('/messages', Chat)


export default router;