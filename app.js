"use strict";

let todos = JSON.parse(localStorage.getItem("todos")) || [];
const input = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const template = document.querySelector("#todo-template");

function updateTodoList() {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const newTodo = template.content.cloneNode(true);
    newTodo.querySelector("span").textContent = todo;
    todoList.appendChild(newTodo);
  });
}

updateTodoList();

document
  .querySelector("#todo-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    todos.push(input.value);
    localStorage.setItem("todos", JSON.stringify(todos));
    const newTodo = template.content.cloneNode(true);
    newTodo.querySelector("span").textContent = input.value;
    todoList.appendChild(newTodo);
    input.value = "";
  });

// localStorage.clear();
