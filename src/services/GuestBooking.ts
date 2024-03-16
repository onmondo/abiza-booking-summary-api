import { TGuestBooking, TUpdateGuestBooking } from "../types/BookingTypes";

export default class GuestBooking {
    private guestBooking: TGuestBooking  | TUpdateGuestBooking<object>;

    protected constructor(guestBooking: TGuestBooking | TUpdateGuestBooking<object>) {
        this.guestBooking = guestBooking;
    }

    public getGuestBooking(): TGuestBooking | TUpdateGuestBooking<object> {
        return this.guestBooking;
    }

    public static GuestBookingBuilder = class GuestBookingBuilder {
        private guestBooking: TGuestBooking;

        constructor() {
            this.guestBooking = {
                guestName: "",
                rooms: [],
                checkIn: new Date(),
                checkOut: new Date(),
                noOfPax: 0,
                noOfStay: 0,
                nightlyPrice: 0,
                from: "",
                modeOfPayment: ""
            };
        }

        public setGuestName(guestName: string): GuestBookingBuilder {
            this.guestBooking.guestName = guestName;
            return this;
        }

        public setRooms(rooms: string[]): GuestBookingBuilder {
            this.guestBooking.rooms = rooms;
            return this;
        }

        public setCheckIn(checkIn: Date): GuestBookingBuilder {
            this.guestBooking.checkIn = checkIn;
            return this;
        }

        public setCheckOut(checkOut: Date): GuestBookingBuilder {
            this.guestBooking.checkOut = checkOut;
            return this;
        }

        public setNoOfPax(noOfPax: number): GuestBookingBuilder {
            this.guestBooking.noOfPax = noOfPax;
            return this;
        }

        public setNoOfStay(noOfStay: number): GuestBookingBuilder {
            this.guestBooking.noOfStay = noOfStay;
            return this;
        }

        public setNightlyPrice(nightlyPrice: number): GuestBookingBuilder {
            this.guestBooking.nightlyPrice = nightlyPrice;
            return this;
        }

        public setFrom(from: string): GuestBookingBuilder {
            this.guestBooking.from = from;
            return this;
        }

        public setModeOfPayment(modeOfPayment: string): GuestBookingBuilder {
            this.guestBooking.modeOfPayment = modeOfPayment;
            return this;
        }

        public setTotalPayout(totalPayout: number): GuestBookingBuilder {
            this.guestBooking.totalPayout = totalPayout;
            return this;
        }

        public setDatePaid(datePaid: Date): GuestBookingBuilder {
            this.guestBooking.datePaid = datePaid;
            return this;
        }

        public setRemarks(remarks: string): GuestBookingBuilder {
            this.guestBooking.remarks = remarks;
            return this;
        }

        public setCreatedAt(createdAt: Date): GuestBookingBuilder {
            this.guestBooking.createdAt = createdAt;
            return this;
        }

        public setUpdatedAt(updatedAt: Date): GuestBookingBuilder {
            this.guestBooking.updatedAt = updatedAt;
            return this;
        }

        public setDeletedAt(deletedAt: Date): GuestBookingBuilder {
            this.guestBooking.deletedAt = deletedAt;
            return this;
        }

        public build(): GuestBooking {
            return new GuestBooking(this.guestBooking);
        }

        public static GuestBookingDirector = class GuestBookingDirector {
            public buildNewGuestBooking(builder: GuestBookingBuilder): void {
                builder.setCreatedAt(new Date()).setUpdatedAt(new Date()).setRemarks("Pending");
            }

            public buildUpdateGuestBooking(builder: GuestBookingBuilder): void {
                builder.setUpdatedAt(new Date());
            }
        }
    }
    public static SoftGuestBookingBuilder = class SoftGuestBookingBuilder {
        private guestBooking: TUpdateGuestBooking<object>;

        constructor(bookingId: string) {
            this.guestBooking = { bookingId: bookingId, details: {} };
        }

        public setGuestName(guestName: string): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, guestName };
            return this;
        }

        public setRooms(rooms: string[]): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, rooms };
            return this;
        }

        public setCheckIn(checkIn: Date): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, checkIn };
            return this;
        }

        public setCheckOut(checkOut: Date): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, checkOut };
            return this;
        }

        public setNoOfPax(noOfPax: number): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, noOfPax };
            return this;
        }

        public setNoOfStay(noOfStay: number): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, noOfStay };
            return this;
        }

        public setNightlyPrice(nightlyPrice: number): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, nightlyPrice };
            return this;
        }

        public setFrom(from: string): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, from };
            return this;
        }

        public setModeOfPayment(modeOfPayment: string): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, modeOfPayment };
            return this;
        }

        public setTotalPayout(totalPayout: number): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, totalPayout };
            return this;
        }

        public setDatePaid(datePaid: Date): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, datePaid };
            return this;
        }

        public setRemarks(remarks: string): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, remarks };
            return this;
        }

        public setCreatedAt(createdAt: Date): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, createdAt };
            return this;
        }

        public setUpdatedAt(updatedAt: Date): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, updatedAt };
            return this;
        }

        public setDeletedAt(deletedAt: Date): SoftGuestBookingBuilder {
            this.guestBooking.details = { ...this.guestBooking.details, deletedAt };
            return this;
        }

        public build(): GuestBooking {

            return new GuestBooking(this.guestBooking);
        }

        public static GuestBookingDirector = class GuestBookingDirector {
            public buildNewGuestBooking(builder: SoftGuestBookingBuilder): void {
                builder.setCreatedAt(new Date()).setUpdatedAt(new Date()).setRemarks("Pending");
            }

            public buildUpdateGuestBooking(builder: SoftGuestBookingBuilder): void {
                builder.setUpdatedAt(new Date());
            }
        }
    }    
}