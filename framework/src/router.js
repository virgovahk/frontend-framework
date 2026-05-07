export function createRouter(routes = {}) {
  let currentPage = null
  const appContainer = document.getElementById("app")

  function getHash() {
    return (window.location.hash.slice(1) || "/").split("?")[0];
}

  function resolve() {
    const path = getHash()
    const Page = routes[path] || routes["/404"]

    if (currentPage && currentPage.unmount) {
      currentPage.unmount()
    }

    // clear the container
    appContainer.innerHTML = ""

    // mount new page
    currentPage = new Page()
    currentPage.mount(appContainer)
  }

  return {
    navigate(path) {
      window.location.hash = path
    },

    start() {
      window.addEventListener("hashchange", resolve)
      resolve()
    }
  }
}