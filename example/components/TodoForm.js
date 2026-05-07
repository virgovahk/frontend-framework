import { Component, createElement } from "../../framework/index.js"

export default class TodoForm extends Component {
  render() {
    const { onAdd } = this.props
    let inputValue = ""

    return createElement("form", {
      className: "todo-form",
      onSubmit: (e) => {
        e.preventDefault()
        if (!inputValue.trim()) return
        onAdd(inputValue.trim())
        inputValue = ""
        e.target.querySelector('input').value = ""
        this._update()
      }
    },
      createElement("input", {
        type: "text",
        placeholder: "Add a new todo...",
        className: "todo-input",
        onInput: (e) => {
          inputValue = e.target.value
        }
      }),
      createElement("button", {
        type: "submit",
        className: "todo-btn"
      }, "Add")
    )
  }
}