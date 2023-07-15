const Todo = require("../models/todoModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

exports.createTodo = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { title, description, priority } = req.body;
  const newTodo = await Todo.create({
    title,
    description,
    priority,
    user: id,
  });
  res.status(201).json({
    status: "success",
    data: {
      newTodo,
    },
  });
});

exports.getTodosForUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const todos = await Todo.find({ user: id });
  res.status(200).json({
    status: "success",
    data: {
      todos,
    },
  });
});

exports.updateTodo = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const todoId = req.params.todoId;
  const todo = await Todo.findByIdAndUpdate(
    { _id: todoId, user: id },
    { completed: true },
    { new: true }
  );
  if (!todo) {
    return next(new appError("No todo found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      todo,
    },
  });
});

exports.changePriority = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const todoId = req.params.todoId;
  const { priority } = req.body;
  const todo = await Todo.findByIdAndUpdate(
    { _id: todoId, user: id },
    { priority },
    { new: true }
  );
  if (!todo) {
    return next(new appError("No todo found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      todo,
    },
  });
});

exports.deleteTodo = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const todoId = req.params.todoId;
  const todo = await Todo.findOneAndDelete({ _id: todoId, user: id });
  if (!todo) {
    return next(new appError("No todo found with that id", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
