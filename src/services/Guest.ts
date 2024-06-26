import moment from "moment";
import Big from "big.js";
import { Transform } from "stream";
import { v4 } from "uuid";
import Client from "./Client";
import GuestBooking from "../models/GuestBooking";
import { TDeleteBooking, TGuestBooking, TUpdateGuestBooking, TYearlyBooking } from "../types/BookingTypes";
import { Visitor } from "../interface/Visitor";
import GuestBookingDetail from "./GuestBooking";
import MQClient from "../mq/RequestResponse/Client";

type BookingDetails = {
    year: string,
    month: string,
    bookingId: string,
}

export default class Guest extends Client {
    private bookingDetails: BookingDetails

    private uploadedBookings: Object[]

    constructor() {
        super();
        this.bookingDetails = {
            year: "",
            month: "",
            bookingId: "",
        }
        this.uploadedBookings = []
    }

    private computeTotalPayout(noOfPax: number, noOfStay: number, nightlyPrice: number): number {
        // compute total payout - can be extracted to seperate class
        const bTotalPayout = Big(noOfPax).times(Big(noOfStay)).times(Big(nightlyPrice))
        return bTotalPayout.toNumber();
    }

    public accept(visitor: Visitor): void {
        visitor.visitGuest(this);
    }

    public getBookingDetails(): BookingDetails {
        return this.bookingDetails;
    }

    public getUploadedBookings(): Object[] {
        return this.uploadedBookings
    }

    async book(booking: TGuestBooking): Promise<void> {
        const totalPayout = this.computeTotalPayout(booking.noOfPax, booking.noOfStay, booking.nightlyPrice);

        // build new guest booking
        const guestBookingDirector = new GuestBookingDetail.GuestBookingBuilder.GuestBookingDirector();
        const guestBookingBuilder = new GuestBookingDetail.GuestBookingBuilder()
        guestBookingDirector.buildNewGuestBooking(guestBookingBuilder);
        guestBookingBuilder
            .setReferenceId(booking.referenceId)
            .setGuestName(booking.guestName)
            .setFrom(booking.from)
            .setRooms(booking.rooms)
            .setCheckIn(booking.checkIn)
            .setCheckOut(booking.checkOut)
            .setNoOfPax(booking.noOfPax)
            .setNoOfStay(booking.noOfStay)
            .setNightlyPrice(booking.nightlyPrice)
            .setTotalPayout((totalPayout > (booking?.totalPayout || 0)) ? booking.totalPayout || 0 : totalPayout)
            .setModeOfPayment(booking.modeOfPayment)
            .setDatePaid(booking.datePaid || new Date())
            
        const newGuestBooking = guestBookingBuilder.build();
        // new record for GuestBooking
        const guestBooking = await GuestBooking.create(newGuestBooking.getGuestBooking());
        await guestBooking.save();

        const year = moment(booking.checkIn).format("YYYY")
        const month = moment(booking.checkIn).format("MMMM")

        this.bookingDetails.month = month;
        this.bookingDetails.year = year;
        this.bookingDetails.bookingId = guestBooking._id.toString();

        // send message to message broker to complete booking
        MQClient.produceMessage("rpc_queue", this.bookingDetails);
    }

    async cancelBooking(deleteBooking: TDeleteBooking) {
        await GuestBooking.deleteOne({ _id: deleteBooking.bookingId });

        this.bookingDetails.bookingId = deleteBooking.bookingId;
        this.bookingDetails.month = deleteBooking.month;
        this.bookingDetails.year = deleteBooking.year;
    }

    async fullUpdateBooking(bookingId: string, booking: TGuestBooking) {
        const totalPayout = this.computeTotalPayout(booking.noOfPax, booking.noOfStay, booking.nightlyPrice);

        const guestBookingDirector = new GuestBookingDetail.GuestBookingBuilder.GuestBookingDirector();
        const guestBookingBuilder = new GuestBookingDetail.GuestBookingBuilder()
        guestBookingDirector.buildUpdateGuestBooking(guestBookingBuilder);
        guestBookingBuilder.setFrom(booking.from)
            .setGuestName(booking.guestName)
            .setRooms(booking.rooms)
            .setCheckIn(booking.checkIn)
            .setCheckOut(booking.checkOut)
            .setNoOfPax(booking.noOfPax)
            .setNoOfStay(booking.noOfStay)
            .setNightlyPrice(booking.nightlyPrice)
            .setTotalPayout((totalPayout > (booking?.totalPayout || 0)) ? booking.totalPayout || 0 : totalPayout)
            .setModeOfPayment(booking.modeOfPayment)
            .setDatePaid(booking.datePaid || new Date())
            .setRemarks(booking.remarks || "")

        const guestBookingUpdate = guestBookingBuilder.build();
        await GuestBooking.findByIdAndUpdate({ _id: bookingId }, guestBookingUpdate.getGuestBooking())
    }
    
