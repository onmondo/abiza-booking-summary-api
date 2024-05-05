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
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { envKeys } from './util/config';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createContext } from './util/createContext';
import { trpcRouter } from './routers/Users';
import { WebSocketServer } from 'ws';
import compression from 'compression';

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
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'Booking-Status-Endpoint', 'Booking-Details-Endpoint'],
        },
    })
);

app.use(cors());
app.use(compression());

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

app.set('view engine', 'pug')
app.set("views", `src/views`)


app.use('/trpc', createExpressMiddleware({ 
    router: trpcRouter, 
    createContext
}));

app.get('/', (req: Request, res: Response) => {
    return res.json({
        message: 'Up and running...'
    })
});

app.use('/api/v1/bookings', guestBookings);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
    next(err);
    res.status(404).render('notfound', { title: '404 not found', message: 'The resource is not available.' })
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`listening on port ${port}`))

const wss = new WebSocketServer({ server })
wss.on("connection", (server, socket) => {
    console.log("connected");

})
// wss.on("upgrade", (req, socket, head) => {
//     socket.on("error", (err: Error) => {
//         console.log(err)
//     })

//     // perform auth
//     if (!!req.headers['BadAuth']) {
//         socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n")
//         socket.destroy()
//         return
//     }

//     wss.handleUpgrade(req, socket, head, (ws) => {
//         socket.removeListener("error", (err: Error) => {
//             console.log(err)
//         })

//         wss.emit("connection", ws, req)
//     })
// })

// wss.on("connection", (ws, req) => {
//     ws.on("error", (err) => {
//         console.log(err)
//     })

//     ws.on("message", (msg, isBinary) => {
//         wss.clients.forEach((client) => {
//             if(client.readyState === WebSocket.OPEN) {
//                 client.send(msg, { binary: isBinary })
//             }
//         })
//     })
// })
