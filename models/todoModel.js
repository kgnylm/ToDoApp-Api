const monhgoose = require("mongoose");

const todoSchema = new monhgoose.Schema({
  user: {
    type: monhgoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Todo must belong to a user"],
  },

  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
});

const Todo = monhgoose.model("Todo", todoSchema);

module.exports = Todo;
