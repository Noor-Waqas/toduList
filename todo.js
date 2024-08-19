let todo = [];
let islocalPresent = localStorage.getItem("todolist");
if (islocalPresent !== null) {
  todo = JSON.parse(islocalPresent);
  console.log("Parsed Local Storage Data:", todo);
  display();
}

const addTask=()=> {
  if (!validateForm()) {
    return;
  }
  let task = document.getElementById("task").value;
  let date = document.getElementById("date").value;
  let urgent = document.getElementById("urgent").value;

  if (!validate(task, date, urgent)) {
    return;
  }
  let isEdit = document.getElementById("isEdit").value;

  if (isEdit === "1") {
    let editIndex = document.getElementById("editIndex").value;
    if (editIndex >= 0 && editIndex < todo.length) {
      todo[editIndex].task = task;
      todo[editIndex].date = date;
      todo[editIndex].urgent = urgent === "yes";
      todo[editIndex].complete = false;
    }
  } else {
    todo.push({
      task: task,
      date: date,
      urgent: urgent === "no",
      complete: false,
    });
  }
  localStorage.setItem("todolist", JSON.stringify(todo));
  document.getElementById("isEdit").value = "0";
  document.getElementById("editIndex").value = "";
  document.getElementById("task").value = "";
  document.getElementById("date").value = "";
  document.getElementById("urgent").value = "no";

  closeModal();

  display();
}

document.getElementById("tabelhead").style.display = "none";
document.getElementById("search_item").addEventListener("input", display);

// Initial display
display();

// Display the data
function display() {
  let tbody = document.getElementById("taskTableBody");

  tbody.innerHTML = "";

  let searchValue = document
    .getElementById("search_item")
    .value.toLowerCase();
  let hasMatchingData = false;

  for (let index = 0; index < todo.length; index++) {
    let todos = todo[index];
    if (
      todos.task.toLowerCase().indexOf(searchValue) !== -1 ||
      (todos.urgent ? "yes" : "no").toLowerCase().indexOf(searchValue) !==
        -1
    ) {
      const urgentcolr = Urgentcolr(todos);
      const editDisabled = todos.complete ? "disabled" : "";

      tbody.innerHTML += `
    <tr id="tr-${index}" ${urgentcolr}>
      <td>${todos.task}</td>
      <td>${todos.date}</td>
      <td>${todos.urgent ? "Yes" : "No"}</td>
      <td>
        <button id="edit-${index}" onclick="editTask(${index})" ${editDisabled}>Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
        <button id="complete-${index}" onclick="completeTask(${index})">Complete</button>
      </td>
    </tr>
  `;

      if (todos.complete) {
        document.getElementById(`tr-${index}`).style.backgroundColor =
          "green";
        document.getElementById(`tr-${index}`).style.color = "white";
      }

      hasMatchingData = true;
    }
  }

  if (hasMatchingData) {
  //   document.getElementById("nodataimg").style.display = "none";
    document.getElementById("tabelhead").style.display = "table";
  } else {
  //   document.getElementById("nodataimg").style.display = "inline";
    document.getElementById("tabelhead").style.display = "none";
  }
}

function Urgentcolr(tods) {
  return tods.urgent ? 'style="background:blue;color:white"' : "";
}

const closeModal=()=> {
  document.getElementById("myModal").classList.remove("show");
  document.getElementById("myModal").style.display = "none";
}

const editTask=(index)=> {
  if (index >= 0 && index < todo.length) {
    let task = todo[index].task;
    let date = todo[index].date;
    let urgent = todo[index].urgent ? "yes" : "no";

    document.getElementById("task").value = task;
    document.getElementById("date").value = date;
    document.getElementById("urgent").value = urgent;

    document.getElementById("isEdit").value = "1";
    document.getElementById("editIndex").value = index;

    $("#myModal").modal("show");
  } else {
    console.error("Invalid index for editing task");
  }
}

const deleteTask=(index)=> {
  document.getElementById("confirmModal").classList.add("show");
  document.getElementById("confirmModal").style.display = "block";

  document.getElementById("confirmDelete").onclick = function () {
    todo.splice(index, 1);
    localStorage.setItem("todolist", JSON.stringify(todo));
    confirmDeleteTask();

    display();
  };
}

const closeConfirmModal=()=> {
  document.getElementById("confirmModal").classList.remove("show");
  document.getElementById("confirmModal").style.display = "none";
}

const confirmDeleteTask=()=> {
  console.log("Task Delete successfully");

  closeConfirmModal();
}

const completeTask=(index)=> {
  if (index >= 0 && index < todo.length && !todo[index].complete) {
    todo[index].complete = true;
    document.getElementById(`edit-${index}`).disabled = true;
    document.getElementById(`tr-${index}`).style.backgroundColor =
      "green";
    document.getElementById(`tr-${index}`).style.color = "white";
    if (todo[index].complete) {
      localStorage.setItem("todolist", JSON.stringify(todo));
    }
    display();
  }
}

const validate=(task, date, urgent)=> {
  task = task.toLowerCase();

  let taskExists = todo.some(
    (item) =>
      item.task.toLowerCase() === task &&
      item.date === date &&
      item.urgent === (urgent === "yes")
  );

  if (taskExists) {
    alert("This task already exists.");
    return false;
  }

  return true;
}

const validateForm=()=> {
  let task = document.getElementById("task").value;
  let date = document.getElementById("date").value;
  let urgent = document.getElementById("urgent").value;

  if (!task || !date) {
    alert("Task and Date are required fields.");
    return false;
  }

  if (!validate(task, date, urgent)) {
    return false;
  }

  return true;
}
