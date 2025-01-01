const express = require("express");
const router = express.Router();
const serviceController = require("../controller/serviceController");
const authMiddleware = require("../middleware/authMiddleware");
const {upload,uploadToCloudinary} = require("../middleware/multer");
router.get(
    "/services/search",
    authMiddleware.protect,
    serviceController.searchService
);

router.get(
    "/services/provider/:serviceProviderId",
    authMiddleware.protect,
    serviceController.getMeauItemByServiceProviderId
);

router.post(
    "/services",
    upload.array("images",10),
    uploadToCloudinary,
    authMiddleware.protect,
    serviceController.createItem
);

router.delete(
    "/services/:id",
    authMiddleware.protect,
    serviceController.deleteItem
);

router.put(
    "/services/:id/availability",
    authMiddleware.protect,
    serviceController.updateAvailibilityStatus
);

module.exports = router;
