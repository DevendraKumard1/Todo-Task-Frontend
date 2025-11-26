import ApiService from "./ApiService";

class AssigneeService {
  getAssignee(queryString) {
    let endPoint = "assignee" + (queryString ? '?' + queryString : '');
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

}
export default new AssigneeService();
