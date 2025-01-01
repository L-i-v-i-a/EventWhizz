const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
const connectDB = require("./db/ConnectDB.js")
const globalErrorHandler = require("./controller/errorController.js")
const authRouter = require("./routes/authRoutes.js")
const serviceRouter = require("./routes/serviceRoutes.js")
const bookingRouter = require("./routes/bookingRoutes.js")
const serviceProviderRouter = require("./routes/serviceProviderRoutes.js")
const categoryRouter = require("./routes/categoryRoutes.js");
const plannedEventRouter = require("./routes/plannedEventsRoutes.js");
const AppError = require("./utils/appError.js")

dotenv.config({path:"./.env"})


const app = express();
app.use(express.json({limit:"9gb"}))
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());

app.use(
    cors({
        origin: "http://192.168.188.224:8081",
        credentials:true,
    })
);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Hello, I am Olivia");
});

app.use("/auth",authRouter)
app.use("/service", serviceRouter)
app.use("/serviceProvider", serviceProviderRouter)
app.use("/booking", bookingRouter)
app.use("/category", categoryRouter)
app.use("/plannedEvent", plannedEventRouter)


app.all("*",(req,res,next) =>{
    next(new AppError(`cant find ${req.originalUrl} on this server`,404))
})

app.use(globalErrorHandler)

const startServer = async () => {
    try {
        await connectDB(); 
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
