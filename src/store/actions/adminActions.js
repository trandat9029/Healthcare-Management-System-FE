import actionTypes from './actionTypes';
import { getAllCodeService, createNewUserService, 
         getAllUsers, deleteUserService, editUserService,
         getTopDoctorHomeService,  
         getAllDoctorsService,
         saveDetailDoctorService,
         getDetailInfoDoctorService,
        
        } from '../../services/userService';
import { toast } from 'react-toastify';

// Gender
// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START
// })

export const fetchGenderStart =  () => {
    return async (dispatch, getState) =>{
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_START
            })

            let res = await getAllCodeService("GENDER");
            if(res && res.errCode === 0){
                dispatch(fetchGenderSuccess(res.data));
            }else {
                dispatch(fetchGenderFailed());
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
            console.log('fetchGenderStart error ', error);
        } 
    }
};

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
});

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
});


//Position
export const fetchPositionStart =  () => {
    return async (dispatch, getState) =>{
        try {
            dispatch({
                type: actionTypes.FETCH_POSITION_START
            })

            let res = await getAllCodeService("POSITION");
            if(res && res.errCode === 0){
                dispatch(fetchPositionSuccess(res.data));
            }else {
                dispatch(fetchPositionFailed());
            }
        } catch (error) {
            dispatch(fetchPositionFailed());
            console.log('fetchPositionStart error ', error);
        } 
    }
};

export const fetchPositionSuccess = (PositionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: PositionData
});

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
});


//Role
export const fetchRoleStart =  () => {
    return async (dispatch, getState) =>{
        try {
            dispatch({
                type: actionTypes.FETCH_ROLE_START
            })

            let res = await getAllCodeService("ROLE");
            if(res && res.errCode === 0){
                dispatch(fetchRoleSuccess(res.data));
            }else {
                dispatch(fetchRoleFailed());
            }
        } catch (error) {
            dispatch(fetchRoleFailed());
            console.log('fetchRoleStart error ', error);
        } 
    }
};

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
});

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
});

//create user
export const createNewUser = (data) =>{
    return async (dispatch, getState) =>{
        try {
            let res = await createNewUserService(data);   
            if(res && res.errCode === 0){
                toast.success("Create a new user succeed!")
                dispatch(saveUserSuccess());
                dispatch(fetchAllUsersStart())
            }else {
                dispatch(saveUserFailed());
                toast.error(res.errMessage)
            }
        } catch (error) {
            dispatch(saveUserFailed());
            toast.error("Create a new user failed!")
            console.log('saveUserFailed error ', error);
        } 
    }
};

export const saveUserSuccess = () =>({
    type: actionTypes.CREATE_USER_SUCCESS
});
export const saveUserFailed = () =>({
    type: actionTypes.CREATE_USER_FAILED
});

//get all users
export const fetchAllUsersStart =  () => {
    return async (dispatch, getState) =>{
        try {
            let res = await getAllUsers("ALL");            
            if(res && res.errCode === 0){
                let users = res.users.reverse();
                dispatch(fetchAllUsersSuccess(users));
            }else {
                dispatch(fetchAllUsersFailed());
            }
        } catch (error) {
            dispatch(fetchAllUsersFailed());
            console.log('fetchAllUsersStart error ', error);
        } 
    }
};

export const fetchAllUsersSuccess = (data) =>({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
});
export const fetchAllUsersFailed = () =>({
    type: actionTypes.FETCH_ALL_USERS_FAILED
});

//delete user
export const deleteUser = (userId) =>{
    return async (dispatch, getState) =>{
        try {
            let res = await deleteUserService(userId);
            if(res && res.errCode === 0){
                toast.success("Delete a new user succeed!")
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUsersStart())
            }else {
                dispatch(deleteUserFailed());
            }
        } catch (error) {
            dispatch(deleteUserFailed());
            toast.error("Delete a new user failed!");
            console.log('deleteUserFailed error ', error);
        } 
    }
};

export const deleteUserSuccess = () =>({
    type: actionTypes.DELETE_USER_SUCCESS
});
export const deleteUserFailed = () =>({
    type: actionTypes.DELETE_USER_FAILED
});


