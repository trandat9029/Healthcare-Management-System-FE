import axios from "../axios";

const getTopDoctorHomeService = (limit) =>{
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}   
const getAllDoctorsService = (params) => {
  return axios.get('/api/doctors/all', { params });
};
const saveDetailDoctorService = (data) =>{
    return axios.post(`/api/save-info-doctors`, data)
}

const getDetailInfoDoctorService = (inputId) =>{
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const saveBulkScheduleDoctorService = (data) =>{
    return axios.post(`/api/schedule`, data)
}

const getScheduleDoctorByDate = (doctorId, date) =>{
    return axios.get(`/api/get-schedule-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtraInfoDoctorByIdService = (doctorId) =>{
    return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`)
}
const getProfileDoctorByIdService = (doctorId) =>{
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookAppointmentService = (data) =>{
    return axios.post(`/api/booking`, data)
}

const postVerifyBookAppointmentService = (data) =>{
    return axios.post(`/api/booking/verify-booking`, data)
}


const getAllPatientForDoctorService = (data) =>{
    return axios.get(`/api/patients?doctorId=${data.doctorId}&date=${data.date}`)
} 

const postSendRemedy = (data) =>{
    return axios.post(`/api/send-remedy`, data)
}

const handleGetAllSchedule = (params) => {
    return axios.get('/api/schedule/all', { params });
}

const handleGetAllBooking = (params) => {
    return axios.get('/api/booking/', { params });
}

const handleGetScheduleByDoctor = (params) => {
    return axios.get('/api/schedule/', { params });
}

// const getSchedules = (params) => {
//   return axios.get('/api/schedule', { params });
// };


export { 
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
    getAllPatientForDoctorService,
    postSendRemedy,
    handleGetAllSchedule,
    handleGetAllBooking,
    // getSchedules,
    handleGetScheduleByDoctor,
}