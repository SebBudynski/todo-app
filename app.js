"use strict";

let todos = JSON.parse(localStorage.getItem("todos")) || [];
const input = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const template = document.querySelector("#todo-template");

function updateTodoList() {
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const newTodo = template.content.cloneNode(true);
    newTodo.querySelector("span").textContent = todo;
    newTodo.querySelector(".cross").addEventListener("click", function () {
      todos.splice(index, 1);
      localStorage.setItem("todos", JSON.stringify(todos));
      updateTodoList();
    });
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
    updateTodoList();
    input.value = "";
  });

// localStorage.clear();


