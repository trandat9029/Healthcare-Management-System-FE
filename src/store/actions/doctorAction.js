import actionTypes from "./actionTypes";
import {
  getTopDoctorHomeService,
  getAllDoctorsService,
  saveDetailDoctorService,
  handleGetAllSchedule,
} from "../../services/doctorService";

import { toast } from "react-toastify";
import { getAllCodeService} from "../../services/userService";
import { getAllClinicService } from "../../services/clinicService";
import { getAllSpecialtyService } from "../../services/specialtyService";

//get top doctor
export const fetchTopDoctor = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getTopDoctorHomeService("");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
          dataDoctors: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
        });
      }
    } catch (error) {
      console.log("FETCH_TOP_DOCTORS_FAILED: ", error);
      dispatch({
        type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
      });
    }
  };
};

// get all doctors
export const fetchAllDoctor = (
  page = 1,
  limit = 10,
  sortBy = "firstName",
  sortOrder = "DESC"
) => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllDoctorsService({
        page,
        limit,
        sortBy,
        sortOrder,
      });

      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_All_DOCTORS_SUCCESS,
          payload: {
            doctors: res.doctors,
            total: res.total,
            page: res.page,
            limit: res.limit,
          },
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_All_DOCTORS_FAILED,
        });
      }
    } catch (error) {
      console.log("FETCH_ALL_DOCTORS_FAILED: ", error);
      dispatch({
        type: actionTypes.FETCH_All_DOCTORS_FAILED,
      });
    }
  };
};

// save info doctor
export const saveDetailDoctor = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await saveDetailDoctorService(data);
      if (res && res.errCode === 0) {
        toast.success("Save info detail doctor succeed!");
        dispatch({
          type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
        });
      } else {
        toast.error("Save info detail doctor error!");
        dispatch({
          type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
        });
      }
    } catch (error) {
      toast.error("Save info detail doctor error!");
      console.log("SAVE_DETAIL_DOCTOR_FAILED: ", error);
      dispatch({
        type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
      });
    }
  };
};

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
export const fetchAllScheduleTime = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("TIME");
      if (res && res.errCode === 0) {
        // console.log('check res: ', res);

        dispatch({
          type: actionTypes.FETCH_AllCODE_SCHEDULE_TIME_SUCCESS,
          dataTime: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_AllCODE_SCHEDULE_TIME_FAILED,
        });
      }
    } catch (error) {
      console.log("FETCH_AllCODE_SCHEDULE_TIME_FAILED: ", error);
      dispatch({
        type: actionTypes.FETCH_AllCODE_SCHEDULE_TIME_FAILED,
      });
    }
  };
};

//get price
export const getRequiredDoctorInfo = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_START,
      });

      let resPrice = await getAllCodeService("PRICE");
      let resPayment = await getAllCodeService("PAYMENT");
      let resProvince = await getAllCodeService("PROVINCE");
      let resSpecialty = await getAllSpecialtyService();
      let resClinic = await getAllClinicService();
      if (
        resPrice &&
        resPrice.errCode === 0 &&
        resPayment &&
        resPayment.errCode === 0 &&
        resProvince &&
        resProvince.errCode === 0 &&
        resSpecialty &&
        resSpecialty.errCode === 0 &&
        resClinic &&
        resClinic.errCode === 0
      ) {
        let data = {
          resPrice: resPrice.data,
          resPayment: resPayment.data,
          resProvince: resProvince.data,
          resSpecialty: resSpecialty.data,
          resClinic: resClinic.data,
        };
        dispatch(fetchRequiredDoctorInfoSuccess(data));
      } else {
        dispatch(fetchRequiredDoctorInfoFailed());
      }
    } catch (error) {
      dispatch(fetchRequiredDoctorInfoFailed());
      console.log("fetchRequiredDoctorInfo error ", error);
    }
  };
};

export const fetchRequiredDoctorInfoSuccess = (allRequiredData) => ({
  type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS,
  data: allRequiredData,
});

export const fetchRequiredDoctorInfoFailed = () => ({
  type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILED,
});

// FETCH ALL SCHEDULE
// export const fetchAllSchedule = (
//   page ,
//   limit ,
//   sortBy ,
//   sortOrder
// ) => {
//   return async (dispatch) => {
//     try {
//       let res = await handleGetAllSchedule(page, limit, sortBy, sortOrder);

//       if (res && res.errCode === 0) {
//         const { schedules, total, page, limit } = res;

//         dispatch({
//           type: actionTypes.FETCH_ALL_SCHEDULE_SUCCESS,
//           payload: {
//             schedules: schedules,
//             total,
//             page,
//             limit,
//           },
//         });
//       } else {
//         dispatch({
//           type: actionTypes.FETCH_ALL_SCHEDULE_FAILED,
//         });
//       }
//     } catch (error) {
//       console.log("FETCH_ALL_SCHEDULE_FAILED:", error);
//       dispatch({
//         type: actionTypes.FETCH_ALL_SCHEDULE_FAILED,
//       });
//     }
//   };
// };
