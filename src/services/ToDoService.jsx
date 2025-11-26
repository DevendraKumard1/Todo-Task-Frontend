import ApiService from "./ApiService";

class ToDoService {
    getTodos(queryString) {
        let endPoint = "" + (queryString ? '?' + queryString : '');
        let addditionalHeaderData = {};
        let postData = {};

        let inputData = {
            endPoint: endPoint,
            addditionalHeaderData: addditionalHeaderData,
            postData: postData,
        };

        let response = ApiService.getCall(inputData);
        return response;
    }

    createTodo(data) {
        let endPoint = "todo";
        let addditionalHeaderData = {};
        let postData = data;

        let inputData = {
            endPoint: endPoint,
            addditionalHeaderData: addditionalHeaderData,
            postData: postData,
        };

        let response = ApiService.postCall(inputData);

        return response;
    }
}
export default new ToDoService();
