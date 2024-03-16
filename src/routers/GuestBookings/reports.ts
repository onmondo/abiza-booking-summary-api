import { Request, Response, NextFunction, RequestHandler } from "express";
import Reports, { ReportQuery } from "../../services/Reports";
import { isEmpty } from "lodash";
import { TGuestBooking, TYearlyBooking } from "../../types/BookingTypes";

export default class ReportEndpoints {
    static v1 = class v1 {
        static getYearlyBookings: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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
        
        static getBookingsByYear: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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
        
        static getBookingsByMonth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const year: string = req.params.year
                const month: string = req.params.month
                const sort: string | unknown = req.query?.sort;
                const page: string | unknown = req.query?.page;
                const limit: string | unknown = req.query?.limit;
        
                const reportQuery: ReportQuery = {
                    year,
                    month,
                    sort: sort as string,
                    page: page as string,
                    limit: limit as string,
                }
                // const sortMethod = sort as string;
                const reports = new Reports();
                const monthlyBookings: TGuestBooking[] = await reports.fetchBookingsByMonth(reportQuery);
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
    }
    static v2 = class v2 extends ReportEndpoints.v1 {
        static getYearlyBookings: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const guestName = req.query?.guest;
                console.log("guestName", guestName);
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
    }
}
