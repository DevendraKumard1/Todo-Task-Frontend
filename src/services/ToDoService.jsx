import ApiService from "./ApiService";

class ToDoService {
  /**
   * Fetch todos with optional query parameters
   * @param {string} queryString
   * @returns {Promise}
   */
  getTodos(queryString = "") {
    const endPoint = "" + (queryString ? `?${queryString}` : "");
    const inputData = {
      endPoint: endPoint,
      addditionalHeaderData: {},
      postData: {},
    };
    return ApiService.getCall(inputData);
  }

  /**
   * Get list of assignees
   * @returns {Promise}
   */
  listAssignee() {
    const endPoint = "assignee";
    const inputData = {
      endPoint: endPoint,
      addditionalHeaderData: {},
      postData: {},
    };
    return ApiService.getCall(inputData);
  }

  /**
   * Create a new todo
   * @param {Object} data
   * @returns {Promise}
   */
  createTodo(data) {
    const endPoint = "todo";
    const inputData = {
      endPoint: endPoint,
      addditionalHeaderData: {},
      postData: data,
    };
    return ApiService.postCall(inputData);
  }

  /**
   * Get a specific todo by ID
   * @param {number} todo_id
   * @returns {Promise}
   */
  getTodoById(todo_id) {
    const endPoint = `todos/${todo_id}`;
    const inputData = {
      endPoint: endPoint,
      addditionalHeaderData: {},
      postData: {},
    };
    return ApiService.getCall(inputData);
  }

  /**
   * Update a todo by ID
   * @param {number} todo_id
   * @param {Object} data
   * @returns {Promise}
   */
  updateTodo(todo_id, data) {
    const endPoint = `todo/${todo_id}`;
    const inputData = {
      endPoint: endPoint,
      addditionalHeaderData: {},
      postData: data,
    };
    return ApiService.putCall(inputData);
  }

  /**
   * Revoke (undo delete) a todo
   * @param {number} todo_id
   * @returns {Promise}
   */
  revokeTodo(todo_id) {
    const endPoint = `todos/${todo_id}/revoke`;
    const inputData = {
      endPoint: endPoint,
      addditionalHeaderData: {},
      postData: {},
    };
    return ApiService.putCall(inputData);
  }
}

export default new ToDoService();
