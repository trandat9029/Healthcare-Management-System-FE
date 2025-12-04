import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) =>{
    return axios.post('/api/login', {email: userEmail, password: userPassword});
}

const getAllUsers = (params) => {
    return axios.get('/api/get-all-users', {
        params,
    });
};

 
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
    return axios.get(`/api/allCode?type=${inputType}`)
}

const getTopDoctorHomeService = (limit) =>{
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}   
const getAllDoctorsService = (params) => {
  return axios.get('/api/get-all-doctors', { params });
};
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

const postVerifyBookAppointmentService = (data) =>{
    return axios.post(`/api/verify-book-appointment`, data)
}

const createNewSpecialtyService = (data) =>{
    return axios.post(`/api/create-new-specialty`, data)
}

const getAllSpecialtyService = (params) => {
    return axios.get('/api/get-specialty', { params });
};

const getAllDetailSpecialtyByIdService = (data) =>{
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
} 

const createNewClinicService = (data) =>{
    return axios.post(`/api/create-new-clinic`, data)
}

const getAllClinicService = (params) => {
  return axios.get('/api/get-clinic', {params });
};

const getAllDetailClinicByIdService = (data) =>{
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`)
} 

const getAllPatientForDoctorService = (data) =>{
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
} 

const postSendRemedy = (data) =>{
    return axios.post(`/api/send-remedy`, data)
}


const handleUpdateClinic = (inputData) =>{
    return axios.put(`/api/clinics/`, inputData)
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
    postVerifyBookAppointmentService,
    createNewSpecialtyService,
    getAllSpecialtyService,
    getAllDetailSpecialtyByIdService,
    createNewClinicService,
    getAllClinicService,     
    getAllDetailClinicByIdService,
    getAllPatientForDoctorService,
    postSendRemedy,
    handleUpdateClinic,
    getHistoriesByEmail,
    postSendEmailCancelBookedService,
    postVerifyCancelBookedService 
}