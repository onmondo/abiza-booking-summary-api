import { head, isEmpty } from "lodash";
import Guest from "./Guest";
import { Visitor } from "../interface/Visitor";
import YearlyBooking from "../models/YearlyBooking";
import { TYearlyBooking } from "../types/BookingTypes";

export default class DeleteBookingVisitor implements Visitor {
    async visitGuest(guest: Guest): Promise<void> {
        const bookingDetails = guest.getBookingDetails();
        const { year, month, bookingId } = bookingDetails;

        const filter = { year, monthlyBookings: { $elemMatch: { month } } };
        await YearlyBooking.findOneAndUpdate(
            filter, 
            // { $pull: { 'monthlyBookings.$[first].details.guestBookings': bookingId } },
            // { arrayFilters: [ { 'first.month': month } ], new: true }
            { $pull: { 'monthlyBookings.$.details.guestBookings': bookingId } },
        );
        
        const currentYearlyBooking: TYearlyBooking | unknown = await YearlyBooking.findOne(filter);

        if (!isEmpty(currentYearlyBooking)) {
            // check if monthlyBookings are empty
            const existingYearlyBooking = currentYearlyBooking as TYearlyBooking;
            
            if (isEmpty(head(existingYearlyBooking.monthlyBookings)?.details?.guestBookings)) {
                await YearlyBooking.deleteOne({ year })
            }
        }
    }
}