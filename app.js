"use strict";

const input = document.querySelector("#todo-input");
const todoList = document.querySelector(".todo-list");
const template = document.querySelector("#todo-template");
const todoForm = document.querySelector("#todo-form");
const switchBtn = document.querySelector(".switch");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

function updateTodoList() {
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const newTodo = template.content.cloneNode(true);
    newTodo.querySelector("span").textContent = todo.text;
    const li = newTodo.querySelector("li");
    if (todo.done) {
      newTodo.querySelector(".todo-text").classList.add("line-through");
      newTodo.querySelector(".status").classList.add("check");
    }
    newTodo.querySelector(".cross").addEventListener("click", function () {
      todos.splice(index, 1);
      localStorage.setItem("todos", JSON.stringify(todos));
      li.remove();
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
    todoList.appendChild(newTodo);
  });
}

updateTodoList();

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
  let isBrightMode = document.body.classList.contains("bright-mode");
  localStorage.setItem("bright-mode", isBrightMode);
}

switchBtn.addEventListener("click", brightMode);

window.onload = () => {
  if (localStorage.getItem("bright-mode") === "true") {
    brightMode();
  }
};
