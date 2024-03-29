import { Request, Response, NextFunction, RequestHandler } from "express";
import Reports, { ReportQuery, ReportQueryById } from "../../services/Reports";
import { isEmpty } from "lodash";
import { TGuestBooking, TGuestBookingReport, TYearlyBooking } from "../../types/BookingTypes";
import { Transform } from "stream";
// import Publisher from "../../mq/DirectMessage/Producer";

export default class ReportEndpoints {
    static v1 = class v1 {
        static getYearlyBookings: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const yearlyBookings: TYearlyBooking[] = await Reports.v1.fetchAllYearlyBookings();
                
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
                const yearlyBooking: TYearlyBooking = await Reports.v1.fetchBookingsByYear(year);
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
                const monthlyBookings: TGuestBooking[] = await Reports.v1.fetchBookingsByMonth(reportQuery);
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
                // const transformStream = new Transform({ objectMode: true })

                // transformStream._transform = function(chunk, encoding, callback) {
                //     callback(null, JSON.stringify(chunk))
                // }
                // const transformedBookings = Reports.v2.fetchAllYearlyBookings().pipe(transformStream)
                // transformedBookings.pipe(res)
                
                const yearlyBookings: TYearlyBooking[] = []
                const cursor = Reports.v2.fetchAllYearlyBookings()
                cursor.on("data", (chunk) => {
                    // process data here
                    yearlyBookings.push(chunk)
                });

                cursor.on("error", (err) => {
                    throw new Error(`Failed to fetch yearly bookings: ${err.message}`)
                });

                cursor.on("end", () => {
                    res.json({
                        message: "Bookings",
                        yearlyBookings
                    })
                })

            } catch(error: any) {
                console.log(error);
            }
        }

        static getBookingById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const year: string = req.params?.year
                const month: string = req.params?.month
                const bookingId: string = req.params?.id
        
                const reportQuery: ReportQueryById = {
                    id: bookingId,
                    year,
                    month,
                }
                // const sortMethod = sort as string;
                const guestBooking: TGuestBooking = await Reports.v1.fetchBookingsById(reportQuery);
                if (isEmpty(guestBooking)) {
                    res.json({
                        message: "No monthly bookings",
                        booking: guestBooking
                    });
                } else {
                    res.json({
                        message: "Bookings",
                        booking: guestBooking
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
                // temporary disable - MQ direct message
                // await Publisher.publishMesssage("Info", `Booking for the month of ${month}`)
                const monthlyBookings: TGuestBookingReport = await Reports.v2.fetchBookingsByMonth(reportQuery);
                if (isEmpty(monthlyBookings)) {
                    res.json({
                        message: "No monthly bookings",
                        monthlyBookings: { ...monthlyBookings }
                    });
                } else {
                    res.json({
                        message: "Bookings",
                        monthlyBookings: { ...monthlyBookings }
                    });
                }
            } catch(error: any) {
                console.log(error);
            }
        }

        static getBookingsByYear: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const year: string = req.params.year

                const transformStream = new Transform({ objectMode: true })

                transformStream._transform = function(chunk, encoding, callback) {
                    callback(null, JSON.stringify(chunk))
                }
                const transformedBookings = Reports.v2.fetchBookingsByYear(year).pipe(transformStream)
                transformedBookings.pipe(res)
            } catch(error: any) {
                console.log(error);
            }
        }
    }
}
