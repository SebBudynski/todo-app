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
    newTodo.querySelector("span").textContent = todo.text;
    if (todo.done) {
      newTodo.querySelector(".todo-text").classList.add("line-through");
    }
    newTodo.querySelector(".cross").addEventListener("click", function () {
      todos.splice(index, 1);
      localStorage.setItem("todos", JSON.stringify(todos));
      updateTodoList();
    });
    const li = newTodo.querySelector("li");
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
