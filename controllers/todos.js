//Todo model
const Todo = require("../models/Todo");

// Cloudinary for image uploads
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  // getTodos method retrieves all todos for the logged-in user
  getTodos: async (req, res) => {
    console.log(req.user);
    try {
      const todoItems = await Todo.find({ userId: req.user.id });
      const itemsLeft = await Todo.countDocuments({
        userId: req.user.id,
        completed: false,
      });

      if (req.headers["content-type"] === "application/json") {
        return res.json({ todos: todoItems, left: itemsLeft });
      }

      res.render("todos.ejs", {
        todos: todoItems,
        left: itemsLeft,
        user: req.user,
      });
    } catch (err) {
      console.log(err);
    }
  },

  // createTodo method creates a new todo item
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

  // toggleComplete method updates the completion status of a todo item

  toggleComplete: async (req, res) => {
    try {
      const { todoId, isChecked } = req.body;
      await Todo.findOneAndUpdate(
        { _id: todoId },
        {
          completed: isChecked,
        }
      );
      const message = isChecked ? "Marked Complete" : "Marked Incomplete";
      console.log(message);

      res.json({ message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  // deleteTodo method deletes a todo item
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
