const express = require("express");
const router = express.Router();
const plannedEventsController = require("../controller/plannedEventsController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/plannedEvents",
    authMiddleware.protect,
    plannedEventsController.createPlannedEvent
);

router.get(
    "/plannedEvents/:eventId",
    authMiddleware.protect,
    plannedEventsController.getPlannedEventById
);

router.get(
    "/plannedEvents/serviceProvider/:serviceProviderId",
    authMiddleware.protect,
    plannedEventsController.getPlannedEventsByServiceProvider
);

router.get(
    "/plannedEvents",
    authMiddleware.protect,
    plannedEventsController.getAllPlannedEvents
);

router.put(
    "/plannedEvents/:eventId",
    authMiddleware.protect,
    plannedEventsController.updatePlannedEvent
);

router.delete(
    "/plannedEvents/:eventId",
    authMiddleware.protect,
    plannedEventsController.deletePlannedEvent
);

module.exports = router;
