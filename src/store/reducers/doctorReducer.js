import actionTypes from '../actions/actionTypes';


const initialState = {
    
    users: [],
    total: 0,
    page: 1,
    limit: 10,
    topDoctors: [],
    allDoctors: [],
    infoDoctor: [],
    allScheduleTime: [],
    allRequiredDoctorInfo: [],
    schedules: [],
    scheduleTotal: 0,
    schedulePage: 1,
    scheduleLimit: 10,

}

const doctorReducer = (state = initialState, action) => {
    switch (action.type) {
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
        
            //SCHEDULE
        // case actionTypes.FETCH_ALL_SCHEDULE_SUCCESS:
        //     return {
        //         ...state,
        //         schedules: action.payload.schedules,
        //         scheduleTotal: action.payload.total,
        //         schedulePage: action.payload.page,
        //         scheduleLimit: action.payload.limit,
        //     };

        // case actionTypes.FETCH_ALL_SCHEDULE_FAILED:
        //     return {
        //         ...state,
        //         schedules: [],
        //         scheduleTotal: 0,
        //     };
        

        default:
            return state;
    }
}

export default doctorReducer;