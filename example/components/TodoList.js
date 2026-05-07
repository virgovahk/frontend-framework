import { Component, createElement, lazyList, delegate } from "../../framework/index.js";
import TodoItem from "./TodoItem.js";

export default class TodoList extends Component {
  render() {
    const { todos, onToggle, onDelete } = this.props;

    if (todos.length === 0) {
      return createElement("p", { className: "empty" }, "No todos yet!");
    }

    return lazyList(todos, (todo) => {
      const item = new TodoItem({ todo, onToggle, onDelete });
      return item.render();
    });
  }
}
