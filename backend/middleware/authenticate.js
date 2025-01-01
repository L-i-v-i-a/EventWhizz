const userServices = require("../services/userServices");
const AppError = require("../utils/AppError");
const { getUserIdFromToken } = require("../utils/jwtProvider");

const authenticate = async(req,res,next)=>{
    try {
        const token = req.headers.authorization?.splite(" ")[1]

        if (!token) {
            return next(new AppError("no token provided",401));
        }
        const userId = getUserIdFromToken(token);
        const user = userServices.findUserById(userId);

        req.user = user;
    } catch (error) {
        return next(new AppError(error.message));
    }
    next();
}

module.exports = authenticate