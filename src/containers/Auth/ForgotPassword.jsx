// src/containers/Auth/ForgotPassword.js
import React, { Component } from 'react';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      otp: '',
      error: '',
    };
  }

  handleVerify = () => {
    if (this.state.otp !== '12345') {
      this.setState({ error: 'Mã OTP không đúng. Vui lòng thử lại.' });
      return;
    }
    this.setState({ error: '' });
    if (this.props.onOtpVerified) {
      this.props.onOtpVerified();
    }
  };

  render() {
    const { onBackToLogin } = this.props;
    const { email, otp, error } = this.state;

    return (
      <>
        <div className="text-login">Quên mật khẩu</div>
        <p className="login-subtitle">
          Nhập email dùng để đăng nhập và mã OTP để tiếp tục.
        </p>

        <div className="login-input">
          <label>Email</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <i className="fa-regular fa-envelope" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
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
              placeholder="Nhập mã OTP. ví dụ: 12345"
              value={otp}
              onChange={(e) =>
                this.setState({ otp: e.target.value, error: '' })
              }
            />
          </div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <button className="btn-login" onClick={this.handleVerify}>
          Tiếp tục
        </button>

        <div className="login-small-link">
          <button
            type="button"
            className="btn-inline-link"
            onClick={onBackToLogin}
          >
            Quay lại đăng nhập
          </button>
        </div>
      </>
    );
  }
}

export default ForgotPassword;
