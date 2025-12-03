// src/containers/Patient/Clinic/DetailClinic.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DetailClinic.scss';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getAllDetailClinicByIdService } from '../../../services/userService';
import _ from 'lodash';

class DetailClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataDetailClinic: {},
      isShowFullDescription: false,
    };
  }

  async componentDidMount() {
    if (this.props.match && this.props.match.params && this.props.match.params.id) {
      let id = this.props.match.params.id;

      let res = await getAllDetailClinicByIdService({ id });
      console.log('check res', res);

      if (res && res.errCode === 0) {
        let data = res.data;
        let arrDoctorId = [];

        if (data && !_.isEmpty(data)) {
          let arr = data.doctorClinic;
          if (arr && arr.length > 0) {
            arr.forEach((item) => arrDoctorId.push(item.doctorId));
          }
        }

        this.setState({
          dataDetailClinic: data,
          arrDoctorId,
        });
      }
    }
  }

  handleToggleDescription = () => {
    this.setState((prev) => ({
      isShowFullDescription: !prev.isShowFullDescription,
    }));
  };

  render() {
    const { arrDoctorId, dataDetailClinic, isShowFullDescription } = this.state;

    const clinicName = dataDetailClinic?.name || '';
    const clinicAddress = dataDetailClinic?.address || '';
    const descriptionHTML = dataDetailClinic?.descriptionHTML || '';
    const clinicImage = dataDetailClinic?.image || '';

    return (
      <div className="detail-clinic-container">
        <div className="detail-clinic-wrapper">

          <div className="breadcrumb">
            <i className="fa-solid fa-house"></i>
            <span> / Khám tại cơ sở y tế / </span>
            <span className="breadcrumb-current">{clinicName}</span>
          </div>

          <div className="detail-clinic-body">

            <div className="clinic-header">
              <div className="clinic-header-text">
                <h1 className="clinic-title">{clinicName}</h1>
                <p className="clinic-subtitle">Địa chỉ. {clinicAddress}</p>
              </div>

              {clinicImage && (
                <div
                  className="clinic-header-image"
                  style={{ backgroundImage: `url(${clinicImage})` }}
                />
              )}
            </div>

            {descriptionHTML && (
              <div
                className={
                  isShowFullDescription
                    ? 'clinic-description expanded'
                    : 'clinic-description collapsed'
                }
              >
                <div
                  className="clinic-description-html"
                  dangerouslySetInnerHTML={{ __html: descriptionHTML }}
                />

                <div className="toggle-description">
                  <button
                    type="button"
                    onClick={this.handleToggleDescription}
                    className="toggle-description-btn"
                  >
                    {isShowFullDescription ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                </div>
              </div>
            )}

            {arrDoctorId &&
              arrDoctorId.length > 0 &&
              arrDoctorId.map((item, index) => (
                <div className="each-doctor" key={index}>
                  <div className="dt-content-left">
                    <ProfileDoctor
                      doctorId={item}
                      isShowDescriptionDoctor={true}
                      isShowLinkDetail={true}
                      isShowPrice={false}
                    />
                  </div>

                  <div className="dt-content-right">
                    <DoctorSchedule doctorIdFromParent={item} />
                    <div className="doctor-extra-info">
                      <DoctorExtraInfo doctorIdFromParent={item} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, null)(DetailClinic);
