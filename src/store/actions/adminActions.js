import actionTypes from './actionTypes';
import { getAllCodeService, createNewUserService, getAllUsers, deleteUserService, editUserService } from '../../services/userService';
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
            }
        } catch (error) {
            dispatch(saveUserFailed());
            toast.warning("Create a new user failed!")
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
            toast.warning("Delete a new user failed!");
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