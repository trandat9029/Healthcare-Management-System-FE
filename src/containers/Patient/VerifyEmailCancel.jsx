// src/containers/Patient/VerifyEmailCancel.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { postVerifyCancelBookedService } from '../../services/bookingService';
import './VerifyEmailCancel.scss';

class VerifyEmailCancel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusVerify: false,
      errCode: 0,
    };
  }

  async componentDidMount() {
    if (this.props.location && this.props.location.search) {
      const urlParams = new URLSearchParams(this.props.location.search);
      const token = urlParams.get('token');
      const doctorId = urlParams.get('doctorId');

      const res = await postVerifyCancelBookedService({
        token,
        doctorId,
      });

      if (res  && res.errCode === 0) {
        this.setState({
          statusVerify: true,
          errCode: res.errCode,
        });
      } else {
        this.setState({
          statusVerify: true,
          errCode: res && res.errCode ? res.errCode : -1,
        });
      }
    }
  }

  render() {
    const { statusVerify, errCode } = this.state;
    const isSuccess = +errCode === 0;

    return (
      <div className="verify-email-page">
        <div className="verify-email-wrapper">
          {!statusVerify && (
            <div className="verify-card loading-card">
              <div className="spinner" />
              <p className="loading-text">
                Đang xác nhận hủy lịch khám, vui lòng chờ trong giây lát.
              </p>
            </div>
          )}

          {statusVerify && (
            <div className="verify-card">
              <div
                className={
                  isSuccess ? 'status-icon status-success' : 'status-icon status-fail'
                }
              >
                <i
                  className={
                    isSuccess ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'
                  }
                />
              </div>

              <h2 className="status-title">
                {isSuccess
                  ? 'Hủy lịch khám thành công'
                  : 'Lịch khám đã được xử lý hoặc không tồn tại'}
              </h2>

              <p className="status-subtitle">
                {isSuccess
                  ? 'Lịch khám của bạn đã được hủy. Nếu có nhu cầu, bạn có thể đặt lại lịch mới bất cứ lúc nào.'
                  : 'Vui lòng kiểm tra lại đường link trong email, hoặc liên hệ bộ phận hỗ trợ nếu cần thêm trợ giúp.'}
              </p>

              <a href="/home" className="back-home-btn">
                <i className="fa-solid fa-arrow-left" />
                <span>Về trang chủ</span>
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps, null)(VerifyEmailCancel);
