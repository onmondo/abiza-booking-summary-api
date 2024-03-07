import { isEmpty } from "lodash";
import GuestBooking from "../models/GuestBooking";
import YearlyBooking from "../models/YearlyBooking";
import { TGuestBooking, TYearlyBooking } from "../types/BookingTypes";
import moment from "moment";
import Big from "big.js";

export default class Guest {
    async book(booking: TGuestBooking) {
        // compute total payout - can be extracted to seperate class
        const bTotalPayout = Big(booking.noOfPax).times(Big(booking.noOfStay)).times(Big(booking.nightlyPrice))
        const totalPayout = bTotalPayout.toNumber();

        // new record for GuestBooking
        const guestBooking = await GuestBooking.create({
            guestName: booking.guestName,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            noOfPax: booking.noOfPax,
            noOfStay: booking.noOfStay,
            nightlyPrice: booking.nightlyPrice,
            totalPayout: (totalPayout > (booking?.totalPayout || 0)) ? booking.totalPayout : totalPayout,
            datePaid: booking.datePaid,
            remarks: booking.remarks,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await guestBooking.save();

        const year = moment(booking.checkIn).format("YYYY")
        const month = moment(booking.checkIn).format("MMMM")

        const yearlyBooking: TYearlyBooking | unknown = await YearlyBooking.findOneAndUpdate(
            { year, monthlyBookings: { $elemMatch: { month } } }, 
            { $push: { 'monthlyBookings.$[first].details.guestBookings': guestBooking._id } },
            { arrayFilters: [ { 'first.month': month } ] }   
        );
        
        if (isEmpty(yearlyBooking)) {
            
            const newYearlyBooking = await YearlyBooking.create({
                year,
                monthlyBookings: [
                    {
                        month,
                        details: {
                            guestBookings: [guestBooking._id],             
                        },
                        createdAt: new Date(),
                        updatedAt: new Date(),          
                    }
                ]
            });
            await newYearlyBooking.save();
        }
    }
}
