import { isEmpty } from "lodash";
import GuestBooking from "../models/GuestBooking";
import YearlyBooking from "../models/YearlyBooking";
import { TGuestBooking, TYearlyBooking } from "../types/BookingTypes";
import moment from "moment";
import Big from "big.js";
import Client from "./Client";
import { Visitor } from "../interface/Visitor";

type BookingDetails = {
    year: string,
    month: string,
    bookingId: string,
}

export default class Guest extends Client {
    private bookingDetails: BookingDetails

    constructor() {
        super();
        this.bookingDetails = {
            year: "",
            month: "",
            bookingId: "",
        }
    }

    public accept(visitor: Visitor): void {
        visitor.visitGuest(this);
    }

    public getBookingDetails(): BookingDetails {
        return this.bookingDetails;
    }

    async book(booking: TGuestBooking) {
        // compute total payout - can be extracted to seperate class
        const bTotalPayout = Big(booking.noOfPax).times(Big(booking.noOfStay)).times(Big(booking.nightlyPrice))
        const totalPayout = bTotalPayout.toNumber();

        // new record for GuestBooking
        const guestBooking = await GuestBooking.create({
            guestName: booking.guestName,
            from: booking.from,
            rooms: booking.rooms,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            noOfPax: booking.noOfPax,
            noOfStay: booking.noOfStay,
            nightlyPrice: booking.nightlyPrice,
            totalPayout: (totalPayout > (booking?.totalPayout || 0)) ? booking.totalPayout : totalPayout,
            modeOfPayment: booking.modeOfPayment,
            datePaid: booking.datePaid,
            remarks: booking.remarks,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await guestBooking.save();

        const year = moment(booking.checkIn).format("YYYY")
        const month = moment(booking.checkIn).format("MMMM")

        this.bookingDetails.month = month;
        this.bookingDetails.year = year;
        this.bookingDetails.bookingId = guestBooking._id.toString();
    }

    async cancelBooking(year: string, month: string, bookingId: string) {
        await GuestBooking.deleteOne({ _id: bookingId });

        this.bookingDetails.bookingId = bookingId;
        this.bookingDetails.month = month;
        this.bookingDetails.year = year;
    }

    
}
