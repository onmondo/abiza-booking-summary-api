import { Router } from 'express';
import { getBookingsByMonth, getBookingsByYear, getYearlyBookings } from './reports';
import { newBooking } from './booking';

const router = Router();
router.get("/", getYearlyBookings)
    .get("/yearly", getYearlyBookings)
    .post("/", newBooking);

router.get("/:year", getBookingsByYear).get("/:year/:month", getBookingsByMonth);

export default router;