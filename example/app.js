import TodosPage from "./pages/TodosPage.js"
import NotFoundPage from "./pages/NotFoundPage.js"
import { createStore, createRouter } from "../framework/index.js";

export const store = createStore({
  todos: [],
  filter: "all"
})

const hash = window.location.hash
if (hash.includes("filter=active")) store.set("filter", "active")
if (hash.includes("filter=completed")) store.set("filter", "completed")

const router = createRouter({
  "/": TodosPage,
  "/todos": TodosPage,
  "/404": NotFoundPage
});

router.start();