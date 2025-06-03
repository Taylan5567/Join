/**
 * Generates the HTML template for the board page.
 * 
 * The template consists of a main content section with a heading and several columns.
 * Each column represents a different task status: "To do", "In progress", "Await feedback", and "Done".
 * The heading includes a search input for filtering tasks and a button to add new tasks.
 * Tasks can be dragged and dropped between columns.
 * 
 * @returns {string} The HTML template for the board page.
 */

function boardTemplate() {
    return `
    <div class="mainContent">
    <div class="contentHeading">
        <div class="contentHeadingMain">
            <div class="contentHeadingSmall">
                <div>
                    <h2 class="contentHeadingH2">Board</h2>
                </div>
            </div>
            <div class="contentHeadingOrder">
                    <div class="contentHeadingSearchMain">
                        <input oninput="searchTask()" class="contentHeadingSearch" type="search" id="search" placeholder="Search Task">
                        <div class="contentHeadingSearchStrich"></div>
                        <div class="contentHeadingSearchImg"></div>
                    </div>
                        <div class="contentHeadingRight">
                    <div>
                        <Button id="addTaskButton" class="addTaskButton" onclick="getToDoButton()">
                            <p class="addTaskButtonText">Add Task</p>
                            <img class="addTaskButtonImg" src="../assets/svg/add_task/add_task.svg" alt="">
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="contentBoard">
        <div class="board">
            <div class="boardColumn">
                <div class="boardColumnHeader">
                    <h3 class="boardColumnHeaderH3">To do</h3>
                    <p onclick="getToDoButton()" class="boardAddTaskText">+</p>
                </div>
                <div class="boardDropDown" ondrop="drop(event, 'ToDo')" ondragover="allowDrop(event)">
                    <div id="tasksContainerToDo"></div>
                </div>
            </div>
            <div class="boardColumn">
                <div class="boardColumnHeader">
                    <h3 class="boardColumnHeaderH3">In progress</h3>
                    <p onclick="getInProgressButton()" class="boardAddTaskText">+</p>
                </div>
                <div class="boardDropDown" ondrop="drop(event, 'InProgress')" ondragover="allowDrop(event)">
                    <div id="tasksContainerInProgress"></div>
                </div>
            </div>
            <div class="boardColumn">
                <div class="boardColumnHeader">
                    <h3 class="boardColumnHeaderH3">Await feedback</h3>
                    <p onclick="getAwaitFeedbackButton()" class="boardAddTaskText">+</p>
                </div>
                <div class="boardDropDown" ondrop="drop(event, 'AwaitFeedback')" ondragover="allowDrop(event)">
                    <div id="tasksContainerAwaitFeedback"></div>
                </div>
            </div>
            <div class="boardColumn">
                <div class="boardColumnHeader">
                    <h3 class="boardColumnHeaderH3">Done</h3>
                </div>
                <div class="boardDropDown" ondrop="drop(event, 'Done')" ondragover="allowDrop(event)">
                    <div id="tasksContainerDone"></div>
                </div>
            </div>
        </div>
    </div>
</div>
`
}


/**
 * Generates the HTML template for the task overlay.
 * @returns {string} the HTML template for the task overlay
 */
