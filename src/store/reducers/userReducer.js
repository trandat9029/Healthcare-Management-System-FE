import actionTypes from '../actions/actionTypes';

const initialState = {
  isLoggedIn: false,
  userInfo: null,
  accessToken: null
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        userInfo: action.userInfo,
        accessToken: action.accessToken
      };

    case actionTypes.UPDATE_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.accessToken
      };

    case actionTypes.USER_LOGIN_FAIL:
    case actionTypes.PROCESS_LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
        accessToken: null
      };

    default:
      return state;
  }
};

export default appReducer;
