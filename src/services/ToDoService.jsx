import ApiService from "./ApiService";

export const getTodos = (queryString = "") => {
  const endPoint = "todo/list" + (queryString ? `?${queryString}` : "");
  const inputData = {
    endPoint,
    addditionalHeaderData: {},
    postData: {},
  };
  return ApiService.getCall(inputData);
};

export const listAssignee = () => {
  const inputData = {
    endPoint: "assignee",
    addditionalHeaderData: {},
    postData: {},
  };
  return ApiService.getCall(inputData);
};

export const createTodo = (data) => {
  const inputData = {
    endPoint: "todo",
    addditionalHeaderData: {},
    postData: data,
  };
  return ApiService.postCall(inputData);
};

export const getTodoById = (todo_id) => {
  const inputData = {
    endPoint: `todo/${todo_id}`,
    addditionalHeaderData: {},
    postData: {},
  };
  return ApiService.getCall(inputData);
};

export const updateTodo = (todo_id, data) => {
  const inputData = {
    endPoint: `todo/${todo_id}`,
    addditionalHeaderData: {},
    postData: data,
  };
  return ApiService.putCall(inputData);
};

export const revokeTodo = (todo_id) => {
  const inputData = {
    endPoint: `todo/${todo_id}/revoke`,
    addditionalHeaderData: {},
    postData: {},
  };
  return ApiService.putCall(inputData);
};
