import './styles.css';
import createProject from './modules/project';
import createTodo from './modules/todo';
import UI from './modules/ui';

const App = (() => {
    let projects = [];
    let activeProjectId = '';
    
    const addProjectBtn = document.querySelector('.add-project-btn');
    const addTodoBtn = document.querySelector('.add-todo-btn');
    const projectListContainer = document.querySelector('.project-list');
    const todosListContainer = document.querySelector('.todos-list');
    
    const init = () => {
        projects = UI.initializeProjects();
        
        activeProjectId = '';
        
        UI.renderProjects(projects, activeProjectId);
        renderActiveTodos();
        
        setupEventListeners();
    };
    
    const setupEventListeners = () => {
        addProjectBtn.addEventListener('click', handleAddProject);
        
        projectListContainer.addEventListener('click', (e) => {
            UI.handleProjectClick(e, projects, handleProjectSelect, handleProjectDelete);
        });
        
        addTodoBtn.addEventListener('click', handleAddTodo);
        
        todosListContainer.addEventListener('click', (e) => {
            UI.handleTodoAction(e, getActiveTodos(), handleTodoToggle, handleTodoDelete, handleTodoEdit);
        });
    };
    
    const getActiveProject = () => {
        return projects.find(project => project.id === activeProjectId);
    };
    
    const getActiveTodos = () => {
        if (activeProjectId === '') {
            return null;
        }
    
        const activeProject = getActiveProject();
        return activeProject ? activeProject.todos : [];
    };
    
    const renderActiveTodos = () => {
        const todos = getActiveTodos();
        UI.renderTodos(todos);
    
        const addTodoBtn = document.querySelector('.add-todo-btn');
        if (activeProjectId === '') {
            addTodoBtn.disabled = true;
            addTodoBtn.classList.add('disabled');
        } else {
            addTodoBtn.disabled = false;
            addTodoBtn.classList.remove('disabled');
        }
    };
    
    const handleAddProject = () => {
        const { modal, form, cancelButton, input } = UI.createProjectForm();
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const projectName = input.value.trim();
            
            if (projectName) {
                const newProject = createProject(projectName);
                
                projects.push(newProject);

                activeProjectId = newProject.id;
                
                UI.renderProjects(projects, activeProjectId);
                renderActiveTodos();
                
                document.body.removeChild(modal);
            }
        });
        
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    };
    
    const handleAddTodo = () => {
        const { modal, form, cancelButton, titleInput, descTextarea, dateInput, prioritySelect } = UI.createTodoForm(activeProjectId);
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = titleInput.value.trim();
            
            if (title) {
                const newTodo = createTodo({
                    title,
                    description: descTextarea.value.trim(),
                    dueDate: dateInput.value || null,
                    priority: prioritySelect.value,
                    projectId: activeProjectId
                });
                
                const activeProject = getActiveProject();
                activeProject.todos.push(newTodo);
                
                renderActiveTodos();
                
                document.body.removeChild(modal);
            }
        });
        
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    };
    
    const handleProjectSelect = (projectId) => {
        activeProjectId = projectId;
        
        UI.renderProjects(projects, activeProjectId);
        renderActiveTodos();
    };
    
    const handleProjectDelete = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    
    const { modal, confirmButton, cancelButton } = UI.createConfirmationDialog(
        `Are you sure you want to delete "${project.name}"?`
    );
    
    confirmButton.addEventListener('click', () => {
        projects = projects.filter(p => p.id !== projectId);
        
        if (activeProjectId === projectId) {
            if (projects.length > 0) {
                activeProjectId = projects[0].id;
            } else {
                activeProjectId = '';
            }
        }
        
        UI.renderProjects(projects, activeProjectId);
        renderActiveTodos();
        
        document.body.removeChild(modal);
    });
    
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
};
    
    const handleTodoToggle = (todoId) => {
        const activeProject = getActiveProject();
        const todo = activeProject.todos.find(t => t.id === todoId);
    
        if (todo.completed) {
            return;
        }

        const todoElement = document.querySelector(`.todo[data-todo-id="${todoId}"]`);
        const checkbox = todoElement.querySelector('.todo-checkbox');
    
        const { modal, confirmButton, cancelButton } = UI.createConfirmationDialog(
            `Complete task: ${todo.title}?`
        );
    
        confirmButton.addEventListener('click', () => {
            todo.completed = true;
            todo.completedDate = new Date().toISOString();
        
            renderActiveTodos();
        
            document.body.removeChild(modal);
        });
    
        cancelButton.addEventListener('click', () => {
            checkbox.checked = false;
            document.body.removeChild(modal);
        });
    };

    const handleTodoEdit = (todoId) => {
        const activeProject = getActiveProject();
        const todo = activeProject.todos.find(t => t.id === todoId);

        const { modal, form, cancelButton, titleInput, descTextarea, dateInput, prioritySelect } = UI.createTodoEditForm(todo);

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            todo.description = descTextarea.value.trim();
            todo.priority = prioritySelect.value;
        
            todo.dueDate = dateInput.value || null;
        
            renderActiveTodos();
        
            document.body.removeChild(modal);
        });

        cancelButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    };
    
    const handleTodoDelete = (todoId) => {
        const activeProject = getActiveProject();
        const todo = activeProject.todos.find(t => t.id === todoId);
        
        const { modal, confirmButton, cancelButton } = UI.createConfirmationDialog(
            `Are you sure you want to delete "${todo.title}"?`
        );
        
        confirmButton.addEventListener('click', () => {
            activeProject.todos = activeProject.todos.filter(t => t.id !== todoId);
            
            renderActiveTodos();
            
            document.body.removeChild(modal);
        });
        
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    };
    
    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', App.init);