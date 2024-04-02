import { Router } from 'express';
import ReportEndpoints from './reports';
import BookingEndpoints from './booking';
import { authorizeUser } from '../Users/middlewares';

const router = Router();
router
    .get("/", authorizeUser, ReportEndpoints.v2.getYearlyBookings)
    .get("/:year", authorizeUser, ReportEndpoints.v2.getBookingsByYear)
    .get("/:id", authorizeUser, ReportEndpoints.v2.getBookingById)
    // .get("/yearly", ReportEndpoints.v2.getYearlyBookings)
    .post("/", authorizeUser, BookingEndpoints.v1.newBooking);

router
    .get("/:year/:month", authorizeUser, ReportEndpoints.v2.getBookingsByMonth)
    .delete("/:year/:month/:id", authorizeUser, BookingEndpoints.v1.deleteBookingById)
    .put("/:year/:month/:id", authorizeUser, BookingEndpoints.v1.updateBookingById)
    .patch("/:year/:month/:id", authorizeUser, BookingEndpoints.v1.softUpdateBookingById);

export default router;