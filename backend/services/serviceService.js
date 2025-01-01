const { Service } = require("../model/servicesModel")

module.exports = {
    async createService(req,serviceProvider){
        try {
            const service = new Service({
                serviceCategory:req.category,
                creationDate: new Date(),
                description: req.description,
                images:req.images,
                name:req.name,
                price:req.price,
                serviceProvider:serviceProvider._id
            })
            await service.save();;
            return service
        } catch (error) {
            throw new Error(`Failed to create service ${error.message}`)
        }
    },
    async deleteService(serviceId){
        try {
            const service = await Service.findById(serviceId);
            if(!service){
                throw new Error(`service not found with id${foodId}`)
            }
            await Service.findByIdAndDelete(serviceId)
            
        } catch (error) {
            throw new Error(`Failed to delete service with id ${serviceId}:${error.message}`)
        }
        },
        async getServiceProvidersService( serviceProviderId,serviceCategory){
            try {
                let query = {serviceProvider:serviceProviderId};
                if (serviceCategory) query.serviceCategory = serviceCategory;
                const services = await Service.find(query).populate([
                    "serviceCategory",
                    {path:"serviceProvider",select:"businessName _id"}
                ]);
                return services
            } catch (error) {
                throw new Error(`Failed to retrive service providers services:${error.message}`)
            }
        },
        async searchService( keyword){
            try {
                let query = {};
                if (keyword){
                    query.$or =[
                        {name: {$regex:keyword, $options:"i"}},
                        {"serviceCategory.name": {$regex:keyword, $options:"i"}}
                    ];
                }   const services = await Service.find(query)
                return services
            } catch (error) {
                throw new Error(`Failed to search for service providers services:${error.message}`)
            }
        },     
        async updateAvailibilityStatus( serviceId){
            try {
            const service = await Service.findById(serviceId).populate([
                "serviceCategory",
                    {path:"serviceProvider",select:"businessName _id"}
            ]);
            if(!service){
                throw new Error(`Service not found with ID ${serviceId}`);
            }
            service.avaliable = !service.avaliable
            await service.save();
                return service;
            } catch (error) {
                throw new Error(`Failed to update service providers services for service ID ${serviceId}:${error.message}`)
            }
        },     
        

    }
