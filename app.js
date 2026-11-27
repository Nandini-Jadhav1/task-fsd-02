const STORAGE_KEY = 'practice-tasks';

const form = document.getElementById('form');
const input = document.getElementById('text');
const list = document.getElementById('list');
const messageEl = document.getElementById('message');
const emptyState = document.getElementById('empty-state');

// Load previously saved tasks safely from localStorage on startup.
let tasks = [];
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (Array.isArray(saved)) {
    tasks = saved
      .filter((item) => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
} catch (error) {
  // Ignore corrupted or inaccessible localStorage data and start with an empty list.
  tasks = [];
}

/**
 * Display a brief status message below the form.
 * @param {string} text - Message to display to the user.
 * @param {'success' | 'error'} type - Visual style for the message.
 */
function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = 'message ' + type;
}

/**
 * Save the current task list to localStorage.
 */
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    showMessage('Could not save tasks to local storage.', 'error');
    return false;
  }
}

/**
 * Render all tasks in the list and toggle the empty-state message.
 */
function render() {
  list.replaceChildren();
  emptyState.hidden = tasks.length > 0;

  tasks.forEach((text, index) => {
    const row = document.createElement('li');

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = text;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'delete-btn';
    button.textContent = 'Delete';
    button.setAttribute('aria-label', 'Delete task: ' + text);
    button.onclick = () => {
      tasks.splice(index, 1);
      const saved = save();
      render();
      if (saved) {
        showMessage('Task deleted.', 'success');
      }
    };

    row.append(taskText, button);
    list.append(row);
  });
}

// Handle adding a new task when the Add button is clicked or Enter is pressed.
form.onsubmit = (e) => {
  e.preventDefault();
  const text = input.value.trim();

  if (!text) {
    showMessage('Please enter a task before adding.', 'error');
    input.value = '';
    input.focus();
    return;
  }

  tasks.push(text);
  const saved = save();
  render();
  input.value = '';
  input.focus();

  if (saved) {
    showMessage('Task added!', 'success');
  }
};

// Initial render on page load.
render();
