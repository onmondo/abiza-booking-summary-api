import { Request, Response, NextFunction, RequestHandler } from "express";
import Guest from "../../services/Guest";
import { TGuestBooking } from "../../types/BookingTypes";
import PersistBookingVisitor from "../../services/PersistBookingVisitor";
import DeleteBookingVisitor from "../../services/DeleteBookingVisitor";

export const newBooking: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const guest = new Guest();
        const bookingRequest: TGuestBooking = req.body
        await guest.book(bookingRequest);
        const persistBookingVisitor = new PersistBookingVisitor();
        await guest.accept(persistBookingVisitor);
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

export const deleteBookingById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const guest = new Guest();
        const year: string = req.params.year;
        const month: string = req.params.month;
        const bookingId: string = req.params.id;
        await guest.cancelBooking(year, month, bookingId);
        const deleteBookingVisitor = new DeleteBookingVisitor();
        await guest.accept(deleteBookingVisitor);
        res.status(200)
            .json({
                message: 'Booking deleted',
            });
    } catch(error: any) {
        const errorDetails = error as Error;
        res.status(500).json({
            message: 'Internal Server Error',
            error: errorDetails.message
        });
    }
}

export const updateBooking: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const guest = new Guest();
        const bookingRequest: TGuestBooking = req.body
        await guest.book(bookingRequest);
        const persistBookingVisitor = new PersistBookingVisitor();
        await guest.accept(persistBookingVisitor);
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