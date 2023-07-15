const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const newUser = await User.create({
    username,
    password,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
      token,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new appError("Please provide username and password", 400));
  }
  const user = await User.findOne({ username }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError("Incorrect username or password", 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new appError("You are not logged in! Please log in to get access.", 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  req.user = currentUser;
  next();
});
