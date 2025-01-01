const serviceService = require('../services/serviceService')
const ServiceProviderServices = require('../services/ServiceProviderServices')
const userService = require('../services/userServices')

module.exports={
    searchService: async(req,res) => {
        try {
            const {name} = req.query;
            const menuItem = await serviceService.searchService(name)
            res.status(200).json(menuItem)
        } catch (error) {
            res.status(500).json({error:"Internal server error"})
        }
    },
    getMeauItemByServiceProviderId: async(req,res) => {
        try {
            const {serviceProviderId} = req.params;
            const {service_category} = req.query;
            const menuItems = await serviceService.getServiceProvidersService(service_category)
            res.status(200).json(menuItems)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error:error.message});
            } else {
                res.status(500).json({error:"Internal server error"})
            }
        }
    },

    createItem: async(req,res) => {
        try {
            const item = req.body;
            const user = req.user;
            const serviceProvider = await ServiceProviderServices.findServiceProviderByID(item.serviceProviderId);
            const menuItem = await serviceService.createService(item,serviceProvider)
            res.status(200).json(menuItem)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error:error.message});
            } else {
                res.status(500).json({error:"Internal server error"})
            }
        }
    },

    deleteItem: async(req,res) => {
        try {
            const {id} = req.params;
            const user = req.user;
            await serviceService.deleteService(id)
            res.status(200).json({message:"Menu Item deleted"})
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error:error.message});
            } else {
                res.status(500).json({error:"Internal server error"})
            }
        }
    },

    updateAvailibilityStatus: async(req,res) => {
        try {
           const {id} = req.params;
            const menuItem = await serviceService.updateAvailibilityStatus(id)
            res.status(200).json(menuItem)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error:error.message});
            } else {
                res.status(500).json({error:"Internal server error"})
            }
        }
    },

}