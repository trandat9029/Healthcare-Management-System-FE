import axios from "../axios";



const getAllUsers = (params) => {
    return axios.get('/api/users', {
        params,
    });
};

 
const createNewUserService = (data) =>{ 
    return axios.post('/api/users', data);
}

const deleteUserService = (userId) =>{
    return axios.delete(`/api/users`,{
        data: {
            id: userId
        }
    })
}

const editUserService = (inputData) =>{
    return axios.put(`/api/users`, inputData)
}

const getAllCodeService = (inputType) =>{
    return axios.get(`/api/allCode?type=${inputType}`)
}



const getHistoriesByEmail = (email, page = 1, limit = 10) => {
  return axios.get(`/api/booking/histories`, {
    params: {
      email,
      page,
      limit,
    },
  });
};

const postSendEmailCancelBookedService = (data) => {
  return axios.post('/api/booking/cancel', data);
};

const postVerifyCancelBookedService = (data) => {
  return axios.post('/api/booking/cancel/verify', data);
};


export { 

    getAllUsers,
    createNewUserService, 
    deleteUserService,
    editUserService,
    getAllCodeService,
    getHistoriesByEmail,
    postSendEmailCancelBookedService,
    postVerifyCancelBookedService 
}