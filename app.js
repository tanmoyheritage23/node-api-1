const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRouter = require("./routes/posts");
const userRouter = require("./routes/user");

const app = express();

mongoose.connect("mongodb+srv://Tanmoy23:" + process.env.MONGO_ATLAS_PASSWORD + "@cluster0.ued66gq.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
  console.log("connected to MongoDB");
})
.catch(() => {
  console.log("connection failed!");
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images", express.static(path.join("images")));

app.use((req,res,next) => {

  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();

});


app.use("/api/posts", postRouter);
app.use("/api/user", userRouter);

// app.use("/", express.static(path.join(__dirname, "../dist/momenta")));

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "../dist/momenta/index.html"));
// });


module.exports = app;
