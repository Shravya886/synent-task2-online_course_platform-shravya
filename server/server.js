const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/enroll", require("./routes/enrollRoutes"));
app.use("/api/mycourses", require("./routes/myCoursesRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req,res)=>{
   res.send("API Running");
});

app.listen(5000, ()=>{
   console.log("Server running on 5000");
});