const bookingService = require('../services/bookingServices');
const sendEmail = require("../utils/email");

module.exports = {
    createBooking: async (req, res) => {
        try {
            const { client, serviceProvider, eventInfo, service, totalItem, totalAmount, totalPrice } = req.body;

            if (!client || !serviceProvider || !service || service.length === 0 || !totalItem || !totalAmount || !totalPrice) {
                return res.status(400).json({ error: "All required fields must be provided" });
            }

            const booking = await bookingService.createBooking({
                client,
                serviceProvider,
                eventInfo,
                service,
                totalItem,
                totalAmount,
                totalPrice,
            });

            const providerEmail = await bookingService.getServiceProviderEmail(serviceProvider);

            if (providerEmail) {
                await sendEmail({
                    email: providerEmail,
                    subject: "New Booking Received",
                    html: `
                        <h3>You have received a new booking!</h3>
                        <p><strong>Client:</strong> ${client}</p>
                        <p><strong>Event:</strong> ${eventInfo}</p>
                        <p><strong>Services:</strong> ${service.join(', ')}</p>
                        <p><strong>Total Items:</strong> ${totalItem}</p>
                        <p><strong>Total Price:</strong> $${totalPrice}</p>
                        <p>Please log in to your dashboard to review and update the status.</p>
                    `,
                });
            }

            res.status(201).json(booking);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    updateBookingStatus: async (req, res) => {
        try {
            const { bookingId } = req.params;
            const { bookingStatus } = req.body;

            if (!["pending", "confirmed", "completed", "cancelled"].includes(bookingStatus)) {
                return res.status(400).json({ error: "Invalid booking status" });
            }

            const updatedBooking = await bookingService.updateBookingStatus(bookingId, bookingStatus);

            if (!updatedBooking) {
                return res.status(404).json({ error: "Booking not found" });
            }

            const userEmail = await bookingService.getUserEmail(updatedBooking.client);

            if (userEmail) {
                await sendEmail({
                    email: userEmail,
                    subject: "Booking Status Update",
                    html: `
                        <h3>Your booking status has been updated!</h3>
                        <p><strong>Status:</strong> ${bookingStatus}</p>
                        <p>Please log in to your account for more details.</p>
                    `,
                });
            }

            res.status(200).json(updatedBooking);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    getBookingById: async (req, res) => {
        try {
            const { bookingId } = req.params;
            const booking = await bookingService.getBookingById(bookingId);

            if (!booking) {
                return res.status(404).json({ error: "Booking not found" });
            }

            res.status(200).json(booking);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    getBookingsByUser: async (req, res) => {
        try {
            const userId = req.user.id;
            const bookings = await bookingService.getBookingsByUser(userId);

            res.status(200).json(bookings);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    getBookingsByServiceProvider: async (req, res) => {
        try {
            const { serviceProviderId } = req.params;
            const bookings = await bookingService.getBookingsByServiceProvider(serviceProviderId);

            res.status(200).json(bookings);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    deleteBooking: async (req, res) => {
        try {
            const { bookingId } = req.params;
            await bookingService.deleteBooking(bookingId);

            res.status(200).json({ message: "Booking deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },
};
