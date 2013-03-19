var uuid = require("uuid")
var extend = require("xtend")

var render = require("../../render")
var Signal = require("../../signal")
var Input = require("../../input")
var Element = require("../../element")

var InputPool = Input.InputPool

var inspect = Signal.inspect
var transform = Signal.transform
var combineEvents = Signal.combineEvents
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
var toggleAllPool = InputPool("toggle-all")
var todoTogglePool = InputPool("todo-toggle")

var input = combineEvents({
    newTodo: newTodoPool.signal,
    toggleAll: toggleAllPool.signal,
    todoToggle: todoTogglePool.signal
})
inspect(input) // =>

// State operations
function addTodo(state, newTodo) {
    return { todos: state.todos.concat(newTodo) }
}

function toggleAll(state, toggled) {
    return { todos: state.todos.map(function (todo) {
        return { id: todo.id, title: todo.title, completed: toggled }
    }) }
}

function todoToggle(state, change) {
    return { todos: state.todos.map(function (todo) {
        if (change.id !== todo.id) {
            return todo
        } else {
            return extend(todo, { completed: change.completed })
        }
    }) }
}

// Updating the current state
var todosState = foldp(input, function update(state, inputState) {
    var newState = state

    if ("newTodo" in inputState) {
        newState = addTodo(newState, inputState.newTodo)
    }

    if ("toggleAll" in inputState) {
        newState = toggleAll(newState, inputState.toggleAll)
    }

    if ("todoToggle" in inputState) {
        newState = todoToggle(newState, inputState.todoToggle)
    }

    return newState
}, TodosModel)
inspect(todosState) // =>

// Displaying the scene
function mainSection(todos) {
    var newTodoInput = newTodoPool.submit(h("input.new-todo", {
        placeholder: "What needs to be done?"
        , autofocus: true
    }), function (value) {
        return { id: uuid(), title: value, completed: false }
    })

    var toggleAll = toggleAllPool.change(h("input#toggle-all.toggle-all", {
        type: "checkbox",
        checked: todos.every(function (todo) {
            return todo.completed
        })
    }), function (checked) {
        return checked
    })

    // TODO: put stats-template in footer
    return h("section.todoapp", [
        h("header.header", [
            h("h1", "todos"),
            newTodoInput
        ]),
        h("section.main", {
            hidden: todos.length === 0
        }, [
            toggleAll,
            h("label", { htmlFor: "toggle-all" }, "Mark all as complete"),
            h("ul.todo-list", todos.map(todoItem))
        ]),
        h("footer.footer", {
            hidden: todos.length === 0
        })
    ])
}

function infoFooter() {
    return h("footer.info", [
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

function todoItem(todo) {
    var todoToggle = todoTogglePool.change(h("input.toggle", {
        type: "checkbox", checked: todo.completed
    }), function (checked) {
        return { id: todo.id, completed: checked }
    })

    // TODO: wire up destroy
    // TODO: wire up double click UI bullshit
    // TODO: wire up editing blur / etc.
    return h("li", [
        h("div.view", [
            todoToggle,
            h("label", todo.title),
            h("button.destroy")
        ]),
        h("input.edit", { value: todo.title })
    ])
}

var main = transform(todosState, function display(state) {
    var todos = state.todos

    return h("div.todomvc-wrapper", [
        mainSection(todos),
        infoFooter()
    ])
})

// Render scene
render(main, false)
// =>
