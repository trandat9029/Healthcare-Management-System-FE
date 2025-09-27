import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) =>{
    return axios.post('/api/login', {email: userEmail, password: userPassword});
}

const getAllUsers = (inputId) =>{
    return axios.get(`/api/get-all-users?id=${inputId}`, {id: inputId})
}
 
const createNewUserService = (data) =>{ 
    return axios.post('/api/create-new-user', data);
}

const deleteUserService = (userId) =>{
    return axios.delete(`/api/delete-user`,{
        data: {
            id: userId
        }
    })
}

const editUserService = (inputData) =>{
    return axios.put(`/api/edit-user`, inputData)
}

const getAllCodeService = (inputType) =>{
    return axios.get(`/api/allcode?type=${inputType}`)
}

const getTopDoctorHomeService = (limit) =>{
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}   
const getAllDoctorsService = (limit) =>{
    return axios.get(`/api/get-all-doctors`)
}   

const saveDetailDoctorService = (data) =>{
    return axios.post(`/api/save-info-doctors`, data)
}

const getDetailInfoDoctorService = (inputId) =>{
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const saveBulkScheduleDoctorService = (data) =>{
    return axios.post(`/api/bulk-create-schedule`, data)
}

const getScheduleDoctorByDate = (doctorId, date) =>{
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtraInfoDoctorByIdService = (doctorId) =>{
    return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`)
}
const getProfileDoctorByIdService = (doctorId) =>{
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookAppointmentService = (data) =>{
    return axios.post(`/api/patient-book-appointment`, data)
}

export { 
    handleLoginApi,
    getAllUsers,
    createNewUserService, 
    deleteUserService,
    editUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctorsService,
    saveDetailDoctorService,
    getDetailInfoDoctorService,
    saveBulkScheduleDoctorService,
    getScheduleDoctorByDate,
    getExtraInfoDoctorByIdService,
    getProfileDoctorByIdService,
    postPatientBookAppointmentService,
    

}