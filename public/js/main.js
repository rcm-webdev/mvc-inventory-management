const deleteBtn = document.querySelectorAll(".del");
const todoItems = document.querySelectorAll(".todoItem"); // Use .todoItem to target the entire row (checkbox and text)
const checkboxes = document.querySelectorAll(".checkbox"); // Select all checkboxes

// Toggle Complete/Incomplete
Array.from(checkboxes).forEach((checkbox) => {
  checkbox.addEventListener("click", toggleCompleteStatus);
});

async function toggleCompleteStatus(event) {
  const todoId = event.target.dataset.id; // Get the todo ID from the clicked checkbox
  const isChecked = event.target.checked; // Get the current state of the checkbox

  const url = isChecked ? "/todos/markComplete" : "/todos/markIncomplete"; // Toggle URL based on the state

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
      }),
    });

    const data = await response.json();
    console.log(data);
    location.reload(); // Reload to reflect the updated state
  } catch (err) {
    console.error("Error toggling todo status: ", err);
  }
}

// Delete Todo
Array.from(deleteBtn).forEach((el) => {
  el.addEventListener("click", deleteTodo);
});

async function deleteTodo() {
  const todoId = this.closest(".todoItem").dataset.id;
  try {
    const response = await fetch("/todos/deleteTodo", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload(); // Reload the page after deletion
  } catch (err) {
    console.error("Error deleting todo: ", err);
  }
}
