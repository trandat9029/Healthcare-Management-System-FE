import axios from "../axios";

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

const handleGetPatientByClinic = (params) =>{
    return axios.get('api/patients/patient-by-clinic', {params})
}


// booking
const postSendRemedy = (data) =>{
    return axios.post(`/api/booking/send-remedy`, data)
}

const updateProfileDoctorService = (data) => {
    return axios.post('/api/doctors/profile', data);
};

const handleGetStatisticalBooking = (params) =>{
    return axios.get('/api/booking/statistical', {params})
}



export { 
    getAllPatientForDoctorService,
    postSendRemedy,
    updateProfileDoctorService,
    getAllPatientsService,
    handleGetStatisticalBooking,
    handleGetPatientByClinic,
    
}