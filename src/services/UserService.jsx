import ApiService from "./ApiService";

export const userLogin = (data) => {
  const inputData = {
    endPoint: "login",
    addditionalHeaderData: {},
    postData: {data},
  };
  return ApiService.postCallFormData(inputData);
};