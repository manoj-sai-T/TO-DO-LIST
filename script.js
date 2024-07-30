let tasks = [];
const savedTasks = localStorage.getItem('tasks');
if (savedTasks) {
    tasks = JSON.parse(savedTasks);
}

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const newTask = { id: Date.now(), text: taskText, completed: false };
    tasks.push(newTask);
    renderTasks();

    taskInput.value = "";
    saveTasks();
    
}


document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function toggleTaskCompleted(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    saveTasks();
}

function renderTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.className = "taskItem" + (task.completed ? " completed" : "") + (document.body.classList.contains("dark-theme") ? " dark-theme" : "");
        listItem.draggable = true;

        const textSpan = document.createElement("span");
        textSpan.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "deleteButton";
        deleteButton.addEventListener("click", () => deleteTask(task.id));

        listItem.appendChild(textSpan);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });

    const taskItems = document.querySelectorAll('.taskItem');
    taskItems.forEach(taskItem => {
        taskItem.addEventListener('dragstart', dragStart);
        taskItem.addEventListener('dragover', dragOver);
        taskItem.addEventListener('dragenter', dragEnter);
        taskItem.addEventListener('dragleave', dragLeave);
        taskItem.addEventListener('drop', drop);
        taskItem.addEventListener('dragend', dragEnd);
    });
}

let draggedItem;

function dragStart(event) {
    draggedItem = event.target;
    setTimeout(() => {
        event.target.style.display = "none";
    }, 0);
}

function dragOver(event) {
    event.preventDefault();
}

function dragEnter(event) {
    event.preventDefault();
    this.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
}

function dragLeave() {
    this.style.backgroundColor = "inherit";
}

function drop(event) {
    event.preventDefault();
    this.style.backgroundColor = "inherit";
    const newIndex = Array.from(this.parentNode.children).indexOf(this);
    const oldIndex = Array.from(document.getElementById("taskList").children).indexOf(draggedItem);
    const task = tasks.splice(oldIndex, 1)[0];
    tasks.splice(newIndex, 0, task);
    renderTasks();
}

function dragEnd() {
    setTimeout(() => {
        draggedItem.style.display = "flex";
        draggedItem = null;
    }, 0);
}

function changeTheme(theme) {
    const body = document.body;
    const container = document.querySelector('.container');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const themeSelector = document.querySelector('.theme-selector');
    const languageSelector = document.querySelector('.language-selector');

    if (theme === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        container.classList.remove('light-theme');
        container.classList.add('dark-theme');
        taskInput.classList.remove('light-theme');
        taskInput.classList.add('dark-theme');
        taskList.classList.remove('light-theme');
        taskList.classList.add('dark-theme');
        themeSelector.classList.remove('light-theme');
        themeSelector.classList.add('dark-theme');
        languageSelector.classList.remove('light-theme');
        languageSelector.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        container.classList.remove('dark-theme');
        container.classList.add('light-theme');
        taskInput.classList.remove('dark-theme');
        taskInput.classList.add('light-theme');
        taskList.classList.remove('dark-theme');
        taskList.classList.add('light-theme');
        themeSelector.classList.remove('dark-theme');
        themeSelector.classList.add('light-theme');
        languageSelector.classList.remove('dark-theme');
        languageSelector.classList.add('light-theme');
    }

    renderTasks(); // Re-render tasks to apply the correct theme
}

const translations = {
    english: {
        heading: 'TO-DO List',
        placeholder: 'Enter task',
        addButton: 'Add Task',
        deleteButton: 'Delete'
    },
    telugu: {
        heading: 'టుడు లిస్ట్',
        placeholder: 'టాస్క్ నమోదు చేయండి',
        addButton: 'టాస్క్ జోడించు',
        deleteButton: 'తొలగించు'
    },
    hindi: {
        heading: 'टू-डू लिस्ट',
        placeholder: 'कार्य दर्ज करें',
        addButton: 'कार्य जोड़ें',
        deleteButton: 'हटाएं'
    }
};

function changeLanguage(language) {
    const selectedTranslations = translations[language];

    document.getElementById('heading').textContent = selectedTranslations.heading;
    document.getElementById('taskInput').setAttribute('placeholder', selectedTranslations.placeholder);
    document.getElementById('addButton').textContent = selectedTranslations.addButton;

    const deleteButtons = document.querySelectorAll('.deleteButton');
    deleteButtons.forEach(button => {
        button.textContent = selectedTranslations.deleteButton;
    });

    // Translate existing tasks
    tasks.forEach(task => {
        task.text = translateTask(task.text, language);
    });

    renderTasks();
}

function translateTask(text, language) {
    // This function translates task text based on a predefined dictionary.
    // For simplicity, we assume a basic dictionary. You can expand this as needed.
    const dictionary = {
        english: {
            'Example Task': 'Example Task'
        },
        telugu: {
            'Example Task': 'ఉదాహరణ టాస్క్'
        },
        hindi: {
            'Example Task': 'उदाहरण कार्य'
        }
    };

    return dictionary[language][text] || text;
}

renderTasks();

window.addEventListener('unload', saveTasks);