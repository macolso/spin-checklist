let TASKS = {}

document.addEventListener('DOMContentLoaded', () => {
    const learningObjectiveInput = document.getElementById('learningObjective');
    const addObjectiveButton = document.getElementById('addObjective');
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.style.marginLeft = "10px";
    const objectiveList = document.getElementById('objectiveList');

    // Function to create a new learning objective item
    function createObjective() {
        const text = learningObjectiveInput.value.trim();
        if (text === '') return;
        if (TASKS[text]) {
            learningObjectiveInput.value = '';
            return
        }

        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', toggleObjective);

        const objectiveText = document.createElement('span');
        objectiveText.textContent = text;

        fetch("/api", {
            method: "POST",
            body: JSON.stringify({
                key: text,
                value: "false"
            })
        })

        listItem.appendChild(checkbox);
        listItem.appendChild(objectiveText);
        listItem.appendChild(deleteButton);
        objectiveList.appendChild(listItem);

        learningObjectiveInput.value = '';
    }

    // Function to create a new learning objective item - KENZIE
    function deleteObjective(e) {
        console.log(e.target)
        let task = e.target.previousSibling
        console.log(task)
        let checkbox = task.previousSibling

        fetch("/api", {
            method: "DELETE",
            body: JSON.stringify({
                key: task.innerText
            })
        })
        console.log("here")
        e.target.remove()
        task.remove()
        checkbox.remove()

        learningObjectiveInput.value = '';
    }

    // Function to toggle the completion status of a learning objective
    // find key and then send pPOST REQUEST (SEE ABOVE LINES)
    function toggleObjective(event) {
        const checkbox = event.target;
        const objectiveText = checkbox.nextSibling;
        if (checkbox.checked) {
            objectiveText.style.textDecoration = 'line-through';
            fetch("/api", {
                method: "POST",
                body: JSON.stringify({
                    key: objectiveText.innerText,
                    value: "true"
                })
            })
        } else {
            objectiveText.style.textDecoration = 'none';
            fetch("/api", {
                method: "POST",
                body: JSON.stringify({
                    key: objectiveText,
                    value: "false"
                })
            })
        }
    }

    // Event listener for adding a new learning objective
    addObjectiveButton.addEventListener('click', createObjective);

    deleteButton.addEventListener('click', deleteObjective);


    // You can integrate your backend API calls here
    // Example: Fetch objectives from the server and populate the list

    // Example:
    fetch('/api')
        .then(response => response.json())
        .then(objectives => {
            console.log(objectives);
            TASKS = objectives
            let keys = Object.keys(objectives)
            keys.map(k => {
                const learningObjectiveInput = document.getElementById('learningObjective');
                const objectiveList = document.getElementById('objectiveList');

                // Function to create a new learning objective item
                const listItem = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.addEventListener('change', toggleObjective);

                const objectiveText = document.createElement('span');
                objectiveText.textContent = k;
                if (objectives[k] == "true") {
                    checkbox.checked = true
                    objectiveText.style.textDecoration = 'line-through';
                }
                listItem.appendChild(checkbox);
                listItem.appendChild(objectiveText);
                objectiveList.appendChild(listItem);
                var deleteButton = document.createElement("button");
                deleteButton.textContent = "X";
                deleteButton.style.marginLeft = "10px";
                deleteButton.addEventListener('click', deleteObjective);
                listItem.appendChild(deleteButton);

            })
        })
        .catch(error => console.error(error));
});
