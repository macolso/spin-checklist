document.addEventListener('DOMContentLoaded', () => {
    let TASKS = {}

    const learningObjectiveInput = document.getElementById('learningObjective');
    const addObjectiveButton = document.getElementById('addObjective');
    const objectiveList = document.getElementById('objectiveList');

    const apiRequest = (url, method, body) => {
        return fetch(url, {
            method: method,
            body: JSON.stringify(body)
        }).catch(error => console.error(error));
    };

    // Function to create a new learning objective item
    function createObjective(text, isMarked) {
        if (TASKS[text]) {
            learningObjectiveInput.value = '';
            return;
        }

        // Create all elements w/in an objective
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        const checkboxLabel = document.createElement('label');
        const checkmark = document.createElement("span");
        const objectiveText = document.createElement('span');
        const deleteButton = document.createElement("button");

        // set checkbox attributes
        checkbox.type = 'checkbox';
        checkbox.classList.add("checkbox");
        checkbox.addEventListener('change', toggleObjective);

        checkboxLabel.classList.add("check-container");
        checkmark.classList.add("checkmark");

        // nesting checkmark and checkbox to customize appearance
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(checkmark);

        // set ojective text attributes
        objectiveText.classList.add("list-item-text");
        objectiveText.textContent = text;

        // set delete button attributes
        deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
        deleteButton.addEventListener('click', deleteObjective);

        apiRequest('/api', 'POST', { key: text, value: isMarked });

        // build list item from checkbox, text, and delete button
        listItem.appendChild(checkboxLabel);
        listItem.appendChild(objectiveText);
        listItem.appendChild(deleteButton);

        // add item to objective list
        objectiveList.appendChild(listItem);

        learningObjectiveInput.value = '';
    }

    // Function to delete a new learning objective item
    function deleteObjective(event) {
        event.stopPropagation()
        const listItem = event.target.parentElement;
        const text = listItem.querySelector('.list-item-text').textContent;

        apiRequest('/api', 'DELETE', { key: text });

        // remove task from the TASK and objective list
        listItem.remove();
        delete TASKS[text];

        learningObjectiveInput.value = '';
    }

    // Function to toggle the completion status of a learning objective
    function toggleObjective(event) {
        const checkbox = event.target;
        const objectiveText = checkbox.parentElement.nextSibling;

        objectiveText.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
        objectiveText.style.color = checkbox.checked ? '#868496' : '#0E092D';

        apiRequest('/api', 'POST', {
            key: objectiveText.innerText,
            value: checkbox.checked ? 'true' : 'false'
        })

        TASKS[objectiveText.innerText] = checkbox.checked;
    }

    // Event listener for adding a new learning objective
    addObjectiveButton.addEventListener('click', () => {
        const text = learningObjectiveInput.value.trim();
        if (text !== '') {
            createObjective(text, "false");
            learningObjectiveInput.value = '';
        }
    });


    // Fetch objectives from the server and populate the list
    apiRequest('/api')
        .then(response => response.json())
        .then(objectives => {
            Object.keys(objectives).forEach(k => {
                createObjective(k, objectives[k]);

                // if objective has been completed, check it off the list
                if (objectives[k] === "true") {
                    // set checkmark to 'checked' state
                    const listItem = objectiveList.lastChild;
                    listItem.querySelector('input').checked = true;

                    // set text to 'checked' state
                    const objective = listItem.getElementsByClassName('list-item-text')[0]
                    objective.style.textDecoration = 'line-through';
                    objective.style.color = '#868496';
                }
            });
        })
        .catch(error => console.error(error));
});
