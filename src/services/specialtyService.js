import axios from "../axios";

// const handleCreateHandbook =(data) =>{
//     return axios.post(`/api/handbook/`, data)
// }

// const handleGetAllHandbook = (page, limit, sortBy, sortOrder) => {
//     return axios.get('/api/handbook/all', {
//         params: {
//             page,
//             limit,
//             sortBy,
//             sortOrder,
//         },
//     });
// };
// const handleGetDetailHandbookById = (inputId) => {
//     return axios.get(`/api/handbook/detail?id=${inputId}`);
// };


const createNewSpecialtyService = (data) =>{
    return axios.post(`/api/specialties/`, data)
}

const getAllSpecialtyService = (params) => {
    return axios.get('/api/specialties/', { params });
};

const getAllDetailSpecialtyByIdService = (data) =>{
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
} 

const handleDeleteSpecialty = (id) => {
    return axios.delete('/api/specialties/', {
        data: { id },
    });
};


const handleEditSpecialty = (data) => {
    return axios.put('/api/specialties/', data);
};






export { 
    // handleGetAllHandbook,
    // handleCreateHandbook,
    handleDeleteSpecialty,
    handleEditSpecialty,
    createNewSpecialtyService,
    getAllSpecialtyService,
    getAllDetailSpecialtyByIdService,

    // handleGetListPostHandbook,
    // handleGetDetailHandbookById,
}