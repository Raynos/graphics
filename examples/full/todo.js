var uuid = require("uuid")
var extend = require("xtend")
var localStorage = require("global/window").localStorage

var Signal = require("../../signal")
var Input = require("../../input")
var h = require("../../element").h
var render = require("../../render")

var inspect = Signal.inspect
var merge = Signal.merge
var foldp = Signal.foldp
var transform = Signal.transform
var EventPool = Input.EventPool
var Router = Input.Router

// Application Model
var TodoModel = { id: "", title: "", completed: false
    , editing: false, hidden: false }
var TodosModel = { todos: [], route: "all" }

// Inputs
var addTodoPool = EventPool("add-todo")
var toggleAllPool = EventPool("toggle-all")
var modifyTodoPool = EventPool("modify-todo")
var clearCompletedPool = EventPool("clear-completed")
var routes = Router()

// State operations
var addTodo = transform(addTodoPool.signal, function (todo) {
    return function (state) {
        return todo.title === "" ? state :
            extend(state, { todos: state.todos.concat(todo) })
    }
})
var modifyTodo = transform(modifyTodoPool.signal, function (change) {
    return function (state) {
        return extend(state, {
            todos: state.todos.reduce(function (todos, todo) {
                return change.id !== todo.id ? todos.concat(todo) :
                    change.title === "" ? todos :
                    todos.concat(extend(todo, change))
            }, [])
        })
    }
})
var toggleAll = transform(toggleAllPool.signal, function (toggled) {
    return function (state) {
        return extend(state, { todos: state.todos.map(function (todo) {
            return extend(todo, { completed: toggled })
        }) })
    }
})
var clearCompleted = transform(clearCompletedPool.signal, function () {
    return function (state) {
        return extend(state, { todos: state.todos.filter(function (todo) {
            return !todo.completed
        }) })
    }
})
var handleRoutes = transform(routes, function (routeEvent) {
    return function (state) {
        return extend(state, { route: routeEvent.hash.slice(2) || "all" })
    }
})

var input = merge([addTodo, modifyTodo, toggleAll,
    clearCompleted, handleRoutes])

inspect(merge([addTodoPool.signal, modifyTodoPool.signal, toggleAllPool.signal,
    clearCompletedPool.signal, routes]))
// =>

var storedState = localStorage.getItem("todos-graphics")
var initialState = storedState ? JSON.parse(storedState) : TodosModel

// Updating the current state
var todosState = foldp(input, function update(state, modification) {
    return modification(state)
}, initialState)
inspect(todosState) // =>

todosState(function (value) {
    localStorage.setItem("todos-graphics", JSON.stringify(value))
})

// Various template functions to render subsets of the UI
function mainSection(state) {
    var todos = state.todos
    var route = state.route

    return h("section.main", { hidden: todos.length === 0 }, [
        toggleAllPool.change(h("input#toggle-all.toggle-all", {
            type: "checkbox",
            checked: todos.every(function (todo) {
                return todo.completed
            })
        })),
        h("label", { htmlFor: "toggle-all" }, "Mark all as complete"),
        h("ul.todo-list", todos.filter(function (todo) {
            return route === "completed" && todo.completed ||
                route === "active" && !todo.completed ||
                route === "all"
        }).map(todoItem))
    ])
}

function todoItem(todo) {
    var editBox = h("input.edit", {
        value: todo.title,
        focus: todo.editing
    })
    editBox = modifyTodoPool.submit(editBox, edit)
    editBox = modifyTodoPool.on(editBox, "blur", edit)

    var classes = (todo.completed ? ".completed" : "") +
        (todo.editing ? ".editing" : "")

    return h("li" + classes, [
        h("div.view", [
            modifyTodoPool.change(h("input.toggle", {
                type: "checkbox", checked: todo.completed
            }), completed),
            modifyTodoPool.on(h("label", todo.title), "dblclick", editing),
            modifyTodoPool.submit(h("button.destroy"), destroy)
        ]),
        editBox
    ])

    function edit(value) {
        return { id: todo.id, title: value, editing: false }
    }
    function editing() { return { id: todo.id, editing: true } }
    function completed(checked) { return { id: todo.id, completed: checked } }
    function destroy() { return { id: todo.id, title: "" } }
}

function statsSection(state) {
    var todos = state.todos
    var todosLeft = todos.filter(function (todo) {
        return todo.completed === false
    }).length
    var todosCompleted = todos.length - todosLeft

    return h("footer.footer", {
        hidden: todos.length === 0
    }, [
        h("span.todo-count", [
            h("strong", String(todosLeft)),
            " item" + (todos.length !== 1 ? "s" : "") + " left"
        ]),
        h("ul.filters", [
            link("#/", "All", state.route === "all"),
            link("#/active", "Active", state.route === "active"),
            link("#/completed", "Completed", state.route === "completed")
        ]),
        clearCompletedPool.submit(h("button.clear-completed", {
            hidden: todosCompleted === 0
        }, "Clear completed (" + String(todosCompleted) + ")"))
    ])
}

function link(uri, text, selected) {
    return h("li", [
        h("a" + (selected ? ".selected" : ""), {
            href: uri
        }, text)
    ])
}

function Header() {
    return h("header.header", [
        h("h1", "todos"),
        addTodoPool.submit(h("input.new-todo", {
            placeholder: "What needs to be done?"
            , autofocus: true
        }), function (value, target) {
            // OOPS. I touched the DOM.
            target.value = ""

            return { id: uuid(), title: value.trim()
                , completed: false, editing: false, hidden: false }
        })
    ])
}

function InfoFooter() {
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

var headerSection = Header()
var infoFooter = InfoFooter()

var app = transform(todosState, function display(state) {
    return h("div.todomvc-wrapper", [
        h("section.todoapp", [
            headerSection,
            mainSection(state),
            statsSection(state)
        ]),
        infoFooter
    ])
})

// Render scene
render(app, false)
// =>
