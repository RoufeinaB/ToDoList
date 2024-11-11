// Sélection le HTML
const main = document.querySelector("main");
const doneCheckbox = document.getElementById("done");
const notDoneCheckbox = document.getElementById("not-done");

// LocalStorage
window.onload = () => {
    loadListsFromStorage();
};

// Sauvegarde les listes
function saveListsToStorage() {
    const lists = [];

document.querySelectorAll(".list-container").forEach((listContainer) => {
    const listTitle = listContainer.querySelector("h3").textContent;
    const tasks = [];

listContainer.querySelectorAll(".task").forEach((taskElement) => {
    const taskCheckbox = taskElement.querySelector("input[type='checkbox']");
    const taskLabel = taskElement.querySelector("label").textContent;
    const [taskText, taskDate] = taskLabel.split(" - ");
            
        tasks.push({
            text: taskText,
            date: taskDate,
            done: taskCheckbox.checked
        });
    });

        lists.push({
            title: listTitle,
            tasks: tasks
        });
    });

    localStorage.setItem("todoLists", JSON.stringify(lists));
}

function loadListsFromStorage() {
    const lists = JSON.parse(localStorage.getItem("todoLists")) || [];
    lists.forEach((list) => {
        addList(list.title, list.tasks);
    });
}

// Ajouter une listes
function addList(listName = null, tasks = []) {
    const listContainer = document.createElement("div");
    listContainer.classList.add("list-container");

    // Demander un nom
    const listTitleText = l|istName | prompt("Entrez le nom de la nouvelle liste :") || "Nouvelle Liste";

    const listTitle = document.createElement("h3");
    listTitle.textContent = listTitleText;

    // Renommer la liste
    const renameBtn = document.createElement("button");
    renameBtn.textContent = "Renommer";
    renameBtn.onclick = () => {
        renameList(listTitle);
        saveListsToStorage();
    };

    // Supprimer la liste
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.onclick = () => {
        deleteList(listContainer);
        saveListsToStorage();
    };
    const taskInput = document.createElement("input");
    taskInput.type = "text";
    taskInput.placeholder = "Nouvelle tâche...";

    //La date
    const dateInput = document.createElement("input");
    dateInput.type = "date";

    const addTaskBtn = document.createElement("button");
    addTaskBtn.textContent = "Ajouter une tâche";
    addTaskBtn.onclick = () => {
        addTask(taskInput.value, dateInput.value, listContainer);
        saveListsToStorage();
    };

    // Ajout des éléments dans le conteneur de la liste
    listContainer.appendChild(listTitle);
    listContainer.appendChild(renameBtn);
    listContainer.appendChild(deleteBtn);
    listContainer.appendChild(taskInput);
    listContainer.appendChild(dateInput);
    listContainer.appendChild(addTaskBtn);
    main.appendChild(listContainer);

    // Ajouter les tâches existantes
    tasks.forEach(task => displayTask(task, listContainer));
}

// Renommer une liste
function renameList(listTitle) {
    const newName = prompt("Entrez le nouveau nom de la liste :");
    if (newName) {
        listTitle.textContent = newName;
    }
}

// Supprimer une liste
function deleteList(listContainer) {
    main.removeChild(listContainer);
}

// Ajouter une tâche
function addTask(taskText, dateValue, listContainer) {
    if (!taskText) return;

    const task = {
        text: taskText,
        date: dateValue ? dateValue.split("-").reverse().join("/") : "Aucune date",
        done: false
    };

    displayTask(task, listContainer);
}

// Afficher une tâche
function displayTask(task, listContainer) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");

    const taskLabel = document.createElement("label");
    taskLabel.textContent = `${task.text} - ${task.date}`;

    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.checked = task.done;
    taskCheckbox.onchange = () => {
        filterTasks();
        saveListsToStorage();
    };

    // Modifier la tâche
    const editTaskBtn = document.createElement("button");
    editTaskBtn.textContent = "Modifier";
    editTaskBtn.onclick = () => {
        editTask(task, taskLabel, taskCheckbox);
        saveListsToStorage();
    };

    taskElement.appendChild(taskCheckbox);
    taskElement.appendChild(taskLabel);
    taskElement.appendChild(editTaskBtn);
    listContainer.appendChild(taskElement);
}

// Fonction pour modifier le texte 
function editTask(task, taskLabel, taskCheckbox) {
    const newText = prompt("Modifiez le nom de la tâche :", task.text);
    const newDate = prompt("Modifiez la date de la tâche (format JJ/MM/AAAA) :", task.date.split("/").reverse().join("-"));

    if (newText) task.text = newText;
    if (newDate) task.date = newDate.split("-").reverse().join("/");

    taskLabel.textContent = `${task.text} - ${task.date}`;
    task.done = taskCheckbox.checked;
}

// Fonction pour supprimer toutes les listes
function deleteAllList() {
    main.innerHTML = "";
    localStorage.removeItem("todoLists");
}

// Fonction pour filtrer les tâches
function filterTasks() {
    const tasks = document.querySelectorAll(".task");

    tasks.forEach(task => {
        const isChecked = task.querySelector("input[type='checkbox']").checked;

        if (doneCheckbox.checked && isChecked) {
            task.style.display = "block";
        } else if (notDoneCheckbox.checked && !isChecked) {
            task.style.display = "block";
        } else if (!doneCheckbox.checked && !notDoneCheckbox.checked) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
}

// pour les filtres
doneCheckbox.addEventListener("change", filterTasks);
notDoneCheckbox.addEventListener("change", filterTasks);
