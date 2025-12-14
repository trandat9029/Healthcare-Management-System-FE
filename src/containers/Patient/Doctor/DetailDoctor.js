// src/containers/Patient/Doctor/DetailDoctor.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

import './DetailDoctor.scss';
import { getDetailInfoDoctorService } from '../../../services/doctorService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfo from './DoctorExtraInfo';

class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailDoctor: {},
      currentDoctorId: -1,
    };
  }

  async componentDidMount() {
    if (this.props.match && this.props.match.params && this.props.match.params.id) {
      const id = this.props.match.params.id;
      this.setState({ currentDoctorId: id });

      const res = await getDetailInfoDoctorService(id);
      if (res && res.errCode === 0) {
        this.setState({
          detailDoctor: res.data || {},
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {}

  render() {
    const { language } = this.props;
    const { detailDoctor, currentDoctorId } = this.state;

    let nameVi = '';
    let nameEn = '';
    if (detailDoctor && detailDoctor.positionData) {
      nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
      nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
    }

    const displayName = language === LANGUAGES.VI ? nameVi : nameEn;

    return (
      <div className="doctor-detail-container">
        <div className="doctor-detail-wrapper">
          {/* BREADCRUMB */}
          <div className="breadcrumb">
            <i className="fa-solid fa-house"></i>
            <span> / Bác sĩ / </span>
            <span className="breadcrumb-current">{displayName}</span>
          </div>

          {/* HEADER BÁC SĨ */}
          <div className="doctor-header-card">
            <div className="intro-doctor">
              <div
                className="avatar"
                style={{
                  backgroundImage: `url(${
                    detailDoctor && detailDoctor.image ? detailDoctor.image : ''
                  })`,
                }}
              />
              <div className="info">
                <div className="name">{displayName}</div>
                <div className="short-desc">
                  {detailDoctor.Markdown && detailDoctor.Markdown.description && (
                    <span>{detailDoctor.Markdown.description}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="doctor-header-right">
              <div className="schedule-block">
                <DoctorSchedule doctorIdFromParent={currentDoctorId} />
              </div>
              <div className="extra-block">
                <DoctorExtraInfo doctorIdFromParent={currentDoctorId} />
              </div>
            </div>
          </div>

          {/* NỘI DUNG CHI TIẾT */}
          <div className="detail-info-doctor">
            {detailDoctor &&
              detailDoctor.Markdown &&
              detailDoctor.Markdown.contentHTML && (
                <div
                  className="detail-content-html"
                  dangerouslySetInnerHTML={{
                    __html: detailDoctor.Markdown.contentHTML,
                  }}
                />
              )}
          </div>

          <div className="comment-doctor">{/* chỗ này sau thêm comment cũng được */}</div>
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

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
