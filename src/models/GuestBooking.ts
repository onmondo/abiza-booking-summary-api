import mongoose from "mongoose";

export const guestBookingSchema = new mongoose.Schema({
    guestName: {
        type: String,
        required: true,
    },
    from: String,
    rooms: [String],
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    noOfPax: {
        type: Number,
        required: true,
    },
    noOfStay: {
        type: Number,
        required: true,
    },
    nightlyPrice: {
        type: Number,
        required: true,
    },
    totalPayout: {
        type: Number,
        required: true,
    },
    modeOfPayment: String,
    datePaid: Date,
    remarks: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: Date,
});

export default mongoose.model("GuestBooking", guestBookingSchema);

