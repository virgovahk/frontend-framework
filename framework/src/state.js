export function createStore(initialState = {}) {
  const STORAGE_KEY = "dotjs_state"

  // try to load saved state from localStorage, or use initialState if not found
  const saved = localStorage.getItem(STORAGE_KEY)
  let state = saved ? JSON.parse(saved) : { ...initialState }

  const _subscribers = []

  return {
    get(key) {
      return state[key]
    },

    set(key, value) {
      return this.setState(key, value)
    },

    setState(key, value) {
      state = { ...state, [key]: value }
      // save updated state to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      // notify components to re-render
      _subscribers.forEach(sub => sub._update())
    },

    subscribe(component) {
      _subscribers.push(component)
    },

    unsubscribe(component) {
      const index = _subscribers.indexOf(component)
      if (index > -1) _subscribers.splice(index, 1)
    },

    getAll() {
      return { ...state }
    }
  }
}