    async softUpdateBooking(bookingId: string, booking: TGuestBooking) {
        let totalPayout = 0;
        if (booking?.totalPayout) {
            totalPayout = this.computeTotalPayout(booking.noOfPax, booking.noOfStay, booking.nightlyPrice);
        }
        
        const guestBookingDirector = new GuestBookingDetail.SoftGuestBookingBuilder.GuestBookingDirector();
        const guestBookingBuilder = new GuestBookingDetail.SoftGuestBookingBuilder(bookingId)
        guestBookingDirector.buildUpdateGuestBooking(guestBookingBuilder);
        if (booking.from) guestBookingBuilder.setFrom(booking.from);
        if (booking.rooms) guestBookingBuilder.setRooms(booking.rooms);
        if (booking.checkIn) guestBookingBuilder.setCheckIn(booking.checkIn);
        if (booking.checkOut) guestBookingBuilder.setCheckOut(booking.checkOut);
        if (booking.noOfPax) guestBookingBuilder.setNoOfPax(booking.noOfPax);
        if (booking.noOfStay) guestBookingBuilder.setNoOfStay(booking.noOfStay);
        if (booking.nightlyPrice) guestBookingBuilder.setNightlyPrice(booking.nightlyPrice);
        if (booking?.totalPayout) guestBookingBuilder.setTotalPayout((totalPayout > (booking?.totalPayout || 0)) ? booking.totalPayout || 0 : totalPayout);
        if (booking.modeOfPayment) guestBookingBuilder.setModeOfPayment(booking.modeOfPayment);
        if (booking.datePaid) guestBookingBuilder.setDatePaid(booking.datePaid);
        if (booking.remarks) guestBookingBuilder.setRemarks(booking.remarks);

        const guestBookingUpdate = guestBookingBuilder.build();
        const guestBookingDetails = guestBookingUpdate.getGuestBooking();
        
        const guestBookingRequest = guestBookingDetails as TUpdateGuestBooking<object>;

        await GuestBooking.findByIdAndUpdate({ _id: bookingId }, guestBookingRequest.details)
    }

    public transformCsv() {
        const self = this
        return new Transform({
            objectMode: true,
            transform(chunk, encoding, callback) {
                // console.log(" >> Chunk: ", chunk)
                const nightlyPrice = parseFloat(chunk["Nightly Price"].replace(",", ""))
                const totalPayout = parseFloat(chunk["Total Payout"].replace(",", ""))
                const checkIn = chunk["Check-In"]
                const checkOut = chunk["Check-Out"]
                const datePaid = chunk["Date Paid"]
                
                const booking: TGuestBooking = {
                    referenceId: v4(),
                    rooms: chunk["Room Occupied"].split(","),
                    guestName: chunk["Guest Name"], 
                    checkIn: (!checkIn || checkIn === "") ? new Date() : new Date(checkIn),
                    checkOut: (!checkOut || checkOut === "") ? new Date() : new Date(checkOut),
                    noOfPax: parseInt(chunk["No of Pax"]),
                    noOfStay: parseInt(chunk["No of Stay"]),
                    nightlyPrice: (nightlyPrice) ? nightlyPrice : 0,
                    totalPayout: (totalPayout) ? totalPayout : 0,
                    from: chunk["From"],
                    modeOfPayment: chunk["Mode of Payment"],
                    datePaid: (!datePaid || datePaid === "") ? new Date() : new Date(datePaid),
                    remarks: chunk["Remarks"]
                }
                // send data to a collection or array
                self.uploadedBookings.push(booking);
                // don't send any data on to your callback if this is the last process
                // callback(null, booking) 
                callback(null, booking)
            },
            // flush or final here...
        })
    }

    public batchBook() {
        const self = this
        return new Transform({
            objectMode: true,
            async transform(booking, encoding, callback) {
                await self.book(booking); // persist booking
                callback(null, booking);// pass the booking as is
            }
        })
    }

    public convertToNdJson() {
        return new Transform({
            objectMode: true,
            transform(booking, encoding, callback) {
                // convert booking to json string before compression
                const ndjson = `${JSON.stringify(booking)} \n`
                callback(null, ndjson)
            }
        })
    }
}
