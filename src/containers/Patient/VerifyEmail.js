// src/containers/Patient/VerifyEmail.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { postVerifyBookAppointmentService } from '../../services/bookingService';
import './VerifyEmail.scss';

class VerifyEmail extends Component {
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

      const res = await postVerifyBookAppointmentService({
        token,
        doctorId,
      });

      if (res && res.errCode === 0) {
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

  async componentDidUpdate(prevProps) {
    if (this.props.language !== prevProps.language) {
      // chưa cần xử lý gì thêm
    }
  }

  render() {
    const { statusVerify, errCode } = this.state;

    const isSuccess = +errCode === 0;

    return (
      <>
        <div className="verify-email-page">
          <div className="verify-email-wrapper">
            {!statusVerify && (
              <div className="verify-card loading-card">
                <div className="spinner" />
                <p className="loading-text">Đang xác nhận lịch hẹn. vui lòng chờ trong giây lát.</p>
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
                    ? 'Xác nhận lịch hẹn thành công'
                    : 'Lịch hẹn đã được xác nhận hoặc không tồn tại'}
                </h2>

                <p className="status-subtitle">
                  {isSuccess
                    ? 'Cảm ơn bạn đã đặt lịch khám. Thông tin chi tiết đã được gửi vào email của bạn.'
                    : 'Vui lòng kiểm tra lại đường link xác nhận trong email. hoặc liên hệ bộ phận hỗ trợ nếu cần thêm trợ giúp.'}
                </p>

                <a href="/home" className="back-home-btn">
                  <i className="fa-solid fa-arrow-left" />
                  <span>Về trang chủ</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
