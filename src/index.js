import "./styles.css"

console.log("We got juice");

// DOM
document.addEventListener('DOMContentLoaded', () => {
    const addProjectBtn = document.querySelector('.add-project-btn');
    const addTodoBtn = document.querySelector('.add-todo-btn');
    
    // Add event listeners
    addProjectBtn.addEventListener('click', () => {
        console.log('Add Project button clicked!');
        // We'll implement this functionality next
    });
    
    addTodoBtn.addEventListener('click', () => {
        console.log('Add Todo button clicked!');
        // We'll implement this functionality after projects
    });
});