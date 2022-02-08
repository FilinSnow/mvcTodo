export class Model {
    _getTasksLocalStorage = () => {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || new Array();
        return tasks;
    };

    _setTasksLocalStorage = (arr) => {
        localStorage.setItem("tasks", JSON.stringify(arr));
    }

    addTask(task) {
        const value = {
            id: Date.now(),
            text: task,
            complete: false,
            edit: false,
        };
        const tasks = this._getTasksLocalStorage();
        tasks.push(value)
        this._setTasksLocalStorage(tasks)
        return tasks;
    }

    deleteTask(id) {
        const tasks = this._getTasksLocalStorage();
        const newTasks = tasks.filter(task => task.id !== id)
        this._setTasksLocalStorage(newTasks)
        return tasks
    }

    editTask(id) {
        const tasks = this._getTasksLocalStorage();
        const newTasks = tasks.map(task => {
            if (task.id === id) {
                task.edit = !task.edit;
                return task;
            }
            return task;
        })
        this._setTasksLocalStorage(newTasks)
        return tasks
    }

    saveChangeTask(value, id) {
        const tasks = this._getTasksLocalStorage();
        const newTasks = tasks.map(task => {
            if (task.id === id) {
                task.text = value;
                return task;
            }
            return task;
        })
        this._setTasksLocalStorage(newTasks)
        return tasks
    }

    changeCompleteTask(id) {
        const tasks = this._getTasksLocalStorage();
        const newTasks = tasks.map(task => {
            if (task.id === id) {
                task.complete = !task.complete;
                return task;
            }
            return task;
        })
        this._setTasksLocalStorage(newTasks)
        return tasks
    }
}

export class View {
    constructor() {
        this.listTasks = document.querySelector(".list-group");
        this.btn = document.querySelector(".btn");
        this.enterText = document.querySelector(".form-control");
        this.refFuncDelete;
        this.refFuncEdit;
        this.refFuncSaveChangeValue;
        this.refFuncChangeCompleteTask;
    }

    _getTasksLocalStorage = () => {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || new Array();
        return tasks;
    };

    _getListTasks = () => {
        this.listTasks = document.querySelector(".list-group");
        return this.listTasks;
    };

    viewShowTasks = () => {
        this.listTasks.innerHTML = "";
        const tasks = this._getTasksLocalStorage();
        if (tasks) {
            tasks.forEach((element) => {
                const li = document.createElement("li");
                li.classList.add("list-group-item");
                li.dataset.id = element.id;
                const doneInput = document.createElement("input");
                doneInput.classList.add('form-check-input', 'inputCheckBox');
                doneInput.setAttribute("type", "checkbox");
                doneInput.checked = element.complete;
                const containerText = document.createElement("div");
                containerText.classList.add('containerText');
                const textDiv = document.createElement("div");
                textDiv.innerHTML = element.text;
                element.complete ? textDiv.classList.add('done') : null;
                const textInput = document.createElement("input");
                textInput.value = element.text;
                textInput.classList.add('form-control');
                const checkTaskEditForInsertText = element.edit ? textInput : textDiv;
                containerText.appendChild(doneInput);
                containerText.appendChild(checkTaskEditForInsertText);
                const containerActBtn = document.createElement("div");
                containerActBtn.classList.add('containerActBtn');
                const btnSave = document.createElement("button");
                btnSave.innerHTML = 'Сохранить';
                btnSave.classList.add("btn", "btn-success", "save");
                btnSave.disabled = element.complete;
                const btnEdit = document.createElement("button");
                btnEdit.innerHTML = 'Изменить';
                btnEdit.classList.add("btn", "btn-primary", "edit");
                btnEdit.disabled = element.complete;
                const btnDel = document.createElement("button");
                btnDel.innerHTML = 'Удалить';
                btnDel.classList.add("btn", "btn-danger");
                btnDel.disabled = element.complete;
                const checkTaskEdit = element.edit ? btnSave : btnEdit;
                containerActBtn.appendChild(checkTaskEdit);
                containerActBtn.appendChild(btnDel);
                li.appendChild(containerText);
                li.appendChild(containerActBtn);

                doneInput.addEventListener('click', () => {
                    this.viewChangeCompleteTask(null, Number(element.id))
                })
                btnSave.addEventListener('click', () => {
                    this.viewEditTask(null, Number(element.id));
                    if (textInput.value && textInput.value.trim() !== '') {
                        this.viewSaveChangeTask(null, textInput.value, Number(element.id));
                    }
                })
                btnDel.addEventListener('click', () => {
                    this.viewDeleteTask(null, Number(element.id));
                })
                btnEdit.addEventListener('click', () => {
                    this.viewEditTask(null, Number(element.id));
                })
                textInput.addEventListener('focus', (e) => {
                    textInput.focus();
                    textInput.select();
                })
                this.listTasks.appendChild(li);
            });
        }
    };

    viewAddTask = (handler) => {
        this.btn.addEventListener("click", () => {
            if (this.enterText.value && this.enterText.value.trim() !== '') {
                handler(this.enterText.value.trim());
                this.enterText.value = "";
                this.viewShowTasks();
            }
        });
        window.addEventListener("keypress", (e) => {
            if (this.enterText.value && this.enterText.value.trim() !== '') {
                if (e.key === "Enter") {
                    handler(this.enterText.value.trim());
                    this.enterText.value = "";
                    this.viewShowTasks();
                }
            }
        });
    };

    viewDeleteTask = (handler, idTask = null) => {
        if (handler) {
            return this.refFuncDelete = handler;
        }
        if (idTask) {
            this.refFuncDelete(Number(idTask));
            this.viewShowTasks();
        }
    };

    viewEditTask = (handler, idTask = null) => {
        if (handler) {
            return this.refFuncEdit = handler;
        }
        if (idTask) {
            this.refFuncEdit(Number(idTask));
            this.viewShowTasks();
        }
    }

    viewSaveChangeTask = (handler, newValue, id) => {
        if (handler) {
            this.refFuncSaveChangeValue = handler;
        }
        if (id) {
            this.refFuncSaveChangeValue(newValue, id);
            this.viewShowTasks();
        }
    }

    viewChangeCompleteTask = (handler, id) => {
        if (handler) {
            this.refFuncChangeCompleteTask = handler;
        }
        if (id) {
            this.refFuncChangeCompleteTask(id);
            this.viewShowTasks();
        }
    }
}

export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.viewShowTasks();
        this.view.viewAddTask(this.handleAddTask);
        this.view.viewDeleteTask(this.handleDeleteTask);
        this.view.viewEditTask(this.handleEditTask);
        this.view.viewSaveChangeTask(this.handleSaveChangeTask);
        this.view.viewChangeCompleteTask(this.handleChangeCompleteTask);
    }
    handleAddTask = (task) => {
        this.model.addTask(task);
    };
    handleDeleteTask = (id) => {
        this.model.deleteTask(id);
    };
    handleEditTask = (id) => {
        this.model.editTask(id);
    }
    handleSaveChangeTask = (value, id) => {
        this.model.saveChangeTask(value, id);
    }
    handleChangeCompleteTask = (id) => {
        this.model.changeCompleteTask(id)
    }
}

const app = new Controller(new Model(), new View());

function sum(a, b) {
  return a + b;
}
export default sum;