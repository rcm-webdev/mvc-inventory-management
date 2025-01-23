//using express router to handle our routing
const express = require("express");
const router = express.Router();
//middleware for handling file uploads including images
const upload = require("../middleware/multer");
//controller folder for the todos controller that handles the logic for the todos
const todosController = require("../controllers/todos");

//middleware to make sure someone is authenticated before accessing the route
const { ensureAuth } = require("../middleware/auth");

//each todosController has a method that handles the logic for that route
//getTodos is the method that handles the logic for the / route
router.get("/", ensureAuth, todosController.getTodos);

//createTodo is a method that creates a new todo
router.post("/createTodo", upload.single("file"), todosController.createTodo);

//toggleComplete is a method that updates completion status of a todo
router.put("/toggleComplete", todosController.toggleComplete);

//deleteTodo is a method that deletes a todo
router.delete("/deleteTodo", todosController.deleteTodo);

module.exports = router;
