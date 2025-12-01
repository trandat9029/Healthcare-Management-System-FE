// src/containers/Auth/SendEmailOTP.js
import React, { Component } from 'react';
import './SendEmailOTP.scss'
class SendEmailOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      confirmPassword: '',
      error: '',
    };
  }

  handleChangePassword = () => {
    const { newPassword, confirmPassword } = this.state;

    if (!newPassword || !confirmPassword) {
      this.setState({ error: 'Vui lòng nhập đầy đủ thông tin.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      this.setState({ error: 'Mật khẩu không khớp.' });
      return;
    }

    this.setState({ error: '' });

    // Sau này bạn ghép logic đổi mật khẩu ở đây

    if (this.props.onBackToLogin) {
      this.props.onBackToLogin();
    }
  };

  render() {
    const { newPassword, confirmPassword, error } = this.state;

    return (
      <>
        <div className="text-login">Đặt lại mật khẩu</div>
        <p className="login-subtitle">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>

        <div className="login-input">
          <label>Mật khẩu mới</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <i className="fa-solid fa-lock" />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) =>
                this.setState({ newPassword: e.target.value, error: '' })
              }
            />
          </div>
        </div>

        <div className="login-input">
          <label>Nhập lại mật khẩu</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <i className="fa-solid fa-lock" />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) =>
                this.setState({ confirmPassword: e.target.value, error: '' })
              }
            />
          </div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <button className="btn-login" onClick={this.handleChangePassword}>
          Đổi mật khẩu
        </button>

        <div className="login-small-link">
          <button
            type="button"
            className="btn-inline-link"
            onClick={this.props.onBackToLogin}
          >
            Quay lại đăng nhập
          </button>
        </div>
      </>
    );
  }
}

export default SendEmailOTP;
