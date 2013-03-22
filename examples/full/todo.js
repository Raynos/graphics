var uuid = require("uuid")
var extend = require("xtend")

var Signal = require("../../signal")
var Input = require("../../input")
var h = require("../../element").h
var render = require("../../render")

var inspect = Signal.inspect
var transform = Signal.transform
var mergeAll = Signal.mergeAll
var foldp = Signal.foldp
var transformMany = Signal.transformMany
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

var events = mergeAll({
    addTodo: addTodoPool.signal,
    modifyTodo: modifyTodoPool.signal,
    toggleAll: toggleAllPool.signal,
    clearCompleted: clearCompletedPool.signal
})
var input = transformMany([routes, events], function (routes, events) {
    return extend(events, { routes: routes })
})
inspect(input) // =>

// State operations
function addTodo(state, todo) {
    return todo.title === "" ? state :
        extend(state, { todos: state.todos.concat(todo) })
}

function modifyTodo(state, change) {
    return extend(state, {
        todos: state.todos.reduce(function (todos, todo) {
            return change.id !== todo.id ? todos.concat(todo) :
                change.title === "" ? todos :
                todos.concat(extend(todo, change))
        }, [])
    })
}

function toggleAll(state, toggled) {
    return extend(state, { todos: state.todos.map(function (todo) {
        return extend(todo, { completed: toggled })
    }) })
}

function clearCompleted(state) {
    return extend(state, { todos: state.todos.filter(function (todo) {
        return !todo.completed
    }) })
}

function handleRoutes(state, routeEvent) {
    var route = routeEvent.hash.slice(2) || "all"

    return {
        todos: state.todos.map(function (todo) {
            var isHidden = route === "completed" && !todo.completed ?
                true : route === "active" && todo.completed ?
                true : false

            return extend(todo, {
                hidden: isHidden
            })
        }),
        route: route
    }
}

// Updating the current state
var todosState = foldp(input, function update(state, input) {
    state = (
        "addTodo" in input ? addTodo(state, input.addTodo) :
        "modifyTodo" in input ? modifyTodo(state, input.modifyTodo) :
        "toggleAll" in input ? toggleAll(state, input.toggleAll) :
        "clearCompleted" in input ?
            clearCompleted(state, input.clearCompleted) :
        state)

    return handleRoutes(state, input.routes)
}, TodosModel)
inspect(todosState) // =>

// Various template functions to render subsets of the UI
function mainSection(todos) {
    return h("section.main", { hidden: todos.length === 0 }, [
        toggleAllPool.change(h("input#toggle-all.toggle-all", {
            type: "checkbox",
            checked: todos.every(function (todo) {
                return todo.completed
            })
        })),
        h("label", { htmlFor: "toggle-all" }, "Mark all as complete"),
        h("ul.todo-list", todos.filter(function (todo) {
            return !todo.hidden
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
            mainSection(state.todos),
            statsSection(state)
        ]),
        infoFooter
    ])
})

// Render scene
render(app, false)
// =>
