require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
// import { createExpressMiddleware } from '@trpc/server/adapters/express';
// import { appRouter } from './routers';
// import { createContext } from './util/createContext';
import guestBookings from '../routers/GuestBookings';
// import orders from './routers/Orders';
// import { AppDataSource } from './util/database/dataSource';
import cors from 'cors';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import { envKeys } from '../util/config';
// import Consumer from '../mq/DirectMessage/Consumer';

// database connection to mongodb thru mongoose
const {
    MONGO_DB_URL, 
    MONGO_DB_PWD, 
    RATE_LIMIT_WINDOW, 
    REQUEST_LIMIT 
} = envKeys();
const connectionBaseUrl: string = MONGO_DB_URL
const connectionPassword: string = MONGO_DB_PWD
const connectionUrl = connectionBaseUrl.replace("<password>", connectionPassword)
mongoose.connect(connectionUrl);

export const app = express()
app.use(express.json());

app.use(cors());

const limiter = rateLimit({
	windowMs: RATE_LIMIT_WINDOW, 
	limit: REQUEST_LIMIT, 
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: {
        message: 'Request has been stop.'
    }
})

app.use(limiter);
// app.use('/trpc', createExpressMiddleware({ 
//     router: appRouter, 
//     createContext
// }));

app.get('/', (req: Request, res: Response) => {
    return res.json({
        message: 'Up and running...'
    })
});

// app.use('/api/v1/bookings', guestBookings);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
    next(err);
    res.sendStatus(404)
    res.render('error', { error: err })
});

// Consumer.consumeMessage();

const port = 3001;
app.listen(port, () => console.log(`listening on port ${port}`))
