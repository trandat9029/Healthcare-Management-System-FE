import axios from "../axios";

const handleLoginApi = (email, password) => {
  return axios.post("/api/auth/login", { email, password });
};

const refreshTokenApi = () => {
  return axios.post("/api/auth/refresh-token");
};

const logoutApi = () => {
  return axios.post("/api/auth/logout");
};

const handleSendOtp = (email) => {
  return axios.post("/api/auth/forgot-password/send-otp", { email });
};

const handleVerifyOtp = ({ email, otpId, otp }) => {
  return axios.post("/api/auth/forgot-password/verify-otp", {
    email,
    otpId,
    otp,
  });
};

const handleResetPassword = ({ resetToken, newPassword, confirmPassword }) => {
  return axios.post("/api/auth/forgot-password/reset-password", {
    resetToken,
    newPassword,
    confirmPassword,
  });
};

export {
  handleLoginApi,
  refreshTokenApi,
  logoutApi,
  handleSendOtp,
  handleVerifyOtp,
  handleResetPassword,
};
