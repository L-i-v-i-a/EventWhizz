const ServiceProviderServices = require("../services/ServiceProviderServices");
const AppError = require("../utils/appError");
module.exports = {
    createServiceProvider: async(req,res,next) =>{
        try {
            const user = req.user;
            const serviceProvider = await ServiceProviderServices.createServiceProvider(req.body,user);
            res.status(200).json(serviceProvider)
        } catch (error) {
            return next (new AppError(error.message,400))
        }
    },
    deleteServiceProviderById:async(req,res,next)=>{
        try {
            const {id} = req.params
            await ServiceProviderServices.deleteServiceProvider(id);
            return next (new AppError("service provider with id has be deleted successfully",400))
        } catch (error) {
            if(error instanceof Error){
                return next (new AppError(error.message,400))
            }else{
                return next (new AppError("Internal Server Error",400))
            }
        }
    },
    updateServiceProviderStatus:async(req,res,next)=>{
        try {
            const {id} = req.params;
            console.log("service provider id",id);
            await ServiceProviderServices.updateServiceProviderStatus(id.toString());
            console.log("service provider id",id)
            return next (new AppError("service provider with id has be deleted successfully",400))
        } catch (error) {
            if(error instanceof Error){
                return next (new AppError(error.message,400))
            }else{
                return next (new AppError("Internal Server Error",400))
            }
        }
    },
    findServiceProvidersByUserID:async(req,res,next)=>{
        try {
           const user = req.user
           const serviceProvider = await ServiceProviderServices.getServiceProvidersByUserId(user._id);
           res.status(200).json(serviceProvider)
        } catch (error) {
            if(error instanceof Error){
                return next (new AppError(error.message,400))
            }else{
                return next (new AppError("Internal Server Error",400))
            }
        }
    },
    findServiceProvidersByName:async(req,res,next)=>{
        try {
            const {keyword} = req.query;
          const serviceProviders = await ServiceProviderServices.searchServiceProviders(keyword);
          res.status(200).json(serviceProviders)
        } catch (error) {
            if(error instanceof Error){
                return next (new AppError(error.message,400))
            }else{
                return next (new AppError("Internal Server Error",400))
            }
        }
    },
    findAllServiceProviders:async(req,res,next)=>{
        try {
          const serviceProviders = await ServiceProviderServices.getAllServiceProviders();
          res.status(200).json(serviceProviders)
        } catch (error) {
            if(error instanceof Error){
                return next (new AppError(error.message,400))
            }else{
                return next (new AppError("Internal Server Error",400))
            }
        }
    },
    findServiceProvidersById:async(req,res,next)=>{
        try {
            const {id} = req.params;
          const serviceProvider = await ServiceProviderServices.findServiceProviderByID(id);
          res.status(200).json(serviceProvider)
        } catch (error) {
            if(error instanceof Error){
                return next (new AppError(error.message,400))
            }else{
            return next (new AppError("Internal Server Error",400))
        }
    }
    },
    addToFavouite:async(req,res,next)=>{
        try {
          const {id} = req.params;
          const user = req.user;
          const serviceProvider = await ServiceProviderServices.addToFavouite(id,user);
          res.status(200).json(serviceProvider)
        } catch (error) {
            if(error instanceof Error){
                return next (new AppError(error.message,400))
            }else{
            return next (new AppError("Internal Server Error",400))
        }
    }
    },
}