import YearlyBooking from "../models/YearlyBooking";
import { TYearlyBooking } from "../types/BookingTypes";

export default class Reports {
    async fetchAllYearlyBookings() {
        try {
            const yearlyBookings: TYearlyBooking[] = await YearlyBooking.find();
            return yearlyBookings;
        } catch (error: any) {
            throw new Error('Error in retrieving yearly bookings');
        }
    }
    async fetchBookingsByYear(year: string) {
        try {
            const yearlyBooking = await YearlyBooking.find({ year });
            return yearlyBooking;
        } catch (error: any) {
            throw new Error('Error in retrieving a yearly booking');
        }
    }
    async fetchBookingsByMonth(year: string, month: string) {
        try {
            const monthlyBookings = await YearlyBooking.find({ year, monthlyBookings: { $elemMatch: { month } } });
            return monthlyBookings;
        } catch (error: any) {
            throw new Error('Error in retrieving a yearly booking');
        }
    }
}