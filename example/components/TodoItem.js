import { Component, createElement } from "../../framework/index.js"

export default class TodoItem extends Component {
  render() {
    const { todo, onToggle, onDelete  } = this.props

    return createElement("li", { className: "todo-item" },
      createElement("input", {
        type: "checkbox",
        checked: todo.completed,
        onChange: () => onToggle(todo.id)
      }),
      createElement("span", {
        className: todo.completed ? "todo-text completed" : "todo-text"
      }, todo.title),
      createElement("button", {
        className: "delete-btn",
        onClick: () => onDelete(todo.id)
      }, "Delete")
    )
  }
}