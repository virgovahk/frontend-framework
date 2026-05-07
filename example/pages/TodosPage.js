import { Component, createElement, http, delegate } from "../../framework/index.js"
import { store } from "../app.js"
import TodoForm from "../components/TodoForm.js"
import TodoList from "../components/TodoList.js"

export default class TodosPage extends Component {
  mount(container) {
    this._container = container
    store.subscribe(this)

    const hash = window.location.hash
    if (hash.includes("filter=active")) store.set("filter", "active")
    else if (hash.includes("filter=completed")) store.set("filter", "completed")
    else store.set("filter", "all")

    delegate(container, 'click', '.todo-item', () => {
      console.log('Todo item klikitud!')
    })

    const existing = store.get("todos")
    if (!existing || existing.length === 0) {
      http.get("/todos?_limit=10").then(todos => {
        store.set("todos", todos)
      })
    }

    this._update()
  }

  unmount() {
    store.unsubscribe(this)
  }

  handleAdd(title) {
    const todos = store.get("todos") || []
    const newTodo = { id: Date.now(), title, completed: false }
    store.set("todos", [...todos, newTodo])
  }

  handleToggle(id) {
    const todos = store.get("todos") || []
    store.set("todos", todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  handleDelete(id) {
    const todos = store.get("todos") || []
    store.set("todos", todos.filter(t => t.id !== id))
  }

  render() {
    const todos = store.get("todos") || []
    const filter = store.get("filter") || "all"

    const filtered = todos.filter(t => {
      if (filter === "active") return !t.completed
      if (filter === "completed") return t.completed
      return true
    })

    const todoForm = new TodoForm({ onAdd: (title) => this.handleAdd(title) })
    const todoList = new TodoList({
      todos: filtered,
      onToggle: (id) => this.handleToggle(id),
      onDelete: (id) => this.handleDelete(id)
    })

    return createElement("div", { className: "page" },
      createElement("div", { className: "container" },
        createElement("h1", {}, "Todos"),
        createElement("div", { className: "filters" },
          createElement("button", {
            className: filter === "all" ? "active" : "",
            onClick: () => window.location.hash = "/todos"
          }, "All"),
          createElement("button", {
            className: filter === "active" ? "active" : "",
            onClick: () => window.location.hash = "/todos?filter=active"
          }, "Active"),
          createElement("button", {
            className: filter === "completed" ? "active" : "",
            onClick: () => window.location.hash = "/todos?filter=completed"
          }, "Completed")
        ),
        todoForm.render(),
        todoList.render(),
        createElement("p", { className: "stats" },
          `${todos.filter(t => !t.completed).length} items left`
        )
      )
    )
  }
}