function boardAddTaskTemplate() {
    return `
<section>
<form id="add-task-form" onsubmit="event.preventDefault(); postTask();">
        <form id="add-task-form" onsubmit="event.preventDefault(); postTask();">
        <section class="add_task_form_box">
            <div class="add_task_left_box addTaskLeftBoxBoard">
                <div class="gap_8">
                    <label for="task-title">Title <span class="red_star">*</span></label>
                    <input maxlength="30" type="text" id="task-title" name="title" placeholder="Enter a title" required>
                </div>
                <div class="gap_8">
                    <label for="task-desc">Description</label>
                    <textarea maxlength="150" id="task-desc" name="description" placeholder="Enter a Description"></textarea>
                </div>
                <div class="gap_8">
                    <label for="task-assigned">Assigned to</label>
                    <div id="task-assigned" style="border: 1px solid #ccc; padding: 10px;"></div>
                </div>
            </div>
            <div class="add_task_mid_box">
                <img src="../assets/svg/add_task/add_tastk_vertical_line.svg" alt="">
            </div>
            <div class="add_task_right_box">
                <div class="gap_8">
                    <label for="task-date">Due Date <span class="red_star">*</span></label>
                    <input type="date" class="task-date" id="task-date" name="dueDate" required>
                </div>
                <div class="gap_8">
                    <p class="prio_text">Prio</p>
                    <div id="task-priority">
                        <button type="button" class="prio-btn urgent" data-prio="urgent">Urgent <img
                                src="../assets/svg/add_task/prio_urgent.svg" alt=""></button>
                        <button type="button" class="prio-btn medium" data-prio="medium">Medium <img
                                src="../assets/svg/add_task/prio_medium.svg" alt=""></button>
                        <button type="button" class="prio-btn low" data-prio="low">Low <img
                                src="../assets/svg/add_task/prio_low.svg" alt=""></button>
                    </div>
                </div>
                    <div class="dropdown-container">
                        <div class="gap_8">
                            <label for="task-category">Category <span class="red_star">*</span></label>
                                <div class="dropdown-container">
                                    <div class="custom-dropdown" id="dropdown-toggle-category"
                                        onclick="toggleDropdown(event, this, document.getElementById('dropdown-options-category'))">
                                        <span>Select task category</span>
                                        <div class="dropdown-arrow"></div>
                                    </div>
                                    <ul required class="dropdown-options hidden" id="dropdown-options-category">
                                        <li class="dropdown-option" data-category="User Story"
                                            onclick="selectDropdownOption(event, document.getElementById('dropdown-toggle-category'), this)">
                                            User Story</li>
                                        <li class="dropdown-option" data-category="Technical Task"
                                            onclick="selectDropdownOption(event, document.getElementById('dropdown-toggle-category'), this)">
                                            Technical Task
                                        </li>
                                    </ul>
                                </div>
                            <span id="category-error" class="error-message hidden">Please select a category</span>
                        </div>
                    </div>
                <div class="gap_8">
                    <label for="task-subtasks">Subtasks</label>
                    <div id="subtask-container">
                        <input maxlength="40" type="text" id="new-subtask" placeholder="Add new subtask">
                        <img id="clear-subtask" class="d-none" src="../assets/svg/add_task/closeXSymbol.svg" alt="">
                        <img id="add-subtask" src="../assets/svg/add_task/add+symbol.svg" alt="">
                    </div>
                    <ul id="subtask-list">
                    </ul>
                </div>
            </div>
        </section>
        <div class="add_task_required_info_box_overlay">
            <div>
                <span class="add_task_required_info">
                <span class="red_star">*</span>
                    This field is required
                </span>
            </div>
            <div class="addTaskBottomBox">
                <button type="submit" id="addTaskButton" class="addTaskButton">
                    <p class="addTaskButtonText">Add Task</p>
                    <img class="addTaskButtonImgBottomBox" src="../assets/svg/add_task/check.svg" alt="">
                </button>
                <button type="button" id="cancelTaskButton" class="cancelAddTaskButton" onclick="closeBoardAddTask()">
                    <p class="cancelTaskButtonText">Cancel X</p>
                </button>
            </div>
        </div>
    </form>
</section>
`
}


/**
 * Generates the HTML template for the task overlay.
 * @param {Object} task the task for which the overlay is generated
 * @param {string} taskId the id of the task
 * @returns {string} the HTML template for the task overlay
 */
function taskOverlayTemplate(task, taskId) {
    return `
    <div class="openTaskOverlayMain">
        <div class="openTaskOverlayContent">
            <div id="openTaskSwitchOverlay"></div>
            <button class="taskSwitchCancel" id="taskSwitchCancelMain" onclick="event.stopPropagation(), closeTaskOverlay('${taskId}')"><img src="../assets/svg/add_task/closeXSymbol.svg" alt=""></button> 
            ${taskCategoryTemplate(task, taskId)}
            ${taskTitleTemplate(task)}
            ${taskDescriptionTemplate(task)}
            <div class="openTaskOverlayDateContainer">
                Due Date: ${taskDateTemplate(task)}
            </div>
            <div class="openTaskOverlayPriorityContainer">
                Priority: ${taskPriorityTemplateName(task)}
            </div>
            <div class="openTaskOverlayAssignedContainer">
                Assigned to: ${taskAssignedTemplateOverlay(task)}
            </div>
            ${taskStatusTemplate(task)}
            ${taskSubtasksTemplateOverlay(task, taskId)}
        </div>
        <div class="openTaskOverlayButtonContainer">
            <button class="openTaskOverlayDeleteButton" onclick="deleteTask('${taskId}')"><img src="../assets/svg/delete.svg" alt=""> Delete</button>
            <img src="../assets/svg/balken.svg"></img>
            <button class="openTaskOverlayEditButton" onclick="editTask('${taskId}')"><img src="../assets/svg/edit.svg" alt=""> Edit</button>
        </div>
    </div>
    `;
}


/**
 * Generates the HTML template for the task edit overlay.
 * @param {Object} task the task for which the overlay is generated
 * @param {string} taskId the id of the task
 * @returns {string} the HTML template for the task edit overlay
 */
function taskEditTemplate(task, taskId) {
    return `
    <div class="openEditTaskOverlayMain">
        <div class="openEditTaskOverlayContent">
            ${taskEditTitle(task, taskId)}
            ${taskEditDescription(task, taskId)}
            ${taskEditDate(task, taskId)}
            <div class="openEditTaskOverlayPriority">
                ${taskEditPriority(task, taskId)}
            </div>
            <div class="openEditTaskOverlayAssigned">
                ${taskEditAssignedTo(task, taskId)}
            </div>
            <div class="openEditTaskOverlaySubtasks">
                ${taskEditSubtasks(task, taskId)}
            </div>
        </div>
        <div class="openEditTaskSaveButtonSorting">
            <button class="openEditTaskSaveButton" onclick="saveTask('${taskId}')">Ok<img src="../assets/svg/add_task/check.svg" alt=""></button>
        </div>
    </div>
    `;
}