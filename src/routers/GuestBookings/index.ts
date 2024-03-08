import { Router } from 'express';
import { getBookingsByMonth, getBookingsByYear, getYearlyBookings } from './reports';
import { newBooking, deleteBookingById } from './booking';

const router = Router();
router.get("/", getYearlyBookings)
    .get("/yearly", getYearlyBookings)
    .post("/", newBooking);

router.get("/:year", getBookingsByYear)
    .get("/:year/:month", getBookingsByMonth)
    .delete("/:year/:month/:id", deleteBookingById);

export default router;