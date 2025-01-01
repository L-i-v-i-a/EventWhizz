const { ServiceProvider } = require("../model/serviceProviderModel");
const sendEmail = require("../utils/email");

module.exports = {
    async createServiceProvider(req,user){
        try {
            const address = new address({
                city:req.address.city,
                country:req.address.country,
                name:req.address.name,
                state:req.address.state,
                streetName:req.address.streetName
            })
            const savedAddress = await address.save();

            const serviceProvider = new serviceProvider({
                address:savedAddress,
                contactInformation:req.contactInformation,
                description:req.description,
                images:req.images,
                businessName:req.businessName,
                openingHours:req.openingHours,
                registrationDate:req.registrationDate,
                owner:user
            })

            const savedServiceProvider = await serviceProvider.save();

            await sendEmail({
                email: savedServiceProvider.email,
                subject: "Welcome to Event Whiz",
                html: `
                  <h1>Welcome ${businessName}</h1>
                  <p>Please verify your email. If you did not request this, ignore this email.</p>
                  <p>Do not share this verification code with anyone.</p>
                  <h1>Enjoy your journey</h1>
                `,
              });
          
            return savedServiceProvider
        } catch (error) {
            throw new Error(error.message)
        }
    },

    async findServiceProviderByID(serviceProviderId){
        try {
            const serviceProvider = await serviceProvider.findById(serviceProviderId);
            if(!serviceProvider) throw new Error("Service Provider not found");
            return serviceProvider ;
        } catch (error) {
            throw new Error(error.message)
        }
    },

    async deleteServiceProvider(serviceProviderId){
        try {
            this.findServiceProviderByID(serviceProviderId)
        const serviceProvider = await serviceProvider.deleteByid(serviceProviderId)
        } catch (error) {
            throw new Error (error.message)
        }
    },
    async getAllServiceProviders(){
        try {
           const serviceProviders = await ServiceProvider.find();
           return serviceProviders
        } catch (error) {
            throw new Error(error.message)
        }
    },
    
    async getServiceProvidersByUserId(userId){
        try {
           const serviceProvider = await ServiceProvider.findOne({owner:userId})
           .populate("owner")
           .populate("address");

           if (!serviceProvider) {
            throw new Error("service provider not found");
           }
           return serviceProvider
        } catch (error) {
            throw new Error(error.message)
        }
    },
    async searchServiceProviders(keyword){
        try {
           const serviceProvider = await ServiceProvider.find({
            $or:[
               {
                businessName:{$regex:keyword, $options:"i" },
                description:{$regex:keyword, $options:"i"},
               }
            ]
           });
           return serviceProvider
        } catch (error) {
            throw new Error(error.message)
        }
    },

    async addToFavouite(serviceProviderId,user){
        try{
            const serviceProvider = this.findServiceProviderByID(serviceProviderId);
            const dto = {
                _id:serviceProvider._id,
                title:serviceProvider.businessName,
                images:serviceProvider.images,
                description:serviceProvider.description
            }
            const favourites = user.favourites || [];
            const index = favourites.findIndex(favourites=>favourites._id === serviceProviderId);

            if(index!==-1){
                favourites.splice(index,1)
            }else{
                favourites.push(dto);
            }
            user.favourites = favourites;
            await user.save();
            return dto
        }
        catch(error){
            throw new Error(error.message)
        }
    },
    async updateServiceProviderStatus(id){
        try {
            const serviceProvider = await ServiceProvider.findById(id)
            .populate("owner")
            .populate("address");
            if(!serviceProvider){
                throw new Error("Service provider not found")
            }
            serviceProvider.open = !serviceProvider.open;
            await serviceProvider.save();
            return serviceProvider;
        } catch (error) {
            throw new Error(error.message)
        }
    }
}