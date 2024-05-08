import { Request, Response, NextFunction, RequestHandler } from "express";
import { v4 } from "uuid";
import fs from "fs";
import zlib from "zlib";
import csv from "csvtojson";
import { pipeline } from "stream/promises";

import Guest from "../../services/Guest";
import { TGuestBooking } from "../../types/BookingTypes";
import DeleteBookingVisitor from "../../services/DeleteBookingVisitor";
import { catchAsync } from "../../util/catchAsync";

export default class BookingEndpoints {
    static v1 = class v1 {
        static newBooking: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            const referenceId = v4();
            const guest = new Guest();
            const bookingRequest: TGuestBooking = req.body
            guest.book({ ...bookingRequest, referenceId});
            
            res.status(202)
                .header('Booking-Status-Endpoint', `http://${req.hostname}:${process.env.PORT}/api/v1/bookings/reference/${referenceId}`)
                .json({
                    message: 'Booking created',
                });
        })

        static newBookings: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            const readStream = fs.createReadStream(`src/data/Guest_Room_Bookings_2024_January_CSV.csv`)

            const guest = new Guest();

            await pipeline(
                readStream,
                csv({ delimiter: ',' }, { objectMode: true }),
                guest.transformCsv(),
                guest.batchBook(),
                guest.convertToNdJson(),
                zlib.createGzip(), // compress file
                fs.createWriteStream(`src/data/Export_Guest_Room_Bookings_2024_January_CSV.ndjson.gz`)
            )
            res.status(202).json({
                bookings: guest.getUploadedBookings()
            }).end()
        })
        
        static deleteBookingById: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            const guest = new Guest();
            const year: string = req.params.year;
            const month: string = req.params.month;
            const bookingId: string = req.params.id;
            await guest.cancelBooking({ year, month, bookingId});
            const deleteBookingVisitor = new DeleteBookingVisitor();
            await guest.accept(deleteBookingVisitor);
            res.status(200)
                .json({
                    message: 'Booking deleted',
                });
        })
        
        static updateBookingById: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            const guest = new Guest();
            const bookingRequest: TGuestBooking = req.body
            const bookingId: string = req.params.id;
            await guest.fullUpdateBooking(bookingId, bookingRequest);
            // const persistBookingVisitor = new PersistBookingVisitor();
            // await guest.accept(persistBookingVisitor);
            res.status(201)
                .json({
                    message: 'Booking updated',
                });
        })
        
        static softUpdateBookingById: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            const guest = new Guest();
            const bookingRequest: TGuestBooking = req.body
            const bookingId: string = req.params.id;
            await guest.softUpdateBooking(bookingId, bookingRequest);
            // const persistBookingVisitor = new PersistBookingVisitor();
            // await guest.accept(persistBookingVisitor);
            res.status(201)
                .json({
                    message: 'Booking updated',
                });
        })
    }
}
