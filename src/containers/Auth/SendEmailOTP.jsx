// src/containers/Auth/SendEmailOTP.js
import React, { Component } from "react";
import { handleSendOtp, handleVerifyOtp } from "../../services/authService";
import "./SendEmailOTP.scss";

class SendEmailOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      otp: "",
      otpId: null,
      error: "",
      message: "",
      isSending: false,
      isVerifying: false,
    };
  }

  handleSend = async () => {
    const { email } = this.state;
    if (!email) {
      this.setState({ error: "Vui lòng nhập email.", message: "" });
      return;
    }

    this.setState({ isSending: true, error: "", message: "" });

    try {
      const res = await handleSendOtp(email);
      console.log('check eamil: ', res)
      const data = res;

      if (data && data.errCode === 0) {
        this.setState({
          otpId: data.data.otpId,
          message: "Đã gửi OTP. Vui lòng kiểm tra email.",
          error: "",
        });
      } else {
        this.setState({ error: "Gửi OTP thất bại.", message: "" });
      }
    } catch (e) {
      this.setState({ error: "Lỗi mạng hoặc lỗi server.", message: "" });
    } finally {
      this.setState({ isSending: false });
    }
  };

  handleVerify = async () => {
    const { email, otpId, otp } = this.state;

    if (!email) {
      this.setState({ error: "Vui lòng nhập email.", message: "" });
      return;
    }
    if (!otpId) {
      this.setState({ error: "Vui lòng bấm Gửi OTP trước.", message: "" });
      return;
    }
    if (!otp) {
      this.setState({ error: "Vui lòng nhập mã OTP.", message: "" });
      return;
    }

    this.setState({ isVerifying: true, error: "", message: "" });

    try {
      const res = await handleVerifyOtp({ email, otpId, otp });
      console.log('check verify: ', res)
      const data = res;

      if (data && data.errCode === 0) {
        const resetToken = data.data.resetToken;
        if (this.props.onOtpVerified) {
          this.props.onOtpVerified({ resetToken });
        }
      } else {
        this.setState({ error: data.errMessage || "OTP không đúng.", message: "" });
      }
    } catch (e) {
      this.setState({ error: "Lỗi mạng hoặc lỗi server.", message: "" });
    } finally {
      this.setState({ isVerifying: false });
    }
  };

  render() {
    const { onBackToLogin } = this.props;
    const { email, otp, otpId, error, message, isSending, isVerifying } = this.state;

    return (
      <>
        <div className="text-login">Quên mật khẩu</div>
        <p className="login-subtitle">Nhập email dùng để đăng nhập và mã OTP để tiếp tục.</p>

        <div className="login-input">
          <label>Email</label>

          <div className="otp-email-row">
            <div className="input-with-icon otp-email-input">
              <span className="input-icon">
                <i className="fa-regular fa-envelope" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value, error: "", message: "" })}
              />
            </div>

            <button
              type="button"
              className="btn-send-otp"
              onClick={this.handleSend}
              disabled={isSending}
            >
              {isSending ? "Đang gửi" : "Gửi"}
            </button>
          </div>
        </div>

        <div className="login-input">
          <label>Mã OTP</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <i className="fa-solid fa-key" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => this.setState({ otp: e.target.value, error: "", message: "" })}
              onKeyDown={(e) => {
                if (e.key === "Enter") this.handleVerify();
              }}
              disabled={!otpId}
            />
          </div>
        </div>

        {message && <div className="login-success">{message}</div>}
        {error && <div className="login-error">{error}</div>}

        <button className="btn-login" onClick={this.handleVerify} disabled={isVerifying}>
          {isVerifying ? "Đang kiểm tra" : "Tiếp tục"}
        </button>

        <div className="login-small-link">
          <button type="button" className="btn-inline-link" onClick={onBackToLogin}>
            Quay lại đăng nhập
          </button>
        </div>
      </>
    );
  }
}

export default SendEmailOTP;
