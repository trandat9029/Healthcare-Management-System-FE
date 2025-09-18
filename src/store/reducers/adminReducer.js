import actionTypes from '../actions/actionTypes';


const initialState = {
    genders: [],
    roles: [],
    positions: [],
    isLoadingGender: false,
    isLoadingPosition: false,
    isLoadingRole: false,
    users: [],
    topDoctors: [],
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        // GENDER
        case actionTypes.FETCH_GENDER_START:
            let copyState = { ...state};
            copyState.isLoadingGender = true;
            return {
                ...copyState,
                
            }
        case actionTypes.FETCH_GENDER_SUCCESS: 
            state.genders = action.data;
            state.isLoadingGender = false;
            return {
                ...state,
                
            }
        case actionTypes.FETCH_GENDER_FAILED: 
            state.isLoadingGender = false;
            state.genders = [];
            return {
                ...state,
                
            }   
            
        // POSITION
        case actionTypes.FETCH_POSITION_START: 
            state.isLoadingPosition = true;
            return {
                ...state,
                
            }
        case actionTypes.FETCH_POSITION_SUCCESS: 
            state.positions = action.data;
            state.isLoadingPosition = false;
            return {
                ...state,
                
            }
        case actionTypes.FETCH_POSITION_FAILED: 
            state.isLoadingPosition = false;
            state.positions = [];       
            return {
                ...state,
                
            } 

        //ROLE   
        case actionTypes.FETCH_ROLE_START: 
            state.isLoadingRole = true;            
            return {
                ...state,
                
            }
        case actionTypes.FETCH_ROLE_SUCCESS: 
            state.roles = action.data;
            state.isLoadingRole = false;
            return {
                ...state,
                
            }
        case actionTypes.FETCH_ROLE_FAILED: 
            state.isLoadingRole = false;
            state.roles = [];        
            return {
                ...state,
                
            }  

        // get all users
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            state.users = action.users;        
            return {
                ...state,
                
            }
        case actionTypes.FETCH_ALL_USERS_FAILED:
            state.users = [];        
            return {
                ...state,
                
            }
        // get top doctors
        case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
            state.topDoctors = action.dataDoctors;        
            return {
                ...state,
                
            }
        case actionTypes.FETCH_TOP_DOCTORS_FAILED:
            state.users = [];        
            return {
                ...state,
                
            }
        default:
            return state;
    }
}

export default adminReducer;