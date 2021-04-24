const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const Promise = require("bluebird");
const requestRoute = require("./api/routes/requestRoute");
const app = express();

app.use(bodyParser.json());
dotenv.config();
const allowCors =
  process.env.NODE_ENV === "dev"
    ? { credentials: true, origin: process.env.UI }
    : {};
app.use(cors(allowCors));

app.use("/api/request", requestRoute);

app.use("/r", requestRoute);

// app.listen(process.env.PORT || 8080, () => {
//   console.log("Server Started");
// });
const port = process.env.PORT || 8080;
const appStart = () =>
  new Promise((res, rej) => {
    app.listen(port, () => {
      console.log("App server started");
      return res();
    });
  });

const mongoConnect = () =>
  new Promise((res, rej) => {
    mongoose.connect(
      process.env.DB,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      (err) => {
        if (err) return rej(err);
        else {
          console.log("mongodb connected");
          return res();
        }
      }
    );
  });

mongoConnect()
  .then(appStart)
  .catch((err) => console.log(err));
