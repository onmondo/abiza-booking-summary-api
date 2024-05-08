import { Router } from 'express';
import ReportEndpoints from './reports';
import BookingEndpoints from './booking';
import ErrorHandlers from './errorHandlers';
import { authorizeUser } from '../Users/middlewares';

const router = Router();
// router.use(authorizeUser);
router
    .get("/", ReportEndpoints.v2.getYearlyBookings)
    // .get("/:year", ReportEndpoints.v2.getBookingsByYear)
    .get("/:id", ReportEndpoints.v2.getBookingById)
    .get("/reference/:id", ReportEndpoints.v2.getBookingByReferenceId)
    // .get("/yearly", ReportEndpoints.v2.getYearlyBookings)
    .post("/", authorizeUser, BookingEndpoints.v1.newBooking)
    .post("/csv", authorizeUser, BookingEndpoints.v1.newBookings);
    
router
    .get("/:year/:month", ReportEndpoints.v2.getBookingsByMonth)
    .delete("/:year/:month/:id", BookingEndpoints.v1.deleteBookingById)
    .put("/:year/:month/:id", BookingEndpoints.v1.updateBookingById)
    .patch("/:year/:month/:id", BookingEndpoints.v1.softUpdateBookingById);

router.use(ErrorHandlers.v1.errorHandler);

export default router;