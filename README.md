# dot.js — Minimal Frontend Framework

A lightweight, convention-based frontend framework built without any external dependencies. dot.js gives you a component model, reactive state, client-side routing, event utilities, lazy loading, and an HTTP client.

---

## Architecture & Design Principles

dot.js is structured around five independent modules that compose together:
```
framework/
├── src/
│   ├── core.js       — virtual DOM: createElement, render, mount
│   ├── component.js  — base Component class
│   ├── state.js      — global state store + localStorage
│   ├── router.js     — hash-based SPA router
│   ├── events.js     — event delegation and browser-behaviour utilities
│   ├── http.js       — fetch-based HTTP client
│   └── lazy.js       — IntersectionObserver-based lazy rendering
└── index.js          — single public entry point
```

**Design decisions:**

- **Framework convention, not a library.** dot-js controls the application flow. You define components and routes; the framework decides when and how to render them.
- **Component-based.** All UI is built from reusable Component classes with a `render()` method that returns a virtual node tree.
- **No dependencies.** Zero external libraries or frameworks used anywhere.

---

## Installation

No build tools or package managers required.

1. Clone the repository

2. Serve the project with a local HTTP server:

Option A — Live Server:
- Install the Live Server extension
- Right click `example/index.html` → Open with Live Server

Option B — Node:
```
npx serve .
```

Then open `http://localhost:3000/example/#` in your browser.

> **Note:** You cannot open `index.html` by double-clicking it. ES modules require an HTTP server.

---

## Getting Started

**1. Create an HTML entry point**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="app.js"></script>
</body>
</html>
```

**2. Create your first component**
```js
// Counter.js
import { Component, createElement } from "../framework/index.js"

export default class Counter extends Component {
  render() {
    const { count, onIncrement } = this.props
    return createElement("div", {},
      createElement("p", {}, `Count: ${count}`),
      createElement("button", { onClick: onIncrement }, "+1")
    )
  }
}
```

**3. Bootstrap the app**
```js
// app.js
import { createStore, createRouter } from "../framework/index.js"
import HomePage from "./pages/HomePage.js"
import NotFoundPage from "./pages/NotFoundPage.js"

export const store = createStore({ count: 0 })

const router = createRouter({
  "/": HomePage,
  "/404": NotFoundPage
})

router.start()
```

---

## Features

### 1. createElement — building the UI tree

`createElement(tag, props, ...children)` creates a virtual node describing an element. Props become attributes, event handlers, styles, or class names on the real DOM element.
```js
import { createElement } from "../framework/index.js"

// Plain element
createElement("h1", { className: "title" }, "Hello World")

// Nested elements
createElement("ul", { className: "list" },
  createElement("li", {}, "Item 1"),
  createElement("li", {}, "Item 2")
)

// Styles as an object
createElement("div", { style: { color: "red", fontWeight: "bold" } }, "Warning")
```

Special prop names:

| Prop | Effect |
|------|--------|
| `className` | Sets `element.className` |
| `style` | Merges an object into `element.style` |
| `htmlFor` | Sets the `for` attribute (for `<label>`) |
| `on<Event>` | Registered at render time as a declarative event handler |
| Any boolean | `setAttribute(key, "")` when true, `removeAttribute` when false |
| Everything else | `setAttribute(key, value)` |

---

### 2. Component Architecture

Extend the `Component` base class to create reusable UI components. Every component must implement a `render()` method that returns a virtual node.
```js
import { Component, createElement } from "../framework/index.js"

class Greeting extends Component {
  render() {
    return createElement("h1", {}, `Hello, ${this.props.name}!`)
  }
}

// Use inside another component's render():
const greeting = new Greeting({ name: "World" })
greeting.render() // returns a vnode
```

**Component API:**
- `this.props` — data passed in from the parent
- `this.render()` — must be overridden, returns a vnode
- `this.mount(container)` — mounts the component into a DOM element
- `this._update()` — re-renders the component into its container (called automatically on state change)
- `this.setState(newProps)` — updates local props and triggers re-render

---

### 3. State Management

Create a global store with `createStore(initialState)`. All components share this single store. State is automatically persisted to `localStorage` on every change and restored on page load.
```js
import { createStore } from "../framework/index.js"

const store = createStore({
  todos: [],
  filter: "all"
})

// Read state
const todos = store.get("todos")

// Update state (triggers re-render + saves to localStorage)
store.set("todos", [...todos, { id: 1, title: "Buy milk", completed: false }])

// Subscribe a component to state changes
store.subscribe(myComponent)

