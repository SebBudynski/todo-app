"use strict";

let todos = JSON.parse(localStorage.getItem("todos")) || [];
const input = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const template = document.querySelector("#todo-template");
const todoForm = document.querySelector("#todo-form");

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
    const li = newTodo.querySelector("li");
    li.addEventListener("click", () => {
      li.querySelector(".todo-text").classList.toggle("line-through");
      li.querySelector(".status").classList.toggle("check")
    });
    todoList.appendChild(newTodo);
  });
}

updateTodoList();

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  todos.push(input.value);
  localStorage.setItem("todos", JSON.stringify(todos));
  updateTodoList();
  input.value = "";
});
