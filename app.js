"use strict";

const input = document.querySelector("#todo-input");
const todoList = document.querySelector(".todo-list");
const template = document.querySelector("#todo-template");
const todoForm = document.querySelector("#todo-form");
const switchBtn = document.querySelector(".switch-mode");
let todos = JSON.parse(localStorage.getItem("todos"));
if (!todos || todos.length === 0) {
  todos = [
    { text: "Example task 1", done: false },
    { text: "Example task 2", done: true },
    { text: "Example task 3", done: false },
  ];
}

// Updating undone todos counter
function undoneTodo() {
  const undoneTodo = document.querySelectorAll(".status:not(.check)");
  document.querySelector(
    ".items-left"
  ).innerText = `${undoneTodo.length} items left`;
}

function showCompletedTodos() {
  document.querySelectorAll(".status:not(.check)").forEach((statusElement) => {
    statusElement.parentNode.style.display = "none";
  });
  document.querySelectorAll(".status.check").forEach((Element) => {
    Element.parentNode.style.display = "flex";
  });
}

function showActiveTodos() {
  document.querySelectorAll(".status:not(.check)").forEach((statusElement) => {
    statusElement.parentNode.style.display = "flex";
  });
  document.querySelectorAll(".status.check").forEach((activeElement) => {
    activeElement.parentNode.style.display = "none";
  });
}

function showAllTodos() {
  document.querySelectorAll(".status").forEach((active) => {
    active.parentNode.style.display = "flex";
  });
}

function clearCompleted() {
  document.querySelectorAll(".status.check").forEach((completed) => {
    completed.parentNode.remove();
    todos = todos.filter((todo) => !todo.done);
    localStorage.setItem("todos", JSON.stringify(todos));
  });
}

document
  .querySelector(".completed")
  .addEventListener("click", showCompletedTodos);
document.querySelector(".active").addEventListener("click", showActiveTodos);
document.querySelector(".all").addEventListener("click", showAllTodos);
document
  .querySelector(".clear-completed")
  .addEventListener("click", clearCompleted);

function updateTodoList() {
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const newTodo = template.content.cloneNode(true);
    newTodo.querySelector("span").textContent = todo.text;
    const li = newTodo.querySelector("li");
    if (todo.done) {
      newTodo.querySelector(".todo-text").classList.add("line-through");
      newTodo.querySelector(".status").classList.add("check");
      undoneTodo();
    }
    newTodo.querySelector(".cross").addEventListener("click", function () {
      todos.splice(index, 1);
      localStorage.setItem("todos", JSON.stringify(todos));
      li.remove();
      undoneTodo();
    });
    li.addEventListener("click", () => {
      if (typeof todo === "object" && todo !== null) {
        todo.done = !todo.done;
        localStorage.setItem("todos", JSON.stringify(todos));
        updateTodoList();
        li.querySelector(".todo-text").classList.toggle("line-through");
        li.querySelector(".status").classList.toggle("check");
      }
    });
    li.addEventListener("mouseover", () => {
      li.querySelector(".cross").style.visibility = "visible";
    });
    li.addEventListener("mouseout", () => {
      li.querySelector(".cross").style.visibility = "hidden";
    });
    todoList.appendChild(newTodo);
  });
  undoneTodo();
}

updateTodoList();
undoneTodo();

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (input.value.trim() !== "") {
    todos.push({ text: input.value, done: false });
    localStorage.setItem("todos", JSON.stringify(todos));
    updateTodoList();
    input.value = "";
  }
});

function brightMode() {
  switchBtn.classList.toggle("bright-mode");
  document.querySelector("body").classList.toggle("bright-mode");
  document.querySelector(".todo-list").classList.toggle("bright-mode");
  document.querySelector(".item").classList.toggle("bright-mode");
  document.querySelector(".bottom-bar").classList.toggle("bright-mode");
  let isBrightMode = document.body.classList.contains("bright-mode");
  localStorage.setItem("bright-mode", isBrightMode);
}

switchBtn.addEventListener("click", brightMode);

window.onload = () => {
  if (localStorage.getItem("bright-mode") === "true") {
    brightMode();
  }
};
