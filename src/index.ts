require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
// import { createExpressMiddleware } from '@trpc/server/adapters/express';
// import { appRouter } from './routers';
// import { createContext } from './util/createContext';
import guestBookings from './routers/GuestBookings';
// import orders from './routers/Orders';
// import { AppDataSource } from './util/database/dataSource';
import cors from 'cors';
import mongoose from 'mongoose';

// database connection to mongodb thru mongoose
mongoose.connect('mongodb://localhost/abiza-mongodb');

export const app = express()
app.use(express.json());

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(cors());

// app.use('/trpc', createExpressMiddleware({ 
//     router: appRouter, 
//     createContext
// }));

app.get('/', (req: Request, res: Response) => {
    return res.json({
        message: 'Up and running...'
    })
});

app.use('/api/v1/bookings', guestBookings);
// app.use('/api/v1/orders', orders);

// app.use('/txn', transaction);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
    next(err);
    res.sendStatus(404)
    res.render('error', { error: err })
});

const port = 3000;
app.listen(port, () => console.log(`listening on port ${port}`))
