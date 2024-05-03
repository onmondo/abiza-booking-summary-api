import { Router } from 'express';
import ReportEndpoints from './reports';
import BookingEndpoints from './booking';
import ErrorHandlers from './errorHandlers';
import { authorizeUser } from '../Users/middlewares';

const router = Router();
router
    .get("/", authorizeUser, ReportEndpoints.v2.getYearlyBookings, ErrorHandlers.v1.errorHandler)
    // .get("/:year", ReportEndpoints.v2.getBookingsByYear)
    .get("/:id", ReportEndpoints.v2.getBookingById, ErrorHandlers.v1.errorHandler)
    // .get("/yearly", ReportEndpoints.v2.getYearlyBookings)
    .post("/", BookingEndpoints.v1.newBooking, ErrorHandlers.v1.errorHandler);

router
    .get("/:year/:month", authorizeUser, ReportEndpoints.v2.getBookingsByMonth, ErrorHandlers.v1.errorHandler)
    .delete("/:year/:month/:id", BookingEndpoints.v1.deleteBookingById, ErrorHandlers.v1.errorHandler)
    .put("/:year/:month/:id", BookingEndpoints.v1.updateBookingById, ErrorHandlers.v1.errorHandler)
    .patch("/:year/:month/:id", BookingEndpoints.v1.softUpdateBookingById, ErrorHandlers.v1.errorHandler);

export default router;