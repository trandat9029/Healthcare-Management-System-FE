import axios from "../axios";

const postPatientBookAppointmentService = (data) =>{
    return axios.post(`/api/booking`, data)
}

const postVerifyBookAppointmentService = (data) =>{
    return axios.post(`/api/booking/verify-booking`, data)
}

const handleGetAllBooking = (params) => {
    return axios.get('/api/booking', { params });
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
    getHistoriesByEmail,
    postSendEmailCancelBookedService,
    postVerifyCancelBookedService,
    postPatientBookAppointmentService,
    postVerifyBookAppointmentService,
    handleGetAllBooking,
}