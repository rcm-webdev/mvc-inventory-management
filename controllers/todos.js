const Todo = require("../models/Todo");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  getTodos: async (req, res) => {
    console.log(req.user);
    try {
      const todoItems = await Todo.find({ userId: req.user.id });
      const itemsLeft = await Todo.countDocuments({
        userId: req.user.id,
        completed: false,
      });
      res.render("todos.ejs", {
        todos: todoItems,
        left: itemsLeft,
        user: req.user,
      });
    } catch (err) {
      console.log(err);
    }
  },
  createTodo: async (req, res) => {
    try {
      let result = {};
      if (req.file) {
        // Upload image to cloudinary
        result = await cloudinary.uploader.upload(req.file.path);
      }

      await Todo.create({
        todo: req.body.todoItem,
        completed: false,
        userId: req.user.id,
        image: result.secure_url || null,
        cloudinaryId: result.public_id || null,
      });
      console.log("Todo has been added!");
      res.redirect("/todos");
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  },
  markComplete: async (req, res) => {
    try {
      await Todo.findOneAndUpdate(
        { _id: req.body.todoIdFromJSFile },
        {
          completed: true,
        }
      );
      console.log("Marked Complete");
      res.json("Marked Complete");
    } catch (err) {
      console.log(err);
    }
  },
  markIncomplete: async (req, res) => {
    try {
      await Todo.findOneAndUpdate(
        { _id: req.body.todoIdFromJSFile },
        {
          completed: false,
        }
      );
      console.log("Marked Incomplete");
      res.json("Marked Incomplete");
    } catch (err) {
      console.log(err);
    }
  },
  deleteTodo: async (req, res) => {
    console.log(req.body.todoIdFromJSFile);
    try {
      //find the todo by id
      const todo = await Todo.findById(req.body.todoIdFromJSFile);

      // CHeck if the todo has a cloudinaryId before attempting to delete the image
      if (todo.cloudinaryId) {
        await cloudinary.uploader.destroy(todo.cloudinaryId);
      }

      //Delete the todo from the database
      await Todo.findOneAndDelete({ _id: req.body.todoIdFromJSFile });
      console.log("Deleted Todo");
      res.json("Deleted It");
    } catch (err) {
      console.log(err);
    }
  },
};
