import { Component, createElement } from "../../framework/index.js"

export default class NotFoundPage extends Component {
    render() {
        return createElement("div", { className: "not-found-page"},
            createElement("h1", {}, "404"),
            createElement("p", {}, "Page not found"),
            createElement("button", { 
                onClick: () => window.location.hash = "/"
            }, "Go Back Home")
        )
    }


    
}