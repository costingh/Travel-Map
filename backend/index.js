const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const userRoute = require("./routes/users");
const pinRoute = require("./routes/pins");
const bodyParser = require("body-parser");

dotenv.config();


app.use(bodyParser.urlencoded({ extended: true }));

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(()  => {
        console.log('Mongo DB Connected');
    })
    .catch((err) => console.log(err));

    // middleware
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

app.listen(8800, () => {
    console.log("Server is running....")
})