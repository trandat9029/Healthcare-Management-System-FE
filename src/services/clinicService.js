import axios from "../axios";

const createNewClinicService = (data) =>{
    return axios.post(`/api/clinics/`, data)
}

const getAllClinicService = (params) => {
  return axios.get('/api/clinics/', {params });
};

const getAllDetailClinicByIdService = (data) =>{
    return axios.get(`/api/clinics/detail?id=${data.id}`)
} 

const handleUpdateClinic = (inputData) =>{
    return axios.put(`/api/clinics/`, inputData)
}

const handleDeleteClinic = (id) => {
    return axios.delete('/api/clinics/', {
        data: { id },
    });
};


export { 
    createNewClinicService,
    getAllClinicService,     
    getAllDetailClinicByIdService,
    handleUpdateClinic,
    handleDeleteClinic
}