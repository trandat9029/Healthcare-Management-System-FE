import axios from "../axios";

const handleCreateHandbook =(data) =>{
    return axios.post(`/api/handbook/`, data)
}

const handleGetAllHandbook = (page, limit, sortBy, sortOrder) => {
    return axios.get('/api/handbook/all', {
        params: {
            page,
            limit,
            sortBy,
            sortOrder,
        },
    });
};

const handleDeleteHandbook = (id) => {
    return axios.delete('/api/handbook/', {
        data: { id },
    });
};

const handlePostHandbook = (data) => {
    return axios.put('/api/handbook/posting', data);
};

const handleEditHandbook = (data) => {
    return axios.put('/api/handbook/', data);
};

const handleGetListPostHandbook = (page, limit, sortBy, sortOrder) => {
    return axios.get('/api/handbook/list_posted', {
        params: {
            page,
            limit,
            sortBy,
            sortOrder,
        },
    });
};

const handleGetDetailHandbookById = (inputId) => {
    return axios.get(`/api/handbook/detail?id=${inputId}`);
};


export { 
    handleGetAllHandbook,
    handleCreateHandbook,
    handleDeleteHandbook,
    handlePostHandbook,
    handleEditHandbook,
    handleGetListPostHandbook,
    handleGetDetailHandbookById,
}