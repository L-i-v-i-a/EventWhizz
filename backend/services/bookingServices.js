const { Booking } = require('../model/bookingModel');
const User = require('../model/userModel');
const ServiceProvider = require('../model/serviceProviderModel');

module.exports = {
    createBooking: async (bookingData) => {
        try {
            const newBooking = new Booking(bookingData);
            const savedBooking = await newBooking.save();
            return savedBooking;
        } catch (error) {
            throw new Error("Error creating booking: " + error.message);
        }
    },

    updateBookingStatus: async (bookingId, bookingStatus) => {
        try {
            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId,
                { bookingStatus },
                { new: true }
            );

            if (!updatedBooking) {
                throw new Error("Booking not found");
            }

            return updatedBooking;
        } catch (error) {
            throw new Error("Error updating booking status: " + error.message);
        }
    },

    getBookingById: async (bookingId) => {
        try {
            const booking = await Booking.findById(bookingId).populate('service client serviceProvider');
            if (!booking) {
                throw new Error("Booking not found");
            }
            return booking;
        } catch (error) {
            throw new Error("Error fetching booking by ID: " + error.message);
        }
    },

    getBookingsByUser: async (userId) => {
        try {
            const bookings = await Booking.find({ client: userId }).populate('service client serviceProvider');
            return bookings;
        } catch (error) {
            throw new Error("Error fetching bookings by user: " + error.message);
        }
    },

    getBookingsByServiceProvider: async (serviceProviderId) => {
        try {
            const bookings = await Booking.find({ serviceProvider: serviceProviderId }).populate('service client serviceProvider');
            return bookings;
        } catch (error) {
            throw new Error("Error fetching bookings by service provider: " + error.message);
        }
    },

    deleteBooking: async (bookingId) => {
        try {
            const deletedBooking = await Booking.findByIdAndDelete(bookingId);
            if (!deletedBooking) {
                throw new Error("Booking not found");
            }
            return deletedBooking;
        } catch (error) {
            throw new Error("Error deleting booking: " + error.message);
        }
    },

    getServiceProviderEmail: async (serviceProviderId) => {
        try {
            const provider = await ServiceProvider.findById(serviceProviderId).select('email');
            return provider ? provider.email : null;
        } catch (error) {
            throw new Error("Error fetching service provider email: " + error.message);
        }
    },

    getUserEmail: async (userId) => {
        try {
            const user = await User.findById(userId).select('email');
            return user ? user.email : null;
        } catch (error) {
            throw new Error("Error fetching user email: " + error.message);
        }
    },
};
