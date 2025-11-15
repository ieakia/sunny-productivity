let todos = [];
let editingIndex = -1;
let deleteIndex = -1;

function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function updateProgress() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('progress-fill').style.width = percentage + '%';
    document.getElementById('progress-percentage').textContent = percentage + '%';
    document.getElementById('progress-label').textContent = `${completed} of ${total} completed`;
}

function renderTodos() {
    const list = document.getElementById('todo-list');
    
    if (todos.length === 0) {
        list.innerHTML = '<div class="empty-state">No tasks yet. Start adding some!</div>';
        updateProgress();
        return;
    }

    list.innerHTML = todos.map((todo, index) => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}">
            <div class="todo-header">
                <div class="checkbox-custom ${todo.completed ? 'checked' : ''}" onclick="toggleTodo(${index})"></div>
                <div class="todo-content">
                    <div class="todo-title">${todo.title}</div>
                    ${todo.description ? `<div class="todo-description">${todo.description}</div>` : ''}
                    <div class="todo-date">Created: ${todo.date}</div>
                </div>
            </div>
            <div class="todo-actions">
                <button class="edit-btn" onclick="editTodo(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
            </div>
        </li>
    `).join('');

    updateProgress();
}

function addTodo() {
    const titleInput = document.getElementById('todo-title');
    const descriptionInput = document.getElementById('todo-description');
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        alert('Please enter a task title');
        return;
    }

    if (editingIndex >= 0) {
        // Update existing task
        todos[editingIndex].title = title;
        todos[editingIndex].description = description;
        editingIndex = -1;
        document.getElementById('add-btn').textContent = 'Add Task';
        document.getElementById('cancel-btn').style.display = 'none';
    } else {
        // Add new task
        todos.push({ 
            title, 
            description, 
            completed: false,
            date: formatDate(new Date())
        });
    }

    titleInput.value = '';
    descriptionInput.value = '';
    renderTodos();
}

function editTodo(index) {
    const todo = todos[index];
    document.getElementById('todo-title').value = todo.title;
    document.getElementById('todo-description').value = todo.description;
    document.getElementById('add-btn').textContent = 'Update Task';
    document.getElementById('cancel-btn').style.display = 'block';
    editingIndex = index;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    document.getElementById('todo-title').value = '';
    document.getElementById('todo-description').value = '';
    document.getElementById('add-btn').textContent = 'Add Task';
    document.getElementById('cancel-btn').style.display = 'none';
    editingIndex = -1;
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
}

function deleteTodo(index) {
    deleteIndex = index;
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    deleteIndex = -1;
}

function confirmDelete() {
    if (deleteIndex >= 0) {
        todos.splice(deleteIndex, 1);
        if (editingIndex === deleteIndex) {
            cancelEdit();
        }
        renderTodos();
    }
    closeModal();
}

// Close modal when clicking outside
document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
        closeModal();
    }
});

document.getElementById('todo-title').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

renderTodos();