const express = require('express');
const router = express.Router();
const serviceController = require('../controller/serviceController');
const { protect } = require('../middleware/authMiddleware');


router.get('/search', serviceController.searchService);


router.get('/:serviceProviderId/menu', serviceController.getMeauItemByServiceProviderId);


router.post('/create', protect, serviceController.createItem);


router.delete('/:id', protect, serviceController.deleteItem);


router.patch('/:id/availability', protect, serviceController.updateAvailibilityStatus);

module.exports = router;
