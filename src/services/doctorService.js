import axios from "../axios";

// Doctor
const getTopDoctorHomeService = (limit) =>{
    return axios.get(`/api/doctors/out-standing?limit=${limit}`)
}   
const getAllDoctorsService = (params) => {
  return axios.get('/api/doctors/all', { params });
};
const saveDetailDoctorService = (data) =>{
    return axios.post(`/api/doctors`, data)
}

const getDetailInfoDoctorService = (inputId) =>{
    return axios.get(`/api/doctors/detail?id=${inputId}`)
}

const getExtraInfoDoctorByIdService = (doctorId) =>{
    return axios.get(`/api/doctors/extra-info?doctorId=${doctorId}`)
}
const getProfileDoctorByIdService = (doctorId) =>{
    return axios.get(`/api/doctors/profile?doctorId=${doctorId}`)
}

//Schedule
const saveBulkScheduleDoctorService = (data) =>{
    return axios.post(`/api/schedule`, data)
}

const getScheduleDoctorByDate = (doctorId, date) =>{
    return axios.get(`/api/schedule/schedule-by-date?doctorId=${doctorId}&date=${date}`)
}

const handleGetAllSchedule = (params) => {
    return axios.get('/api/schedule/all', { params });
}

const handleGetScheduleByDoctor = (params) => {
    return axios.get('/api/schedule', { params });
}

//Patient
const getAllPatientForDoctorService = (data) =>{
    return axios.get('/api/patients', {
        params: {
            doctorId: data.doctorId,
            date: data.date,
            timeType: data.timeType || '',
            statusId: data.statusId || '',
            keyword: data.keyword || '',
        },
    });
} 

const getAllPatientsService = (params) => {
  return axios.get('/api/patients/all', { params });
};


// booking
const postSendRemedy = (data) =>{
    return axios.post(`/api/booking/send-remedy`, data)
}

const updateProfileDoctorService = (data) => {
    return axios.put('/api/doctors/profile', data);
};



export { 
    getTopDoctorHomeService,
    getAllDoctorsService,
    saveDetailDoctorService,
    getDetailInfoDoctorService,
    saveBulkScheduleDoctorService,
    getScheduleDoctorByDate,
    getExtraInfoDoctorByIdService,
    getProfileDoctorByIdService,
    getAllPatientForDoctorService,
    postSendRemedy,
    handleGetAllSchedule,
    // getSchedules,
    handleGetScheduleByDoctor,
    updateProfileDoctorService,
    getAllPatientsService
}