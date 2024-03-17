import { head, isEmpty } from "lodash";
import YearlyBooking from "../models/YearlyBooking";
import { TGuestBooking, TYearlyBooking } from "../types/BookingTypes";
import GuestBooking from "../models/GuestBooking";
import { SortOrder } from "mongoose";
import moment from "moment";

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
    async fetchAllYearlyBookings() {
        try {
            const yearlyBookings: TYearlyBooking[] = await YearlyBooking.find();
            return yearlyBookings;
        } catch (error: any) {
            throw new Error('Error in retrieving yearly bookings');
        }
    }
    async fetchBookingsByYear(year: string): Promise<TYearlyBooking> {
        try {
            const yearlyBooking: TYearlyBooking | unknown = await YearlyBooking
                .findOne({ year })
                .populate("monthlyBookings.details.guestBookings")
            const projectedYearlyBooking  = yearlyBooking as TYearlyBooking;
            return projectedYearlyBooking;
        } catch (error: any) {
            throw new Error('Error in retrieving a yearly booking');
        }
    }
    async fetchBookingsByMonth(reportQuery: ReportQuery): Promise<TGuestBooking[]> {
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
    async fetchBookingsById(reportQuery: ReportQueryById): Promise<TGuestBooking> {
        try {
            const guestBooking: TGuestBooking | null = await GuestBooking.findById(reportQuery.id)
            const projectedGuestBooking  = guestBooking as TGuestBooking;
            return projectedGuestBooking;
        } catch (error: any) {
            throw new Error('Error in retrieving a guest booking');
        }
    }
}