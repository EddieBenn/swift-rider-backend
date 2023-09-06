import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser"
import userRouter from './routes/user';
import riderRouter from './routes/rider';
import indexRouter from './routes/index';
import adminRouter from './routes/admin';
import chatRouter from './routes/chat'
import {db} from './config'
import cors from "cors";
import {URL, port} from './config'
import dotenv from 'dotenv';
dotenv.config();



//Sequelize connection
db.sync().then(() => {
    console.log('DB connected successfully')
}).catch(err => {
 console.log(err)
})
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname')

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json({}));
app.use(logger('dev'));
app.use(cookieParser());
app.use(cors());


//Router middleware
app.use('/users', userRouter)
app.use('/', indexRouter)
app.use('/riders', riderRouter)
app.use('/admin', adminRouter)
app.use('/chat',  chatRouter)


app.listen(port, ()=>{
    console.log(`Server running on ${URL}:${port}`)
})

export default app;



