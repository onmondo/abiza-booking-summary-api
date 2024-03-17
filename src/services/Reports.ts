import { head, isEmpty } from "lodash";
import YearlyBooking from "../models/YearlyBooking";
import { TGuestBooking, TYearlyBooking } from "../types/BookingTypes";
import GuestBooking from "../models/GuestBooking";

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
            const { year, month, sort } = reportQuery;
            let yearlyBooking: TYearlyBooking | unknown = await YearlyBooking
                .findOne({ year, monthlyBookings: { $elemMatch: { month } } })
                // .findOneAndUpdate(filter, update, options)
                // .populate("monthlyBookings.details.guestBookings")
                // .exec();
            
            if (isEmpty(yearlyBooking)) {
                return [];
            }

            yearlyBooking = await YearlyBooking
                .findOne({ year, monthlyBookings: { $elemMatch: { month } } })
                .populate("monthlyBookings.details.guestBookings")
                .exec();

            const projectedYearlyBooking = yearlyBooking as TYearlyBooking;
            const monthlyBookings: TGuestBooking[] | unknown = head(projectedYearlyBooking.monthlyBookings)?.details?.guestBookings;

            let projectedMonthlyBookings = monthlyBookings as TGuestBooking[];
            if (sort === "desc") {
                projectedMonthlyBookings = projectedMonthlyBookings.sort((a: any, b: any) => b.checkIn - a.checkIn);
            } else {
                projectedMonthlyBookings = projectedMonthlyBookings.sort((a: any, b: any) => a.checkIn - b.checkIn);
            }
            
            return projectedMonthlyBookings;
        } catch (error: any) {
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