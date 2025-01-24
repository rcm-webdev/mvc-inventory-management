//mongoose helps us connect to the database

const mongoose = require("mongoose");

//mongoose also helps us build up these shcemas to define the structure of our data
//schemas serve as a blueprint for the data into our template - makes code easy to maintain
const TodoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: false,
  },
  cloudinaryId: {
    type: String,
    require: false,
  },
});

module.exports = mongoose.model("Todo", TodoSchema);
