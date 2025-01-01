const { PlannedEvents } = require('../model/plannedEventModel');

module.exports = {
    createPlannedEvent: async (eventData) => {
        try {
            const newEvent = new PlannedEvents(eventData);
            const savedEvent = await newEvent.save();
            return savedEvent;
        } catch (error) {
            throw new Error("Error creating planned event: " + error.message);
        }
    },

    getPlannedEventById: async (eventId) => {
        try {
            const event = await PlannedEvents.findById(eventId).populate('serviceProvider');
            if (!event) {
                throw new Error("Event not found");
            }
            return event;
        } catch (error) {
            throw new Error("Error fetching planned event by ID: " + error.message);
        }
    },

    getPlannedEventsByServiceProvider: async (serviceProviderId) => {
        try {
            const events = await PlannedEvents.find({ serviceProvider: serviceProviderId }).populate('serviceProvider');
            return events;
        } catch (error) {
            throw new Error("Error fetching planned events by service provider: " + error.message);
        }
    },

    getAllPlannedEvents: async () => {
        try {
            const events = await PlannedEvents.find().populate('serviceProvider');
            return events;
        } catch (error) {
            throw new Error("Error fetching all planned events: " + error.message);
        }
    },

    updatePlannedEvent: async (eventId, updateData) => {
        try {
            const updatedEvent = await PlannedEvents.findByIdAndUpdate(eventId, updateData, { new: true });
            if (!updatedEvent) {
                throw new Error("Event not found");
            }
            return updatedEvent;
        } catch (error) {
            throw new Error("Error updating planned event: " + error.message);
        }
    },

    deletePlannedEvent: async (eventId) => {
        try {
            const deletedEvent = await PlannedEvents.findByIdAndDelete(eventId);
            if (!deletedEvent) {
                throw new Error("Event not found");
            }
            return deletedEvent;
        } catch (error) {
            throw new Error("Error deleting planned event: " + error.message);
        }
    },
};
