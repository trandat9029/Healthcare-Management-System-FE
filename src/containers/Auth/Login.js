// src/containers/Auth/Login.js
import React, { Component } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import * as actions from '../../store/actions';
import './Login.scss';
import { handleLoginApi } from '../../services/userService';
import logo from '../../assets/logo.svg';

import ForgotPassword from './ForgotPassword';
import SendEmailOTP from './SendEmailOTP';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isShowPassword: false,
      errMessage: '',
      activeForm: 'login', // login . forgot . reset
    };
  }

  handleOnchangeUserName = (event) => {
    this.setState({ username: event.target.value });
  };

  handleOnchangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  handleLogin = async () => {
    this.setState({ errMessage: '' });

    try {
      let data = await handleLoginApi(this.state.username, this.state.password);

      if (data && data.errCode !== 0) {
        this.setState({ errMessage: data.message });
      }

      if (data && data.errCode === 0) {
        this.props.userLoginSuccess(data.user);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        this.setState({ errMessage: error.response.data.message });
      }
    }
  };

  renderLoginForm = () => {
    const { username, password, isShowPassword, errMessage } = this.state;

    return (
      <>
        <div className="text-login">Đăng nhập</div>

        <div className="login-input">
          <label>Email</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <i className="fa-regular fa-envelope" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập email của bạn"
              value={username}
              onChange={this.handleOnchangeUserName}
            />
          </div>
        </div>

        <div className="login-input">
          <label>Mật khẩu</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <i className="fa-solid fa-lock" />
            </span>
            <input
              type={isShowPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={this.handleOnchangePassword}
              onKeyDown={(e) => {
                if (e.key === 'Enter') this.handleLogin();
              }}
            />
            <span
              className="toggle-password"
              onClick={() =>
                this.setState({ isShowPassword: !isShowPassword })
              }
            >
              <i
                className={
                  isShowPassword
                    ? 'fa-solid fa-eye'
                    : 'fa-solid fa-eye-slash'
                }
              />
            </span>
          </div>
        </div>

        {errMessage && <div className="login-error">{errMessage}</div>}

        <button className="btn-login" onClick={this.handleLogin}>
          Đăng nhập
        </button>

        <div className="login-extra-row">
          <button
            type="button"
            className="btn-forgot-password"
            onClick={() => this.setState({ activeForm: 'forgot' })}
          >
            Quên mật khẩu
          </button>
        </div>
      </>
    );
  };

  renderRightCard = () => {
    const { activeForm } = this.state;

    if (activeForm === 'login') {
      return this.renderLoginForm();
    }

    if (activeForm === 'forgot') {
      return (
        <ForgotPassword
          onBackToLogin={() => this.setState({ activeForm: 'login' })}
          onOtpVerified={() => this.setState({ activeForm: 'reset' })}
        />
      );
    }

    if (activeForm === 'reset') {
      return (
        <SendEmailOTP
          onBackToLogin={() => this.setState({ activeForm: 'login' })}
        />
      );
    }

    return null;
  };

  render() {
    return (
      <div className="login-background">
        <div className="login-wrapper">
          {/* Panel trái */}
          <div className="login-left">
            <div className="login-left-brand">
              <div className="left-brand-top">
                <img src={logo} alt="" className="login-logo-img" />
              </div>
              <span className="brand-subtitle">Nền tảng quản lý lịch khám</span>
            </div>

            <div className="login-left-text">
              <h1>Chào mừng trở lại</h1>
              <p>
                Đăng nhập để quản lý thiết bị và xem thông tin đặt lịch khám
                của bạn.
              </p>
            </div>
          </div>

          {/* Panel phải khung thay đổi nội dung */}
          <div className="login-card">
            <div className="login-card-inner">{this.renderRightCard()}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(null, mapDispatchToProps)(Login);
