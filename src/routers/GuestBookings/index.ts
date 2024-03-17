import { Router } from 'express';
import ReportEndpoints from './reports';
import BookingEndpoints from './booking';

const router = Router();
router.get("/", ReportEndpoints.v2.getYearlyBookings)
    .get("/:id", ReportEndpoints.v2.getBookingById)
    .get("/yearly", ReportEndpoints.v1.getYearlyBookings)
    .post("/", BookingEndpoints.v1.newBooking);

router.get("/:year", ReportEndpoints.v1.getBookingsByYear)
    .get("/:year/:month", ReportEndpoints.v1.getBookingsByMonth)
    .delete("/:year/:month/:id", BookingEndpoints.v1.deleteBookingById)
    .put("/:year/:month/:id", BookingEndpoints.v1.updateBookingById)
    .patch("/:year/:month/:id", BookingEndpoints.v1.softUpdateBookingById);

export default router;