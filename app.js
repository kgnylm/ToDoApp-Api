const express = require("express");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const app = express();
const cors = require("cors");
const AppError = require("./utils/appError");
const authRouter = require("./routes/loginSignupRoutes");
const todoRouter = require("./routes/todoRoutes");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

//app.use("/api/v1/players", playerRouter);
app.use("/auth", authRouter);
app.use("/todo", todoRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
