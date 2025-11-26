import axios from "../axios";

const handleCreateHandbook =(data) =>{
    return axios.post(`/api/handbook/`, data)
}


export { 
    
    handleCreateHandbook,
}