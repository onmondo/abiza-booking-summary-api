import head from "lodash/head";
import { SortOrder } from "mongoose";
import moment from "moment";
import { TGuestBooking, TGuestBookingReport, TYearlyBooking } from "../types/BookingTypes";
import YearlyBooking from "../models/YearlyBooking";
import GuestBooking from "../models/GuestBooking";
import { daysInMonth, getMonth } from "../util/dates";

export type ReportQuery = {
    year: string,
    month: string, 
    sort?: string,
    page?: string,
    limit?: string
}

export type ReportQueryById = {
    id?: string;
    year?: string;
    month?: string;
}

export default class Reports {
    static v1 = class v1 {
        static async fetchAllYearlyBookings() {
            try {
                const yearlyBookings: TYearlyBooking[] = await YearlyBooking.find();
                return yearlyBookings;
            } catch (error: any) {
                throw new Error('Error in retrieving yearly bookings');
            }
        }
        static async fetchBookingsByYear(year: string): Promise<TYearlyBooking> {
            try {
                const yearlyBooking: TYearlyBooking | unknown = await YearlyBooking
                    .findOne({ year })
                    .populate("monthlyBookings.details.guestBookings")
                const projectedYearlyBooking  = yearlyBooking as TYearlyBooking;
                return projectedYearlyBooking;
            } catch (error: any) {
                console.log(error.message)
                throw new Error('Error in retrieving a yearly booking');
            }
        }
        static async fetchBookingsByMonth(reportQuery: ReportQuery): Promise<TGuestBooking[]> {
            try {
                const { year, month, sort, page, limit } = reportQuery;
    
                let skip: number = 0;
                let bookingsPerPage: number = 10;
                if (page && limit) {
                    bookingsPerPage = parseInt(limit)
                    skip = (parseInt(page) - 1) * bookingsPerPage
                }
    
                const daysInMonth = moment(`${year}-${month}`).daysInMonth();
                const monthlyBookings = await GuestBooking
                    .find({ 
                        checkIn: { 
                            $gte: moment(`${year}-${month}-1`).format("YYYY-MM-DD").toString(),
                            $lte: moment(`${year}-${month}-${daysInMonth}`).format("YYYY-MM-DD").toString()
                        } 
                    })
                    .skip(skip)
                    .limit(bookingsPerPage)
                    .sort({ checkIn: sort as SortOrder })
                    .exec();
    
                let projectedMonthlyBookings = monthlyBookings as TGuestBooking[];
                
                return projectedMonthlyBookings;
            } catch (error: any) {
                console.log(error.message)
                throw new Error('Error in retrieving a yearly booking');
            }
        }
        static async fetchBookingsById(reportQuery: ReportQueryById): Promise<TGuestBooking> {
            try {
                const guestBooking: TGuestBooking | null = await GuestBooking.findById(reportQuery.id)
                const projectedGuestBooking  = guestBooking as TGuestBooking;
                return projectedGuestBooking;
            } catch (error: any) {
                console.log(error.message)
                throw new Error('Error in retrieving a guest booking');
            }
        }
        static async fetchBookingByReferenceId(referenceId: string ): Promise<TGuestBooking> {
            try {
                const guestBooking: TGuestBooking | null = await GuestBooking.findOne({ referenceId: referenceId })
                const projectedGuestBooking  = guestBooking as TGuestBooking;
                return projectedGuestBooking;
            } catch (error: any) {
                console.log(error.message)
                throw new Error('Error in retrieving a guest booking');
            }
        }
    }
    static v2 = class v2 {
        static async fetchBookingsByMonth(reportQuery: ReportQuery): Promise<TGuestBookingReport> {
            try {
                const { year, month, sort, page, limit } = reportQuery;
    
                let skip: number = 0;
                let bookingsPerPage: number = 10;
                if (page && limit) {
                    bookingsPerPage = parseInt(limit)
                    skip = (parseInt(page) - 1) * bookingsPerPage
                }
    
                const days = daysInMonth(year, month);
                const convertedMonth = getMonth(year, month);
                const filter = {
                    checkIn: { 
                        $gte: new Date(`${year}-${convertedMonth}-01`), //.format("YYYY-MM-DD").toString(),
                        $lte: new Date(`${year}-${convertedMonth}-${days}`) //.format("YYYY-MM-DD").toString()
                    }                         
                }
                const sortOrder = (sort === "asc") ? 1 : -1
                
                const monthlyBookings: unknown = await GuestBooking.aggregate([
                    {
                        $match: filter,
                    },
                    {
                        $sort: { checkIn: sortOrder }
                    },
                    {
                        $facet: {
                            data: [
                                { $skip: skip },
                                { $limit: bookingsPerPage}
                            ],
                            totalCount: [
                                { $count: "total" }
                            ]
                        }
                    },
                    {
                        $project:{
                            data: 1,
                            totalCount: { $arrayElemAt: ["$totalCount.total", 0] }
                        }
                    }
                ])
                let projectedMonthlyBookings = head(monthlyBookings as TGuestBookingReport[]) as TGuestBookingReport;
                
                return projectedMonthlyBookings;
            } catch (error: any) {
                console.log(error.message)
                throw new Error('Error in retrieving a yearly booking');
            }
        }
        static fetchAllYearlyBookings() {
            try {
                const yearlyBookings = YearlyBooking.find().cursor();
                return yearlyBookings;
            } catch (error: any) {
                throw new Error('Error in retrieving yearly bookings');
            }
        }
        static fetchBookingsByYear(year: string) {
            try {
                const yearlyBooking = YearlyBooking
                    .findOne({ year })
                    .populate("monthlyBookings.details.guestBookings")
                    .cursor();
                return yearlyBooking;
            } catch (error: any) {
                console.log(error.message)
                throw new Error('Error in retrieving a yearly booking');
            }
        }
    }
}