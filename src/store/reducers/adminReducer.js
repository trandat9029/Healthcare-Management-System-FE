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
    allDoctors: [],
    infoDoctor: [],
    allScheduleTime: [],

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

        //get all doctors
        case actionTypes.FETCH_All_DOCTORS_SUCCESS:
            state.allDoctors = action.dataDr;    
            return {
                ...state
            }
        case actionTypes.FETCH_All_DOCTORS_FAILED:
            state.allDoctors = [];    
            return {
                ...state
            }
        
        // get info detail doctor    
        // case actionTypes.FETCH_INFO_DETAIL_DOCTORS_SUCCESS:
        //     state.infoDoctor = action.data;
        //     return{
        //         ...state
        //     }  
        // case actionTypes.FETCH_INFO_DETAIL_DOCTORS_FAILED:
        //     state.infoDoctor = [];    
        //     return {
        //         ...state
        //     }    
            
        //get schedule doctor
        case actionTypes.FETCH_AllCODE_SCHEDULE_TIME_SUCCESS:
            state.allScheduleTime = action.dataTime;    
            return {
                ...state
            }
        case actionTypes.FETCH_AllCODE_SCHEDULE_TIME_FAILED:
            state.allScheduleTime = [];    
            return {
                ...state
            }

        default:
            return state;
    }
}

export default adminReducer;