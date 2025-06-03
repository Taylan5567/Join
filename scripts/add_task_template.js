/**
 * Generates the HTML template for a single subtask in the 'Add Task' view.
 * @param {string} task the text of the subtask
 * @returns {string} the HTML template for the subtask
 */
function createSubtaskHTML(task) {
    return `
    <div>
    <span class="subtask-marker">• </span>${task}
    </div>
        <div class="subtask-controls">
            <img src="../assets/svg/summary/pencil2.svg" alt="Edit" class="subtask-edit">
            <img src="../assets/svg/add_task/trash.svg" alt="Delete" class="subtask-trash">
            <img src="../assets/svg/add_task/check_create_task.svg" alt="Save" class="subtask-check d-none">
        </div>`;
}