// edit user
export const editUser = (data) =>{
    return async (dispatch, getState) =>{
        try {
            let res = await editUserService(data);
            if(res && res.errCode === 0){
                toast.success("Update  user succeed!")
                dispatch(editUserSuccess());
                dispatch(fetchAllUsersStart())
            }else {
                dispatch(editUserFailed());
            }
        } catch (error) {
            dispatch(editUserFailed());
            toast.warning("Edit user failed!");
            console.log('editUserFailed error ', error);
        } 
    }
};

export const editUserSuccess = () =>({
    type: actionTypes.EDIT_USER_SUCCESS
});
export const editUserFailed = () =>({
    type: actionTypes.EDIT_USER_FAILED
});

//get top doctor
export const fetchTopDoctor = () =>{
    return async (dispatch, getState) =>{
        try {
            let res = await getTopDoctorHomeService('');
            if(res && res.errCode === 0){
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors: res.data
                });
            }else{
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAILED
                });
            }
            
        } catch (error) {
            console.log('FETCH_TOP_DOCTORS_FAILED: ', error);
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAILED
            });
        } 
    }
}


// get all doctors  
export const fetchAllDoctor = () =>{
    return async (dispatch, getState) =>{
        try {
            let res = await getAllDoctorsService();
            if(res && res.errCode === 0){
                dispatch({
                    type: actionTypes.FETCH_All_DOCTORS_SUCCESS,
                    dataDr: res.data
                });
            }else{  
                dispatch({
                    type: actionTypes.FETCH_All_DOCTORS_FAILED
                });
            }
            
        } catch (error) {
            console.log('FETCH_ALL_DOCTORS_FAILED: ', error);
            dispatch({
                type: actionTypes.FETCH_All_DOCTORS_FAILED
            });
        } 
    }
}

// save info doctor
export const saveDetailDoctor = (data) =>{
    return async (dispatch, getState) =>{
        try {
            let res = await saveDetailDoctorService(data);
            if(res && res.errCode === 0){
                toast.success("Save info detail doctor succeed!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                });
            }else{
                toast.error("Save info detail doctor error!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED
                });
            }
            
        } catch (error) {
            toast.error("Save info detail doctor error!");
            console.log('SAVE_DETAIL_DOCTOR_FAILED: ', error);
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED
            });
        } 
    }
}

// get schedule hour doctor
// export const getInfoDetailDoctor = (inputId) =>{
//     return async (dispatch, getState) =>{
//         try {
//             let res = await getDetailInfoDoctorService(inputId);
//             if(res && res.errCode === 0){
//                 toast.success("get info detail doctor succeed!");
//                 dispatch({
//                     type: actionTypes.FETCH_INFO_DETAIL_DOCTORS_SUCCESS,
//                     data: res.data,
//                 });
//             }else{
//                 toast.error("get info detail doctor error!");
//                 dispatch({
//                     type: actionTypes.FETCH_INFO_DETAIL_DOCTORS_FAILED
//                 });
//             }
            
//         } catch (error) {
//             toast.error("Get info detail doctor error!");
//             console.log('FETCH_INFO_DETAIL_DOCTORS_FAILED: ', error);
//             dispatch({
//                 type: actionTypes.FETCH_INFO_DETAIL_DOCTORS_FAILED
//             });
//         } 
//     }
// }


// get all doctors  
export const fetchAllScheduleTime = () =>{
    return async (dispatch, getState) =>{
        try {
            let res = await getAllCodeService("TIME");
            if(res && res.errCode === 0){
                console.log('check res: ', res);
                
                dispatch({
                    type: actionTypes.FETCH_AllCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                });
            }else{  
                dispatch({
                    type: actionTypes.FETCH_AllCODE_SCHEDULE_TIME_FAILED
                });
            }
            
        } catch (error) {
            console.log('FETCH_AllCODE_SCHEDULE_TIME_FAILED: ', error);
            dispatch({
                type: actionTypes.FETCH_AllCODE_SCHEDULE_TIME_FAILED
            });
        } 
    }
}
