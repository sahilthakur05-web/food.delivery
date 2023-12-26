const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./Route/index");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
// configure env
dotenv.config();
const url =
  "mongodb+srv://thakursahil29124:sahilthakur2006@cluster0.ek8uvmu.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(url)
  .then((res) => console.log("Data base connected"))
  .catch((err) => console.log("Data base not connected"));

const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, "./client/build")));

app.use("/api", router);
// app.use("*", function (req, res) {
 //  res.sendFile(path.join(__dirname, "./client/built/index.html"));
// });
app.listen(port, () => console.log(`server is up and running at port ${port}`));
