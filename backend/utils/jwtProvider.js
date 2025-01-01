require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET
const jwt = require("jsonwebtoken")

const getUserIdFromToken = (token) =>{
    const decodedToken =jwt.verify(token,SECRET_KEY)
    return decodedToken.userId 
}
module.exports = {getUserIdFromToken}