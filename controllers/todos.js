//Todo model
const Todo = require("../models/Todo");

// Cloudinary for image uploads
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  // getTodos method retrieves all todos for the logged-in user
  getTodos: async (req, res) => {
    //req.user is the user object attached to the request, which contains information about the logged-in user
    console.log(req.user);
    try {
      // Find all todos for the logged-in user
      //Todo model is used to interact with the database (MongoDB)
      // The find method retrieves all todos for the logged-in user
      //userId is used to filter todos by the user who created them, in the models schema
      //req.user.id is the id of the logged-in user, which is obtained from the request object
      //we will then store the retrieved todos in the todoItems variable
      const todoItems = await Todo.find({ userId: req.user.id });
      // Count the number of incomplete todos
      const itemsLeft = await Todo.countDocuments({
        userId: req.user.id,
        completed: false,
      });
      // Check if the request is an AJAX request
      // If so, respond with JSON
      if (req.headers["content-type"] === "application/json") {
        return res.json({ todos: todoItems, left: itemsLeft });
      }

      // Render the todos page with the retrieved data
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
