// src/containers/Auth/ForgotPassword.js
import React, { Component } from "react";
import { handleResetPassword } from "../../services/authService";
import "./ForgotPassword.scss";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      confirmPassword: "",
      error: "",
      isSaving: false,
    };
  }

  handleChangePassword = async () => {
    const { newPassword, confirmPassword } = this.state;
    const { resetToken } = this.props;

    if (!resetToken) {
      this.setState({ error: "Thiếu reset token. Vui lòng thực hiện lại." });
      return;
    }

    if (!newPassword || !confirmPassword) {
      this.setState({ error: "Vui lòng nhập đầy đủ thông tin." });
      return;
    }

    if (newPassword !== confirmPassword) {
      this.setState({ error: "Mật khẩu không khớp." });
      return;
    }

    this.setState({ error: "", isSaving: true });

    try {
      const res = await handleResetPassword({ resetToken, newPassword, confirmPassword });
      const data = res;

      if (data && data.errCode === 0) {
        if (this.props.onBackToLogin) this.props.onBackToLogin();
      } else {
        this.setState({ error: data.errMessage || "Đổi mật khẩu thất bại." });
      }
    } catch (e) {
      this.setState({ error: "Lỗi mạng hoặc lỗi server." });
    } finally {
      this.setState({ isSaving: false });
    }
  };

  render() {
    const { newPassword, confirmPassword, error, isSaving } = this.state;

    return (
      <>
        <div className="text-login">Đặt lại mật khẩu</div>
        <p className="login-subtitle">Nhập mật khẩu mới cho tài khoản của bạn.</p>

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
              onChange={(e) => this.setState({ newPassword: e.target.value, error: "" })}
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
              onChange={(e) => this.setState({ confirmPassword: e.target.value, error: "" })}
              onKeyDown={(e) => {
                if (e.key === "Enter") this.handleChangePassword();
              }}
            />
          </div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <button className="btn-login" onClick={this.handleChangePassword} disabled={isSaving}>
          {isSaving ? "Đang đổi" : "Đổi mật khẩu"}
        </button>

        <div className="login-small-link">
          <button type="button" className="btn-inline-link" onClick={this.props.onBackToLogin}>
            Quay lại đăng nhập
          </button>
        </div>
      </>
    );
  }
}

export default ForgotPassword;
