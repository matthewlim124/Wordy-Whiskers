const express = require("express");

const errorHandler = require("./middleware/errorHandler.js");
const dotenv = require("dotenv").config();
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const supabase = require("./config/dbConnection.js");
const cookieparser = require("cookie-parser");
if(supabase){
    console.log("DB connected succesfully!!")
}

const app = express();
const port = process.env.PORT || 8080;



app.use(express.json()); //body parser, get json body dari req
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/api/player", require("./routes/playerRoutes.js")); //use middleware
app.use("/api/user", require("./routes/userRoutes.js"));
app.use(errorHandler); //ubah html format dari error ke json
app.use(express.static(path.join(__dirname)));





app.get("/", (req,res) => {
    res.send("Hello World");
});



app.listen(port,() => {
    console.log(`Listening on port ${port}`);
});

