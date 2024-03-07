import mongoose from 'mongoose';
import { guestBookingSchema } from './GuestBooking';

const yearlyBookingSchema = new mongoose.Schema({
    year: String,
    monthlyBookings: [
        {
            month: {
                type: String,
                required: true
            },
            details: {
                guestBookings: {
                    type: [mongoose.Schema.Types.ObjectId],
                    ref: "GuestBooking",
                    require: false,
                },
                electricityBill: {
                    date: Date,
                    periodCovered: String,
                    totalBill: Number,
                    share: Number,
                },
                payables: [
                    {
                        date: Date,
                        particulars: String,
                        totalAmount: Number,
                        remarks: String,
                    }                    
                ],
                earning: {
                    bookings: Number,
                    expense: Number,
                    totalNet: Number,
                    shares: [
                        {
                            name: String,
                            rate: Number,
                            share: Number,
                        }
                    ]
                }                
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            },
            deletedAt: Date,            
        }
    ]
});

const YearlyBooking = mongoose.model('YearlyBooking', yearlyBookingSchema);
export default YearlyBooking;