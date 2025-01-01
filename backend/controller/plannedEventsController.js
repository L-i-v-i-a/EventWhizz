const plannedEventsService = require('../services/plannedEventsServices');

module.exports = {
    createPlannedEvent: async (req, res) => {
        try {
            const { images, date, eventType, description, serviceProvider, location } = req.body;

            if (!images || !date || !eventType || !description || !serviceProvider || !location) {
                return res.status(400).json({ error: "All required fields must be provided" });
            }

            const plannedEvent = await plannedEventsService.createPlannedEvent({
                images,
                date,
                eventType,
                description,
                serviceProvider,
                location,
            });

            res.status(201).json(plannedEvent);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    getPlannedEventById: async (req, res) => {
        try {
            const { eventId } = req.params;
            const event = await plannedEventsService.getPlannedEventById(eventId);

            if (!event) {
                return res.status(404).json({ error: "Event not found" });
            }

            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    getPlannedEventsByServiceProvider: async (req, res) => {
        try {
            const { serviceProviderId } = req.params;
            const events = await plannedEventsService.getPlannedEventsByServiceProvider(serviceProviderId);

            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    getAllPlannedEvents: async (req, res) => {
        try {
            const events = await plannedEventsService.getAllPlannedEvents();
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    updatePlannedEvent: async (req, res) => {
        try {
            const { eventId } = req.params;
            const updateData = req.body;

            const updatedEvent = await plannedEventsService.updatePlannedEvent(eventId, updateData);

            if (!updatedEvent) {
                return res.status(404).json({ error: "Event not found" });
            }

            res.status(200).json(updatedEvent);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    deletePlannedEvent: async (req, res) => {
        try {
            const { eventId } = req.params;
            await plannedEventsService.deletePlannedEvent(eventId);

            res.status(200).json({ message: "Event deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },
};
