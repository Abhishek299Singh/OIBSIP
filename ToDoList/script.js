/**
 * FlowTask - To-Do List Application Script
 * Features state management, localStorage persistence, and transition animation helpers.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const pendingList = document.getElementById('pending-list');
    const completedList = document.getElementById('completed-list');
    const pendingCount = document.getElementById('pending-count');
    const completedCount = document.getElementById('completed-count');
    const pendingEmpty = document.getElementById('pending-empty');
    const completedEmpty = document.getElementById('completed-empty');

    // State
    let tasks = JSON.parse(localStorage.getItem('flowtask_tasks')) || [];

    // Save to LocalStorage
    const saveTasks = () => {
        localStorage.setItem('flowtask_tasks', JSON.stringify(tasks));
    };

    // Render Lists
    const render = () => {
        // Clear lists
        pendingList.innerHTML = '';
        completedList.innerHTML = '';

        let pendingCountValue = 0;
        let completedCountValue = 0;

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.dataset.id = task.id;

            // Task content container (clickable to toggle completion)
            const leftContainer = document.createElement('div');
            leftContainer.className = 'task-left';
            
            // Custom Checkbox
            const checkboxLabel = document.createElement('label');
            checkboxLabel.className = 'checkbox-container';
            checkboxLabel.setAttribute('aria-label', task.completed ? 'Mark task as incomplete' : 'Mark task as complete');
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            
            // Toggle completed state on click
            checkbox.addEventListener('change', () => toggleTask(task.id, li));

            const checkmark = document.createElement('span');
            checkmark.className = 'checkmark';

            checkboxLabel.appendChild(checkbox);
            checkboxLabel.appendChild(checkmark);

            // Task Text
            const textSpan = document.createElement('span');
            textSpan.className = 'task-text';
            textSpan.textContent = task.text;

            leftContainer.appendChild(checkboxLabel);
            leftContainer.appendChild(textSpan);
            
            // Toggle complete by clicking the text container as well (accessibility/UX helper)
            leftContainer.addEventListener('click', (e) => {
                // Prevent duplicate triggering if checkbox itself was clicked
                if (e.target !== checkbox && e.target !== checkmark) {
                    checkbox.checked = !checkbox.checked;
                    toggleTask(task.id, li);
                }
            });

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.setAttribute('aria-label', 'Delete task');
            deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(task.id, li);
            });

            li.appendChild(leftContainer);
            li.appendChild(deleteBtn);

            // Append to appropriate list
            if (task.completed) {
                completedList.appendChild(li);
                completedCountValue++;
            } else {
                pendingList.appendChild(li);
                pendingCountValue++;
            }
        });

        // Update Counters
        pendingCount.textContent = pendingCountValue;
        completedCount.textContent = completedCountValue;

        // Toggle Empty State Banners
        if (pendingCountValue === 0) {
            pendingEmpty.style.display = 'flex';
        } else {
            pendingEmpty.style.display = 'none';
        }

        if (completedCountValue === 0) {
            completedEmpty.style.display = 'flex';
        } else {
            completedEmpty.style.display = 'none';
        }
    };

    // Add New Task
    const addTask = (text) => {
        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks();
        render();
    };

    // Toggle Task Completed State with Smooth Fade Out Animation
    const toggleTask = (id, taskElement) => {
        taskElement.classList.add('removing');
        
        // Wait for the exit animation before shifting lists
        setTimeout(() => {
            tasks = tasks.map(task => {
                if (task.id === id) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            });
            saveTasks();
            render();
        }, 200); // matches transition time
    };

    // Delete Task with Smooth Animation
    const deleteTask = (id, taskElement) => {
        taskElement.classList.add('removing');
        
        // Wait for transition to complete
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            render();
        }, 200);
    };

    // Event Listeners
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            addTask(text);
            todoInput.value = '';
            todoInput.focus();
        }
    });

    // Initial render
    render();
});