// Unsubscribe when component is destroyed
store.unsubscribe(myComponent)
```

**State is shared between all components and pages.** Any component that calls `store.subscribe(this)` will have its `_update()` method called whenever any state changes, causing it to re-render with the latest data.

**Persistence:** On every `store.set()` call, the entire state is saved to `localStorage` under the key `dotjs_state`. On startup, `createStore()` checks `localStorage` first — so state survives page refreshes.

---

### 4. Routing

dot-js uses hash-based routing. The URL never causes a page reload — only the hash changes (e.g. `/#/todos`). The router reads the hash, finds the matching page component, and mounts it into `#app`.
```js
import { createRouter } from "../framework/index.js"
import TodosPage from "./pages/TodosPage.js"
import NotFoundPage from "./pages/NotFoundPage.js"

const router = createRouter({
  "/":      TodosPage,
  "/todos": TodosPage,
  "/404":   NotFoundPage
})

router.start()
```

**Programmatic navigation:**
```js
router.navigate("/todos") // changes URL and renders the new page
```

**How it works:**
- `router.start()` listens for `hashchange` events and renders the correct page
- When the hash changes, the old page is unmounted and the new page is mounted
- If the route is not found, the `/404` page is shown
- The application state changes based on the URL — different routes render different components with different data

---

### 5. Event Handling

Events are registered declaratively as props when elements are created. dot-js does not simply re-implement `addEventListener` — instead, event handling is built into the rendering system via `applyProps`.
```js
createElement("button", {
  onClick: () => console.log("clicked!")
}, "Click me")

createElement("form", {
  onSubmit: (e) => {
    e.preventDefault() // prevent default browser behavior
    console.log("submitted!")
  }
}, ...)

createElement("input", {
  onInput: (e) => {
    console.log(e.target.value)
  }
})
```

**Supported event props:** `onClick`, `onSubmit`, `onInput`, `onChange`, `onKeyDown`, `onKeyUp`, and any other DOM event prefixed with `on`.

**Preventing default behavior and bubbling:**
```js
createElement("a", {
  onClick: (e) => {
    e.preventDefault()      // stops browser navigation
    e.stopPropagation()     // stops event bubbling to parent
    router.navigate("/todos")
  }
}, "Go to Todos")
```

**Event delegation** allows a single listener on a parent element to handle events from all its children. Use the `delegate` utility from `events.js`:
```js
import { delegate } from "../framework/index.js"

// One listener on the container handles clicks on all child elements
const cleanup = delegate(container, 'click', '.todo-item', (e, target) => {
  console.log('Todo clicked:', target)
})

// Remove the listener when no longer needed
cleanup()
```

This is more efficient than adding individual listeners to each child element. The `delegate` function uses event bubbling, clicks on children bubble up to the parent, where they are caught and matched against the selector.

---

### 6. HTTP Requests

The `http` module wraps the browser's `fetch` API with clean, promise-based methods. All requests send and receive JSON by default.
```js
import { http } from "../framework/index.js"

// GET
const todos = await http.get("/todos?_limit=10")

// POST
const newTodo = await http.post("/todos", { title: "Buy milk", completed: false })

// PUT
const updated = await http.put("/todos/1", { completed: true })

// DELETE
await http.delete("/todos/1")
```

The base URL is set to `https://jsonplaceholder.typicode.com` for the example app. All methods return Promises and throw an error if the response status is not ok.

**Sharing HTTP data with the application:**
```js
http.get("/todos?_limit=10").then(todos => {
  store.set("todos", todos) // data flows into global state
  // all subscribed components re-render automatically
})
```

---

### 7. Performance — Lazy Rendering

dot-js implements lazy rendering for long lists using `IntersectionObserver`. Instead of rendering all list items into the DOM at once, only items visible in the viewport are rendered. As the user scrolls, more items are rendered on demand.

This is implemented in `lazy.js` and used by `TodoList` for all lists regardless of size.

- **Without lazy rendering:** 1000 todo items = 1000 DOM nodes created immediately on render
- **With lazy rendering:** 1000 todo items = ~20 DOM nodes created initially, rest added as user scrolls

This significantly reduces initial render time and memory usage for large lists.

---

## Best Practices

**1. Create the store once and export it**
```js
// app.js
export const store = createStore({ todos: [], filter: "all" })
```
Import it wherever you need it — never create multiple stores.

---

**2. Always unsubscribe when a page unmounts**
```js
unmount() {
  store.unsubscribe(this)
}
```
Without this, destroyed components will still receive `_update()` calls — causing memory leaks and errors.

---

**3. Never mutate state directly**
```js
// wrong
store.get("todos").push(newTodo)

// correct
store.set("todos", [...store.get("todos"), newTodo])
```
Always use `store.set()` so localStorage saves and subscribers are notified.

---

**4. Keep render() pure**

`render()` should only read from `this.props` and `store.get()`. Never call `store.set()` inside `render()` — this causes infinite re-render loops.

---

**5. Delegate events upward**

Pass handler functions down as props instead of putting logic inside leaf components. This keeps components reusable and logic centralized.

---

**6. Use className, not class**
```js
// correct
createElement("div", { className: "container" })

// wrong
createElement("div", { class: "container" })
```

---

**7. Keep components small and focused**

Each component should do one thing. `TodoItem` renders one todo. `TodoForm` handles input. `TodoList` renders the list. Compose them together in the page component.