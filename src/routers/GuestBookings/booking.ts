import { Request, Response, NextFunction, RequestHandler } from "express";
import Guest from "../../services/Guest";
import { TGuestBooking } from "../../types/BookingTypes";
import DeleteBookingVisitor from "../../services/DeleteBookingVisitor";
import { v4 } from "uuid";

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
