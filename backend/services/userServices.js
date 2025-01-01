const {User} = require('../model/userModel');
const { getUserIdFromToken } = require('../utils/jwtProvider');

module.exports = {
   async findUserById(userId){
    try {
        const user = await User.findById(userId).populate("addresses");
        if(!user){
            throw new Error("User not found with id",userId);
        }
        return user
    } catch (error) {
        throw new Error(error.message);
    }
   },
   
   async findUserProfileByJwt(jwt){
    try {
        const userId = getUserIdFromToken(jwt);
        const user = await this.findUserById(userId);
        
        return user;
    } catch (error) {
        throw new Error(error.message)
    }
   }
};