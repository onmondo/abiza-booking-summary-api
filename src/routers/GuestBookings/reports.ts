import { Request, Response, NextFunction, RequestHandler } from "express";
import Reports from "../../services/Reports";
import { isEmpty } from "lodash";
import { TGuestBooking, TYearlyBooking } from "../../types/BookingTypes";

export const getYearlyBookings: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reports = new Reports();
        const yearlyBookings: TYearlyBooking[] = await reports.fetchAllYearlyBookings();
        if (isEmpty(yearlyBookings)) {
            res.json({
                message: "No yearly bookings",
                yearlyBookings
            });
        } else {
            res.json({
                message: "Bookings",
                yearlyBookings
            });
        }
    } catch(error: any) {
        console.log(error);
    }
}

export const getBookingsByYear: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const year: string = req.params.year
        const reports = new Reports();
        const yearlyBooking: TYearlyBooking = await reports.fetchBookingsByYear(year);
        if (isEmpty(yearlyBooking)) {
            res.json({
                message: "No yearly bookings",
                yearlyBooking
            });
        } else {
            res.json({
                message: "Bookings",
                yearlyBooking
            });
        }
    } catch(error: any) {
        console.log(error);
    }
}

export const getBookingsByMonth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const year: string = req.params.year
        const month: string = req.params.month
        const sort: string | unknown = req.query?.sort;
        const page: string | unknown = req.query?.page;
        const limit: string | unknown = req.query?.limit;
        
        const sortMethod = sort as string;
        const reports = new Reports();
        const monthlyBookings: TGuestBooking[] = await reports.fetchBookingsByMonth(year, month, sortMethod);
        if (isEmpty(monthlyBookings)) {
            res.json({
                message: "No monthly bookings",
                monthlyBookings
            });
        } else {
            res.json({
                message: "Bookings",
                monthlyBookings
            });
        }
    } catch(error: any) {
        console.log(error);
    }
}