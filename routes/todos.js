const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const todosController = require("../controllers/todos");
const { ensureAuth } = require("../middleware/auth");

router.get("/", ensureAuth, todosController.getTodos);

router.post("/createTodo", upload.single("file"), todosController.createTodo);

router.put("/toggleComplete", todosController.toggleComplete);

router.delete("/deleteTodo", todosController.deleteTodo);

module.exports = router;
