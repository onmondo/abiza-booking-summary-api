import { Request, Response, NextFunction, RequestHandler } from "express";
import Guest from "../../services/Guest";
import { TGuestBooking } from "../../types/BookingTypes";

export const newBooking: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const guest = new Guest();
        const bookingRequest: TGuestBooking = req.body
        await guest.book(bookingRequest);
        res.status(201)
            .json({
                message: 'Booking created',
            });
    } catch(error: any) {
        const errorDetails = error as Error;
        res.status(500).json({
            message: 'Internal Server Error',
            error: errorDetails.message
        });
    }
}