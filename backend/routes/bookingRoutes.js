const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/bookings",
    authMiddleware.protect,
    bookingController.createBooking
);

router.put(
    "/bookings/:bookingId/status",
    authMiddleware.protect,
    bookingController.updateBookingStatus
);

router.get(
    "/bookings/:bookingId",
    authMiddleware.protect,
    bookingController.getBookingById
);

router.get(
    "/bookings/user",
    authMiddleware.protect,
    bookingController.getBookingsByUser
);

router.get(
    "/bookings/serviceProvider/:serviceProviderId",
    authMiddleware.protect,
    bookingController.getBookingsByServiceProvider
);

router.delete(
    "/bookings/:bookingId",
    authMiddleware.protect,
    bookingController.deleteBooking
);

module.exports = router;
