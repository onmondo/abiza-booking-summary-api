import { Router } from 'express';
import { getBookingsByMonth, getBookingsByYear, getYearlyBookings } from './reports';
import { newBooking } from './booking';

const router = Router();
router.get("/", getYearlyBookings)
    .get("/yearly", getYearlyBookings)
    .post("/", newBooking);

const reportRouter = Router();
reportRouter.get("/:month", getBookingsByMonth)
router.get("/:year", getBookingsByYear).use("/:year", reportRouter);

export default router;