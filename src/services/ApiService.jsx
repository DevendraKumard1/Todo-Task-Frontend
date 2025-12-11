import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_ENDPOINT;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optionally: Response interceptor to handle global errors (logout on 401/429)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 429)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = "/logout";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
class ApiService {

    async getCall(inputData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        };

        // Merdge addition header data from request call
        if(Object.keys(inputData.addditionalHeaderData).length > 0) {
            axiosConfig = {...axiosConfig.headers,...inputData.addditionalHeaderData};
        }
        return axios.get(API_BASE_URL + inputData.endPoint, axiosConfig)
                    .then((res) => { 
                        return { 
                            status: res.status,
                            data: res.data,
                            message: res.data.message || ""
                        }
                    })

                    .catch((err) => {
                        if(err.response.status === 401 || err.response.status === 429){
                            return window.location.href = "/logout";
                        }else{
                            return { status: (err['response'] !== undefined) ? err.response.status : 503, message: (err['message'] !== undefined) ? err.message : 'Service Unavailable', data: (err.response.data) ? err.response.data : {} }
                        }
                    })
    }


    async postCallFormData(inputData) {
        const params = new URLSearchParams();
        params.append('username', inputData.postData.data.username);
        params.append('password', inputData.postData.data.password);

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        if (Object.keys(inputData.addditionalHeaderData).length > 0) {
            axiosConfig = {
                ...axiosConfig,
                ...{ headers: { ...axiosConfig.headers, ...inputData.addditionalHeaderData } }
            };
        }

        return axios.post(API_BASE_URL + inputData.endPoint, params, axiosConfig)
            .then(res => {
                return { status: res.status, message: res.data.message, data: {
                            ...res.data.result,
                            access_token: res.data.access_token
                        } 
                    };
            })
            .catch(err => {
                if (err.response && (err.response.status === 401 || err.response.status === 429)) {
                    window.location.href = "/logout";
                } else {
                    return {
                        status: err.response ? err.response.status : 503,
                        message: err.message ? err.message : 'Service Unavailable',
                        data: err.response && err.response.data ? err.response.data : {}
                    };
                }
            });
    }

    async postCall(inputData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        };

        // Merdge addition header data from request call
        if(Object.keys(inputData.addditionalHeaderData).length > 0) {
            axiosConfig = {...axiosConfig.headers,...inputData.addditionalHeaderData};
        }
        
        return axios.post(API_BASE_URL + inputData.endPoint, inputData.postData, axiosConfig)
                    .then((res) => {
                        return { status: res.status, message: res.data.message, data: res.data.result }
                    })
                    .catch((err) => {
                        if(err.response.status === 401 || err.response.status === 429){
                            return window.location.href = "/logout";
                        }else{
                            return { status: (err['response'] !== undefined) ? err.response.status : 503, message: (err['message'] !== undefined) ? err.message : 'Service Unavailable', data: (err.response.data) ? err.response.data : {} }
                        }
                    })
    }

    async putCall(inputData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        };

        // Merdge addition header data from request call
        if(Object.keys(inputData.addditionalHeaderData).length > 0) {
            axiosConfig = {...axiosConfig.headers,...inputData.addditionalHeaderData};
        }

        return axios.put(API_BASE_URL + inputData.endPoint, inputData.postData, axiosConfig)
                    .then((res) => {
                        return { status: res.status, message: res.data.message, data: res.data.result }
                    })
                    .catch((err) => {
                        if(err.response.status === 401 || err.response.status === 429){
                            return window.location.href = "/logout";
                        }else{
                            return { status: (err['response'] !== undefined) ? err.response.status : 503, message: (err['message'] !== undefined) ? err.message : 'Service Unavailable', data: (err.response.data) ? err.response.data : {} }
                        }
                    })
    }

    async deleteCall(inputData) {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        };

        // Merdge addition header data from request call
        if(Object.keys(inputData.addditionalHeaderData).length > 0) {
            axiosConfig = {...axiosConfig.headers,...inputData.addditionalHeaderData};
        }
        
        return axios.delete(API_BASE_URL + inputData.endPoint, axiosConfig)
                    .then((res) => {
                        return { status: res.status, message: res.data.message, data: res.data.result }
                    })
                    .catch((err) => {
                        if(err.response.status === 401 || err.response.status === 429){
                            return window.location.href = "/logout";
                        }else{
                            return { status: (err['response'] !== undefined) ? err.response.status : 503, message: (err['message'] !== undefined) ? err.message : 'Service Unavailable', data: (err.response.data) ? err.response.data : {} }
                        }
                    })
    }
}

export default new ApiService()