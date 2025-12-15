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

const handleChangePassword = (inputData) =>{
    return axios.put(`/api/users/profile/password`, inputData)
}


export { 
    getAllUsers,
    createNewUserService, 
    deleteUserService,
    editUserService,
    getAllCodeService,
    handleChangePassword,
}