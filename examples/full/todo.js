var uuid = require("uuid")

var render = require("../../render")
var Signal = require("../../signal")
var Input = require("../../input")
var Element = require("../../element")

var InputPool = Input.InputPool

var inspect = Signal.inspect
var transform = Signal.transform
var transformMany = Signal.transformMany
var foldp = Signal.foldp

var h = Element.h

// Application Model
var TodoModel = {
    id: "",
    title: "",
    completed: false
}

var TodosModel = {
    todos: []
}

// Inputs
var newTodoPool = InputPool("new-todo")
var newTodo = newTodoPool.signal
inspect(newTodo) // =>

var input = transformMany([newTodo], function (newTodo) {
    return { newTodo: newTodo }
})

// State operations
function addTodo(state, newTodo) {
    var todos = state.todos

    var contains = todos.some(function (t) { return t.id === newTodo.id })

    if (!contains)  {
        todos = todos.concat(newTodo)
    }

    return { todos: todos }
}

// Updating the current state
var todosState = foldp(input, function update(state, inputState) {

    return addTodo(state, inputState.newTodo)
}, TodosModel)
inspect(todosState) // =>

// Displaying the scene
function mainSection(todos) {
    var newTodoInput = h("input#new-todo", {
        placeholder: "What needs to be done?"
        , autofocus: true
    })

    newTodoInput = newTodoPool.input(newTodoInput, "submit", function (value) {
        return { id: uuid(), title: value, completed: false }
    })

    // TODO: Wire up toggle-all
    // TODO: put stats-template in footer
    return h("section#todoapp", [
        h("header#header", [
            h("h1", "todos"),
            newTodoInput
        ]),
        h("section#main", [
            h("input#toggle-all", { type: "checkbox" }),
            h("label", { "for": "toggle-all" }, "Mark all as complete"),
            h("ul#todo-list", todos)
        ]),
        h("footer#footer")
    ])
}

function infoFooter() {
    return h("footer#info", [
        h("p", "Double-click to edit a todo"),
        h("p", [
            "Written by ",
            h("a", { href: "https://github.com/Raynos" }, "Raynos")
        ]),
        h("p", [
            "Part of ",
            h("a", { href: "http://todomvc.com" }, "TodoMVC")
        ])
    ])
}

function todoItem(todo)  {
    // TODO: wire up destroy
    // TODO: wire up double click UI bullshit
    // TODO: wire up editing blur / etc.
    return h("div", [
        h("div.view", [
            h("input.toggle", { type: "checkbox", checked: todo.checked }),
            h("label", todo.title),
            h("button.destroy")
        ]),
        h("input.edit", { value: todo.title })
    ])
}

var main = transform(todosState, function display(state) {
    var todos = state.todos

    var todoEls = todos.map(todoItem)

    return h("div", [
        mainSection(todoEls),
        infoFooter()
    ])
})

// Render scene
render(main, false)
// =>
