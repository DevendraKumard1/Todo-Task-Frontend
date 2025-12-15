import ApiService from "./ApiService";

/**
 * --------------------------------------------------
 * LIST TODOS (with filters + pagination)
 * --------------------------------------------------
 */
export const getTodos = (queryString = "") => {
  const endPoint = "todo/list" + (queryString ? `?${queryString}` : "");

  return ApiService.getCall({
    endPoint,
    addditionalHeaderData: {},
    postData: {},
  });
};

/**
 * --------------------------------------------------
 * LIST ASSIGNEES
 * --------------------------------------------------
 */
export const listAssignee = () => {
  return ApiService.getCall({
    endPoint: "assignee",
    addditionalHeaderData: {},
    postData: {},
  });
};

/**
 * --------------------------------------------------
 * CREATE TODO
 * --------------------------------------------------
 */
export const createTodo = (data) => {
  return ApiService.postCall({
    endPoint: "todo",
    addditionalHeaderData: {},
    postData: data,
  });
};

/**
 * --------------------------------------------------
 * GET TODO BY UUID ✅
 * --------------------------------------------------
 */
export const getTodoByUuid = (todo_uuid) => {
  return ApiService.getCall({
    endPoint: `todo/${todo_uuid}`,
    addditionalHeaderData: {},
    postData: {},
  });
};

/**
 * --------------------------------------------------
 * UPDATE TODO BY UUID ✅
 * --------------------------------------------------
 */
export const updateTodo = (todo_uuid, data) => {
  return ApiService.putCall({
    endPoint: `todo/${todo_uuid}`,
    addditionalHeaderData: {},
    postData: data,
  });
};

/**
 * --------------------------------------------------
 * DELETE TODO BY UUID (SOFT DELETE) ✅
 * --------------------------------------------------
 */
export const deleteTodo = (todo_uuid) => {
  return ApiService.deleteCall({
    endPoint: `todo/${todo_uuid}`,
    addditionalHeaderData: {},
    postData: {},
  });
};

/**
 * --------------------------------------------------
 * REVOKE TODO BY UUID ✅
 * --------------------------------------------------
 */
export const revokeTodo = (todo_uuid) => {
  return ApiService.putCall({
    endPoint: `todo/${todo_uuid}/revoke`,
    addditionalHeaderData: {},
    postData: {},
  });
};
