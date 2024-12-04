let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let add = document.getElementById("add");
let tasks = document.getElementById("tasks");

let data = []; // Initialize the data variable

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

let formValidation = () => {
  if (textInput.value === "") {
    console.log("failure");
    msg.innerHTML = "Task cannot be blank";
  } else {
    console.log("success");
    msg.innerHTML = "";
    acceptData();
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();

    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  }
};

let acceptData = () => {
  const task = {
    text: textInput.value,
    date: dateInput.value,
    description: textarea.value
  };

  fetch('http://localhost:3000/addTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    console.log(data);
    fetchTasks();
  })
  .catch((error) => {
    console.error('Error:', error);
    msg.innerHTML = "Failed to add task. Please try again.";
  });
};

let fetchTasks = () => {
  fetch('http://localhost:3000/tasks')
    .then(response => response.json())
    .then(tasksData => {
      data = tasksData; // Update the data variable with fetched tasks
      tasks.innerHTML = "";
      data.forEach((task, index) => {
        tasks.innerHTML += `
          <div id=${task.id}>
            <span class="fw-bold">${task.text}</span>
            <span class="small text-secondary">${task.date}</span>
            <p>${task.description}</p>
            <span class="options">
              <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#formModal" class="fas fa-edit"></i>
              <i onClick="deleteTask(this)" class="fas fa-trash-alt"></i>
            </span>
          </div>
        `;
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

let editTask = (e) => {
  let selectedTask = e.parentElement.parentElement;
  textInput.value = selectedTask.children[0].innerHTML;
  dateInput.value = selectedTask.children[1].innerHTML;
  textarea.value = selectedTask.children[2].innerHTML;
  deleteTask(e);
};

let deleteTask = (e) => {
  let taskId = e.parentElement.parentElement.id;
  fetch(`http://localhost:3000/deleteTask/${taskId}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    console.log(data);
    fetchTasks(); // Refresh the task list after deletion
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

let resetForm = () => {
  textInput.value = "";
  dateInput.value = "";
  textarea.value = "";
};

// Fetch tasks on page load
document.addEventListener('DOMContentLoaded', fetchTasks);