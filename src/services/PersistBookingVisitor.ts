import { isEmpty } from "lodash";
import Guest from "./Guest";
import { Visitor } from "../interface/Visitor";
import YearlyBooking from "../models/YearlyBooking";
import { TYearlyBooking } from "../types/BookingTypes";

export default class PersistBookingVisitor implements Visitor {
    async visitGuest(guest: Guest): Promise<void> {
        const bookingDetails = guest.getBookingDetails();
        const { year, month, bookingId } = bookingDetails;

        const monthlyBooking: TYearlyBooking | unknown = await YearlyBooking.findOneAndUpdate(
            { monthlyBookings: { $elemMatch: { month } } }, 
            { $push: { 'monthlyBookings.$[first].details.guestBookings': bookingId } },
            { arrayFilters: [ { 'first.month': month } ] }   
        );

        console.log("monthlyBooking", monthlyBooking)

        if (isEmpty(monthlyBooking)) {
            const yearlyBooking: TYearlyBooking | unknown = await YearlyBooking.findOneAndUpdate(
                { year }, 
                { 
                    $push: { 
                        monthlyBookings: {
                            month,
                            details: {
                                guestBookings: [bookingId],             
                            },
                            createdAt: new Date(),
                            updatedAt: new Date(),          
                        }
                    } 
                },
                { $push: { 'monthlyBookings.$[first].details.guestBookings': bookingId } },
            );

            console.log("yearlyBooking", yearlyBooking)

            if (isEmpty(yearlyBooking)) {
            
                const newYearlyBooking = await YearlyBooking.create({
                    year,
                    monthlyBookings: [
                        {
                            month,
                            details: {
                                guestBookings: [bookingId],             
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
}