import { Request, Response, NextFunction, RequestHandler } from "express";
import Reports from "../../services/Reports";
import { isEmpty } from "lodash";

export const getYearlyBookings: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reports = new Reports();
        const yearlyBookings = await reports.fetchAllYearlyBookings();
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
        const monthlyBookings = await reports.fetchBookingsByYear(year);
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

export const getBookingsByMonth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.params)
        const year: string = req.params.year
        const month: string = req.params.month
        const reports = new Reports();
        const monthlyBookings = await reports.fetchBookingsByMonth(year, month);
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