const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoute = require("./routes/users");
const adminRoute = require("./routes/admin");
const movieRoute = require("./routes/movies");
const seriesRoute = require("./routes/series");

const app = express();
env.config();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.DB)
  .then(console.log("connected to DB"))
  .catch((err) => {
    console.log(err);
  });

app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/movies", movieRoute);
app.use("/api/series", seriesRoute);

let port = process.env.PORT || 2000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("listening on port ", port);
  }
});
