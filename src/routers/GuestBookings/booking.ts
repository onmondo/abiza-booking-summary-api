import { Request, Response, NextFunction, RequestHandler } from "express";
import Guest from "../../services/Guest";
import { TGuestBooking } from "../../types/BookingTypes";
import DeleteBookingVisitor from "../../services/DeleteBookingVisitor";
import { v4 } from "uuid";
import fs from "fs";
// import path from "path";
import csv from "csvtojson";
import  { Transform } from "stream";

export default class BookingEndpoints {
    static v1 = class v1 {
        static newBooking: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const referenceId = v4();
                const guest = new Guest();
                const bookingRequest: TGuestBooking = req.body
                guest.book({ ...bookingRequest, referenceId});
                
                res.status(202)
                    .header('Booking-Status-Endpoint', `http://${req.hostname}:${process.env.PORT}/api/v1/bookings/reference/${referenceId}`)
                    .json({
                        message: 'Booking created',
                    });
            } catch(error: any) {
                next(error)
            }
        }

        static newBookings: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
            try {
                // const csvPath = path.join(__dirname, `../../data/Guest_Room_Bookings_2024_January_CSV.csv`)
                const readStream = fs.createReadStream(`src/data/Guest_Room_Bookings_2024_January_CSV.csv`)
                const writeStream = fs.createWriteStream(`src/data/Export_Guest_Room_Bookings_2024_January_CSV.csv`)

                const transformCsv = new Transform({
                    objectMode: true,
                    transform(chunk, encoding, callback) {
                        // console.log(" >> Chunk: ", chunk)
                        const nightlyPrice = parseFloat(chunk["Nightly Price"].replace(",", ""));
                        const totalPayout = parseFloat(chunk["Total Payout"].replace(",", ""));

                        const booking = {
                            rooms: chunk["Room Occupied"].split(","),
                            guestName: chunk["Guest Name"],
                            checkIn: new Date(chunk["Check-In"]),
                            checkOut: new Date(chunk["Check-Out"]),
                            noOfPax: parseInt(chunk["No of Pax"]),
                            noOfStay: parseInt(chunk["No of Stay"]),
                            nightlyPrice: (nightlyPrice) ? nightlyPrice : 0,
                            totalPayout: (totalPayout) ? totalPayout : 0,
                            from: chunk["From"],
                            modeOfPayment: chunk["Mode of Payment"],
                            datePaid: new Date(chunk["Date Paid"].replace(",", "")),
                            remarks: chunk["Remarks"]
                        }
                        // don't send any data on to your callback if this is the last process
                        callback(null, booking) 
                    },
                    // flush or final here...
                })

                readStream
                    .pipe(
                        csv({
                            delimiter: ','
                        }, { objectMode: true })
                    )
                    .pipe(transformCsv)
                    .on("data", data  => {
                        console.log(" >>>> data: ")
                        console.log(data)
                    })
                    .on("error", error => {
                        console.error("Stream error")
                    })
                    .on("end", () => {
                        console.log("Stream ended")
                    })
                    res.status(202).end()
            } catch(error: any) {
                next(error)
            }
        }
        
        static deleteBookingById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
            try {
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
            } catch(error: any) {
                next(error)
            }
        }
        
        static updateBookingById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
            try {
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
            } catch(error: any) {
                next(error)
            }
        }
        
        static softUpdateBookingById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
            try {
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
            } catch(error: any) {
                next(error)
            }
        }
    }
}
