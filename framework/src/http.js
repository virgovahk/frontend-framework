export function createHttp(baseURL = "") {
  async function request(method, url, body = null) {
    const options = {
      method,
      headers: { "Content-Type": "application/json" }
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(baseURL + url, options)

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    return response.json()
  }

  return {
    get(url)        { return request("GET", url) },
    post(url, body) { return request("POST", url, body) },
    put(url, body)  { return request("PUT", url, body) },
    delete(url)     { return request("DELETE", url) }
  }
}

export const http = createHttp("https://jsonplaceholder.typicode.com")