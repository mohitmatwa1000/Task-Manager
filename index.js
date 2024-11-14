let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;

    if (title && dueDate && priority) {
        const newTask = { title, description, dueDate, priority, completed: false };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    }
}

function displayTasks() {
    document.getElementById('upcoming-list').innerHTML = '';
    document.getElementById('overdue-list').innerHTML = '';
    document.getElementById('completed-list').innerHTML = '';

    const filterValue = document.getElementById('filter').value;
    const currentDate = new Date().toISOString().split('T')[0];

    tasks.forEach((task, index) => {
        if (filterValue !== 'all' && !isTaskMatchingFilter(task, filterValue)) return;

        const listElement = document.createElement('li');
        listElement.classList.add(getTaskStatusClass(task, currentDate));

        listElement.innerHTML = `
            <strong>${task.title}</strong> (${task.priority}) <br>
            ${task.description} <br>
            Due: ${task.dueDate}
            <select onchange="updatePriority(${index}, this.value)">
                <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
                <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
            </select>
            <button class="complete" onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
            <button class="delete" onclick="deleteTask(${index})">Delete</button>
        `;

        if (task.completed) {
            document.getElementById('completed-list').appendChild(listElement);
        } else if (task.dueDate < currentDate) {
            document.getElementById('overdue-list').appendChild(listElement);
        } else {
            document.getElementById('upcoming-list').appendChild(listElement);
        }
    });
}

function getTaskStatusClass(task, currentDate) {
    if (task.completed) return 'completed';
    if (task.dueDate < currentDate) return 'overdue';
    return 'upcoming';
}

function updatePriority(index, newPriority) {
    tasks[index].priority = newPriority;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function isTaskMatchingFilter(task, filter) {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return task.priority === filter;
}

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('li').forEach((task) => {
        const text = task.innerText.toLowerCase();
        task.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

window.onload = displayTasks;