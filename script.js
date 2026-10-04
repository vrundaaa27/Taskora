let tasks = [];

// Get saved tasks from localStorage
const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
}

// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

let currentFilter = "all";
function updateFilterButtons() {

    allBtn.classList.remove("active");
    activeBtn.classList.remove("active");
    completedBtn.classList.remove("active");

    if (currentFilter === "all") {
        allBtn.classList.add("active");
    }

    if (currentFilter === "active") {
        activeBtn.classList.add("active");
    }

    if (currentFilter === "completed") {
        completedBtn.classList.add("active");
    }
}

let editingTask = null;
cancelEditBtn.style.display = "none";

// Display all tasks
function displayTasks() {

    // Clear task list
    taskList.innerHTML = "";

    // Display each task
    tasks.forEach(function(task) {

    if (currentFilter === "active" && task.completed) {
        return;
    }

    if (currentFilter === "completed" && !task.completed) {
        return;
    }

        const listItem = document.createElement("li");

        const taskText = document.createElement("span");

         taskText.textContent = task.text;

         listItem.appendChild(taskText);

        // Show completed task
        if (task.completed) {
            listItem.classList.add("completed");
        }

        // Create Edit button
        const editBtn = document.createElement("button");

        editBtn.textContent = "Edit";

        // Create Delete button
        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";

        const buttonContainer = document.createElement("div");

buttonContainer.appendChild(editBtn);
buttonContainer.appendChild(deleteBtn);

listItem.appendChild(buttonContainer);


        // Complete / incomplete
       listItem.addEventListener("click", function() {

       task.completed = !task.completed; 

       localStorage.setItem("tasks", JSON.stringify(tasks));

       displayTasks();

      });

        // Edit task
      editBtn.addEventListener("click", function(event) {

      event.stopPropagation();

      taskInput.value = task.text;
 
      editingTask = task;

      addTaskBtn.textContent = "Update Task";

      cancelEditBtn.style.display = "inline-block";

      }); 

        // Delete task
        deleteBtn.addEventListener("click", function(event) {

            event.stopPropagation();

            const index = tasks.indexOf(task);

            tasks.splice(index, 1);

            localStorage.setItem("tasks", JSON.stringify(tasks));

            displayTasks();

        });


        taskList.appendChild(listItem);

    });

    // Update counter
    updateTaskCount();
}

// Filter buttons

allBtn.addEventListener("click", function() {
    currentFilter = "all";
    displayTasks();
    updateFilterButtons();
});

activeBtn.addEventListener("click", function() {
    currentFilter = "active";
    displayTasks();
    updateFilterButtons();
});

completedBtn.addEventListener("click", function() {
    currentFilter = "completed";
    displayTasks();
    updateFilterButtons();
});

clearCompletedBtn.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
});


// Update task counter
function updateTaskCount() {

    const remainingTasks = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    if (remainingTasks === 1) {
        taskCount.textContent = "1 task remaining";
    } else {
        taskCount.textContent = remainingTasks + " tasks remaining";
    }
}


// Add new task
addTaskBtn.addEventListener("click", function() {

    const task = taskInput.value;

    // Don't allow empty task
    if (task === "") {
        return;
    }
    if (editingTask !== null) {

    editingTask.text = task;

    editingTask = null;

    addTaskBtn.textContent = "Add Task";

    cancelEditBtn.style.display = "none";

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();

    taskInput.value = "";

    return;
}

    // Create new task
    const newTask = {
        text: task,
        completed: false
    };

    // Add task to array
    tasks.push(newTask);

    // Save tasks
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Display tasks
    displayTasks();

    // Clear input
    taskInput.value = "";

});


// Press Enter to add task
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTaskBtn.click();
    }

});


// Display saved tasks when page opens
displayTasks();

cancelEditBtn.addEventListener("click", function() {

    taskInput.value = "";

    editingTask = null;

    addTaskBtn.textContent = "Add Task";

    cancelEditBtn.style.display = "none";

});