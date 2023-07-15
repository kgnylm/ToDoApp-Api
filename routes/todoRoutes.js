const todoController = require("../controllers/todoController");
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router
  .route("/:id")
  .get(authController.protect, todoController.getTodosForUser)
  .post(authController.protect, todoController.createTodo);

router
  .route("/:id/:todoId")
  .put(authController.protect, todoController.updateTodo)
  .delete(authController.protect, todoController.deleteTodo);

router
  .route("/:id/:todoId/priority")
  .put(authController.protect, todoController.changePriority);
  
module.exports = router;
