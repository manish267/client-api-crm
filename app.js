const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require('dotenv').config();
const mongoose=require('mongoose');

// API security
app.use(helmet());

// handle CORS error
app.use(cors());

// MongoDB Connection Setup

mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
})

mongoose.connection.on('open',()=>{
  console.log("Database connected")
})

mongoose.connection.on('error',(error)=>{
  console.log(error)
})

// Logger
app.use(morgan("tiny"));

// Set body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 3001;

// Load routers
const userRouter = require("./src/routers/user.router.js");
const ticketRouter = require("./src/routers/ticket.router.js");

// Use Routers

app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);

// Error Handler

const handleError = require("./src/utils/errorHandler");
app.use("*", (req, res, next) => {
  const error = new Error("Resources not found");
  error.status = 404;

  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.listen(port, () => {
  console.log("API is ready on http://localhost:3001");
});
