// Sélection des éléments HTML
const main = document.querySelector("main");
const doneCheckbox = document.getElementById("done");
const notDoneCheckbox = document.getElementById("not-done");

// Charger les données depuis le localStorage au chargement de la page
window.onload = () => {
    loadListsFromStorage();
};

// Sauvegarde les listes dans le localStorage
function saveListsToStorage() {
    const lists = [];

    // Récupérer toutes les listes présentes dans le DOM
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

// Charger les listes depuis le localStorage
function loadListsFromStorage() {
    const lists = JSON.parse(localStorage.getItem("todoLists")) || [];
    lists.forEach((list) => {
        addList(list.title, list.tasks);
    });
}

// Fonction pour ajouter une nouvelle liste avec un nom personnalisé et des tâches
function addList(listName = null, tasks = []) {
    const listContainer = document.createElement("div");
    listContainer.classList.add("list-container");

    // Demander un nom pour la nouvelle liste si non fourni
    const listTitleText = listName || prompt("Entrez le nom de la nouvelle liste :") || "Nouvelle Liste";

    const listTitle = document.createElement("h3");
    listTitle.textContent = listTitleText;

    // Bouton pour renommer la liste
    const renameBtn = document.createElement("button");
    renameBtn.textContent = "Renommer";
    renameBtn.onclick = () => {
        renameList(listTitle);
        saveListsToStorage();
    };

    // Bouton pour supprimer la liste
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.onclick = () => {
        deleteList(listContainer);
        saveListsToStorage();
    };

    const taskInput = document.createElement("input");
    taskInput.type = "text";
    taskInput.placeholder = "Nouvelle tâche...";

    // Champs pour la date
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

    // Ajouter les tâches existantes (utilisé lors du chargement depuis le localStorage)
    tasks.forEach(task => displayTask(task, listContainer));
}

// Fonction pour renommer une liste
function renameList(listTitle) {
    const newName = prompt("Entrez le nouveau nom de la liste :");
    if (newName) {
        listTitle.textContent = newName;
    }
}

// Fonction pour supprimer une liste
function deleteList(listContainer) {
    main.removeChild(listContainer);
}

// Fonction pour ajouter une tâche avec le texte et la date choisie par l'utilisateur
function addTask(taskText, dateValue, listContainer) {
    if (!taskText) return;

    const task = {
        text: taskText,
        date: dateValue ? dateValue.split("-").reverse().join("/") : "Aucune date",
        done: false
    };

    displayTask(task, listContainer);
}

// Fonction pour afficher une tâche dans la liste avec option de modification
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

    // Bouton pour modifier la tâche
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

// Fonction pour modifier le texte et la date de la tâche
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

// Ajout d'écouteurs pour les filtres
doneCheckbox.addEventListener("change", filterTasks);
notDoneCheckbox.addEventListener("change", filterTasks);