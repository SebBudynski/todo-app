"use strict";

// Configuration
const config = {
  selectors: {
    input: "#todo-input",
    todoList: ".todo-list",
    template: "#todo-template",
    todoForm: "#todo-form",
    switchBtn: ".switch-mode",
    itemsLeft: ".items-left",
    bottomBar: ".bottom-bar",
    item: ".item",
  },
  classes: {
    check: "check",
    lineThrough: "line-through",
    brightMode: "bright-mode",
  },
};

// DOM elements initialization
const elements = Object.fromEntries(
  Object.entries(config.selectors).map(([key, selector]) => [
    key,
    document.querySelector(selector),
  ])
);

// Todos initialization
let todos = (() => {
  try {
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    return storedTodos && storedTodos.length > 0
      ? storedTodos
      : [
          { text: "Example task 1", done: false },
          { text: "Example task 2", done: true },
          { text: "Example task 3", done: false },
        ];
  } catch (error) {
    console.error("Error parsing todos from localStorage:", error);
    return [];
  }
})();

// Todo-related functions
const todoFunctions = {
  updateCounter: () => {
    const undoneTodo = document.querySelectorAll(
      `.status:not(.${config.classes.check})`
    );
    elements.itemsLeft.innerText = `${undoneTodo.length} items left`;
  },

  createElement: (todo, index) => {
    const newTodo = elements.template.content.cloneNode(true);
    const li = newTodo.querySelector("li");
    li.querySelector("span").textContent = todo.text;

    todoFunctions.setupDragAndDrop(li, index);
    todoFunctions.setupStatus(li, todo);
    todoFunctions.setupDeleteButton(li, index);
    todoFunctions.setupToggleCompletion(li, todo);
    todoFunctions.setupHoverEffect(li);

    return li;
  },

  setupDragAndDrop: (li, index) => {
    li.addEventListener("dragstart", (event) =>
      event.dataTransfer.setData("text/plain", index)
    );
    li.addEventListener("dragover", (event) => event.preventDefault());
    li.addEventListener("drop", todoFunctions.handleDrop);
  },

  handleDrop: (event) => {
    event.preventDefault();
    const draggedIndex = parseInt(event.dataTransfer.getData("text/plain"));
    const droppedIndex = Array.from(elements.todoList.children).indexOf(
      event.target.closest("li")
    );
    [todos[draggedIndex], todos[droppedIndex]] = [
      todos[droppedIndex],
      todos[draggedIndex],
    ];
    todoFunctions.updateList();
    todoFunctions.save();
  },

  setupStatus: (li, todo) => {
    if (todo.done) {
      li.querySelector(".todo-text").classList.add(config.classes.lineThrough);
      li.querySelector(".status").classList.add(config.classes.check);
    }
  },

  setupDeleteButton: (li, index) => {
    li.querySelector(".cross").addEventListener("click", () => {
      todos.splice(index, 1);
      todoFunctions.save();
      li.remove();
      todoFunctions.updateCounter();
    });
  },

  setupToggleCompletion: (li, todo) => {
    li.addEventListener("click", () => {
      if (typeof todo === "object" && todo !== null) {
        todo.done = !todo.done;
        todoFunctions.save();
        todoFunctions.updateList();
      }
    });
  },

  setupHoverEffect: (li) => {
    const cross = li.querySelector(".cross");
    li.addEventListener(
      "mouseover",
      () => (cross.style.visibility = "visible")
    );
    li.addEventListener("mouseout", () => (cross.style.visibility = "hidden"));
  },

  save: () => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos to localStorage:", error);
    }
  },

  updateList: () => {
    elements.todoList.innerHTML = "";
    todos.forEach((todo, index) => {
      const todoElement = todoFunctions.createElement(todo, index);
      elements.todoList.appendChild(todoElement);
    });
    todoFunctions.updateCounter();
  },

  add: (event) => {
    event.preventDefault();
      todos.push({ text: elements.input.value, done: false });
      todoFunctions.save();
      todoFunctions.updateList();
      elements.input.value = "";
  },

  filter: (filterType) => {
    document.querySelectorAll(".status").forEach((element) => {
      const shouldDisplay =
        filterType === "all" ||
        (filterType === "active" &&
          !element.classList.contains(config.classes.check)) ||
        (filterType === "completed" &&
          element.classList.contains(config.classes.check));
      element.parentNode.style.display = shouldDisplay ? "flex" : "none";
    });
  },

  clearCompleted: () => {
    document
      .querySelectorAll(`.status.${config.classes.check}`)
      .forEach((completed) => {
        completed.parentNode.remove();
      });
    todos = todos.filter((todo) => !todo.done);
    todoFunctions.save();
    todoFunctions.updateList();
  },
};

// Bright mode related functions
const brightModeFunctions = {
  toggle: () => {
    [
      elements.switchBtn,
      document.body,
      elements.todoList,
      elements.item,
      elements.bottomBar,
    ].forEach((el) => el.classList.toggle(config.classes.brightMode));
    localStorage.setItem(
      "bright-mode",
      document.body.classList.contains(config.classes.brightMode)
    );
  },

  init: () => {
    if (localStorage.getItem("bright-mode") === "true") {
      brightModeFunctions.toggle();
    }
  },
};

// Event listeners
elements.todoForm.addEventListener("submit", todoFunctions.add);
elements.switchBtn.addEventListener("click", brightModeFunctions.toggle);

// Event delegation for filter and clear buttons
document.querySelector(".bottom-bar").addEventListener("click", (event) => {
  if (event.target.classList.contains("completed"))
    todoFunctions.filter("completed");
  if (event.target.classList.contains("active")) todoFunctions.filter("active");
  if (event.target.classList.contains("all")) todoFunctions.filter("all");
  if (event.target.classList.contains("clear-completed"))
    todoFunctions.clearCompleted();
});

// Initialization
todoFunctions.updateList();
brightModeFunctions.init();