require('dotenv').config();
import { faker } from "@faker-js/faker"
import GuestBookingBuilder from "../services/GuestBooking";
import mongoose from "mongoose";
import moment from "moment";
import GuestBooking from "../models/GuestBooking";
import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";
import { randomUUID } from "crypto";

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

function buildBooking(): GuestBookingBuilder {
    const ROOMS_AVAILABLE = 3
    const PAY_OPTIONS = 2
    const MAX_PAX = 4
    const MAX_STAY = 7
    const PRICE = 950
    const EXTRA = 500
    const room = getRandomInt(ROOMS_AVAILABLE);
    const pax = (getRandomInt(MAX_PAX) === 0) ? 1 : getRandomInt(MAX_PAX);
    const stay = (getRandomInt(MAX_STAY) === 0) ? 1 : getRandomInt(MAX_STAY);
    const paymentOptions = getRandomInt(PAY_OPTIONS)
    const totalPayout = (pax > 2) ? (PRICE * stay) + ((pax - 2) * EXTRA) : PRICE * stay
    const startdate = moment(faker.date.soon({ days: 10 })).toDate()
    const enddate = moment(startdate).add(1, "day").toDate()
    const guestBookingDirector = new GuestBookingBuilder.GuestBookingBuilder.GuestBookingDirector();
    const guestBookingBuilder = new GuestBookingBuilder.GuestBookingBuilder()
    guestBookingDirector.buildNewGuestBooking(guestBookingBuilder);
    guestBookingBuilder
        .setGuestName(faker.person.fullName())
        .setFrom(faker.company.name())
        .setRooms((room === 0) ? ["attic"] : [`room${room}`])
        .setCheckIn(startdate)
        .setCheckOut(enddate)
        .setNoOfPax(pax)
        .setNoOfStay(stay)
        .setNightlyPrice(PRICE)
        .setTotalPayout(totalPayout)
        .setModeOfPayment((paymentOptions === 0) ? "Cash" : "BPI")
        .setDatePaid(enddate)
        
    const newGuestBooking = guestBookingBuilder.build();
    return newGuestBooking;
}

async function setMessage(queueName: string, data: any): Promise<void> {
    const url = process.env.LOCAL_RABBIT_MQ_URL || "amqp://guest:password@localhost"
    const connection = await amqp.connect(url)
    const channel = await connection.createChannel();
    const queue = await channel.assertQueue("", { exclusive: true })
    const correlationId = randomUUID();
    console.log(`Sending new booking request: ${correlationId}`)
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
        replyTo: queue.queue,
        correlationId
    })
    channel.consume(queue.queue, (message: ConsumeMessage | null) => {
        if (message?.properties.correlationId === correlationId) {
            console.log("new booking acknowledge, thank you: ", message.content.toString())
            setTimeout(() => {
                connection.close();
            }, 500)
        }

    }, { noAck: true })
}

function createRandomBooking(): void {

    const url = process.env.MONGO_LOCAL || "mongodb://localhost:27017/abiza-mongodb";
    mongoose.set("strictQuery", false)
    mongoose.connect(url)
        .then(() => {
            console.log("Connected to DB")
        }) 
        .catch((err) =>{
            console.log("Failed DB connection", err)
        })

    const MAX_RECORDS = 10
    const guestBookings = []

    for(let index = 0; index < MAX_RECORDS; index++) {
        guestBookings.push(buildBooking().getGuestBooking());
    }

    // console.log("guestBookings", guestBookings);

    try {
        GuestBooking.insertMany(guestBookings)
            .then((bookings) => {
                
                mongoose.connection.close()

                bookings.forEach((booking) => {
                    setTimeout(() => {
                        setMessage("rpc_queue", {
                            year: moment(booking.checkIn).format("YYYY"),
                            month: moment(booking.checkIn).format("MMMM"),
                            bookingId: booking._id,
                        })
                    }, 4000)
                })

            })
    } catch(err) {
        throw err
    }

}

createRandomBooking()