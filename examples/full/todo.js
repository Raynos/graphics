var uuid = require("uuid")
var extend = require("xtend")

var render = require("../../render")
var Signal = require("../../signal")
var Input = require("../../input")
var Element = require("../../element")

var EventPool = Input.EventPool
var inspect = Signal.inspect
var transform = Signal.transform
var mergeAll = Signal.mergeAll
var foldp = Signal.foldp
var h = Element.h

// Application Model
var TodoModel = { id: "", title: "", completed: false }
var TodosModel = { todos: [] }

// Inputs
var newTodoPool = EventPool("new-todo")
var toggleAllPool = EventPool("toggle-all")
var todoTogglePool = EventPool("todo-toggle")
var destroyTodoPool = EventPool("destroy-todo")
var editingTodoPool = EventPool("editing-todo")
var editTodoPool = EventPool("edit-todo")

var input = mergeAll({
    newTodo: newTodoPool.signal,
    toggleAll: toggleAllPool.signal,
    todoToggle: todoTogglePool.signal,
    destroyTodo: destroyTodoPool.signal,
    editingTodo: editingTodoPool.signal,
    editTodo: editTodoPool.signal
})
inspect(input) // =>

// State operations
function newTodo(state, todo) {
    if (todo.title === "") {
        return state
    }

    return { todos: state.todos.concat(todo) }
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

function destroyTodo(state, change) {
    return { todos: state.todos.filter(function (todo) {
        return todo.id !== change.id
    }) }
}

function editingTodo(state, change) {
    return { todos: state.todos.map(function (todo) {
        if (change.id !== todo.id) {
            return extend(todo, { editing: false })
        } else {
            return extend(todo, { editing: true })
        }
    }) }
}

function editTodo(state, change) {
    return { todos: state.todos.reduce(function (todos, todo) {
        if (change.id !== todo.id)  {
            return todos.concat(todo)
        }

        if (change.title === "") {
            return todos
        } else {
            return todos.concat(extend(todo, {
                editing: false, title: change.title
            }))
        }
    }, []) }
}

// Updating the current state
var todosState = foldp(input, function update(state, inputState) {
    if ("newTodo" in inputState) {
        state = newTodo(state, inputState.newTodo)
    } else if ("toggleAll" in inputState) {
        state = toggleAll(state, inputState.toggleAll)
    } else if ("todoToggle" in inputState) {
        state = todoToggle(state, inputState.todoToggle)
    } else if ("destroyTodo" in inputState) {
        state = destroyTodo(state, inputState.destroyTodo)
    } else if ("editingTodo" in inputState) {
        state = editingTodo(state, inputState.editingTodo)
    } else if ("editTodo" in inputState) {
        state = editTodo(state, inputState.editTodo)
    }

    return state
}, TodosModel)
inspect(todosState) // =>

// Displaying the scene
function mainSection(todos) {
    var newTodoInput = newTodoPool.submit(h("input.new-todo", {
        placeholder: "What needs to be done?"
        , autofocus: true
    }), function (value) {
        return { id: uuid(), title: value.trim(), completed: false }
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
        h("header.header", [ h("h1", "todos"), newTodoInput ]),
        h("section.main", { hidden: todos.length === 0 }, [
            toggleAll,
            h("label", { htmlFor: "toggle-all" }, "Mark all as complete"),
            h("ul.todo-list", todos.map(todoItem))
        ]),
        h("footer.footer", { hidden: todos.length === 0 })
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
    }), completed)

    var destroyTodo = destroyTodoPool.submit(h("button.destroy"), id)

    var editLabel = editingTodoPool.on(h("label", todo.title), "dblclick", id)

    var editInput = editTodoPool.submit(h("input.edit", {
        value: todo.title,
        focus: todo.editing
    }), editSubmit)
    editInput = editTodoPool.on(editInput, "blur", edit)

    var classes = (todo.completed ? ".completed" : "") +
        (todo.editing ? ".editing" : "")

    return h("li" + classes, [
        h("div.view", [ todoToggle, editLabel, destroyTodo ]),
        editInput
    ])

    function id() { return { id: todo.id } }

    function completed(checked) { return { id: todo.id, completed: checked } }

    function editSubmit(value) { return { id: todo.id, title: value } }

    function edit(elem) { return { id: todo.id, title: elem.vlaue } }
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
