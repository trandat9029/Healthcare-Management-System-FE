import actionTypes from '../actions/actionTypes';


const initialState = {
    genders: [],
    roles: [],
    positions: [],
    isLoadingGender: false,
    isLoadingPosition: false,
    isLoadingRole: false,
    users: [],
    total: 0,
    page: 1,
    limit: 10,
    topDoctors: [],
    allDoctors: [],
    infoDoctor: [],
    allScheduleTime: [],
    allRequiredDoctorInfo: [],
    specialties: [],
    specialtyTotal: 0,
    specialtyPage: 1,
    specialtyLimit: 10,
    clinics: [],
    clinicTotal: 0,
    clinicPage: 1,
    clinicLimit: 8,
    handbooks: [],
    handbookTotal: 0,
    handbookPage: 1,
    handbookLimit: 8,
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

        // USERS
            case actionTypes.FETCH_ALL_USERS_SUCCESS:
            return {
                ...state,
                users: action.payload.users,
                total: action.payload.total,
                page: action.payload.page,
                limit: action.payload.limit,
                
            };
            

            case actionTypes.FETCH_ALL_USERS_FAILED:
            return {
                ...state,
                users: [],
                total: 0,
            };
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
        return {
            ...state,
            allDoctors: action.payload.doctors,
            doctorTotal: action.payload.total,
            doctorPage: action.payload.page,
            doctorLimit: action.payload.limit,
        };

        case actionTypes.FETCH_All_DOCTORS_FAILED:
        return {
            ...state,
            allDoctors: [],
            doctorTotal: 0,
        };
        
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

        //get required doctor info
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS:
            state.allRequiredDoctorInfo = action.data;      
            return {
                ...state
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILED:
            state.allRequiredDoctorInfo = [];    
            return {
                ...state
            }

         // get all specialty   
        case actionTypes.FETCH_ALL_SPECIALTY_SUCCESS:
            return {
                ...state,
                specialties: action.payload.specialties,
                specialtyTotal: action.payload.total,
                specialtyPage: action.payload.page,
                specialtyLimit: action.payload.limit,
            };

        case actionTypes.FETCH_ALL_SPECIALTY_FAILED:
            return {
                ...state,
                specialties: [],
                specialtyTotal: 0,
            };
        
        case actionTypes.FETCH_ALL_CLINIC_SUCCESS:
        return {
            ...state,
            clinics: action.payload.clinics,
            clinicTotal: action.payload.total,
            clinicPage: action.payload.page,
            clinicLimit: action.payload.limit,
        };

        case actionTypes.FETCH_ALL_CLINIC_FAILED:
        return {
            ...state,
            clinics: [],
            clinicTotal: 0,
        };
        
        //HANDBOOK
        case actionTypes.FETCH_ALL_HANDBOOK_SUCCESS:
        return {
            ...state,
            handbooks: action.payload.handbooks,
            handbookTotal: action.payload.total,
            handbookPage: action.payload.page,
            handbookLimit: action.payload.limit,
        };

        case actionTypes.FETCH_ALL_HANDBOOK_FAILED:
        return {
            ...state,
            handbooks: [],
            handbookTotal: 0,
        };
        case actionTypes.DELETE_HANDBOOK_SUCCESS:
        return {
            ...state,
        };

        case actionTypes.DELETE_HANDBOOK_FAILED:
        return {
            ...state,
        };


        default:
            return state;
    }
}

export default adminReducer;