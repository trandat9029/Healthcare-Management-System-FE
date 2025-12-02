// src/containers/HomePage/Section/OutstandingDoctor.js
import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import "./Outstanding.scss";

class OutstandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }

  componentDidMount() {
    // lấy top doctor
    this.props.loadTopDoctors();
    // lấy list specialty, clinic, price, payment, province
    this.props.getRequiredDoctorInfoRedux();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
      this.setState({
        arrDoctors: this.props.topDoctorsRedux,
      });
    }
  }

  handleViewDetailDoctor = (doctor) => {
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
  };

  handleViewMoreDoctors = () => {
    if (this.props.history) {
      this.props.history.push(`/doctors`);
    }
  };

  // map specialtyId của bác sĩ sang tên chuyên khoa
  getDoctorSpecialtyName = (doctor) => {
    const { allRequiredDoctorInfo } = this.props;
    if (!doctor || !doctor.doctorInfoData) return "";

    const specialtyId = doctor.doctorInfoData.specialtyId;
    const specialties = allRequiredDoctorInfo?.resSpecialty || [];

    const spec = specialties.find((s) => s.id === specialtyId);
    return spec ? spec.name : "";
  };

  render() {
    let { arrDoctors } = this.state;
    let { language } = this.props;

    return (
      <>
        <div className="section-share section-outstanding-doctor">
          <div className="section-container">
            <div className="section-header">
              <span className="title-section">
                <FormattedMessage id="homepage.outstanding-doctor" />
              </span>
              <button
                className="btn-section"
                onClick={this.handleViewMoreDoctors}
              >
                <FormattedMessage id="homepage.more-info" />
              </button>
            </div>

            <div className="section-body">
              <Slider {...this.props.settings}>
                {arrDoctors &&
                  arrDoctors.length > 0 &&
                  arrDoctors.map((item, index) => {
                    let imageBase64 = "";
                    if (item.image) {
                      imageBase64 = new Buffer(
                        item.image,
                        "base64"
                      ).toString("binary");
                    }

                    let nameVi = `${item.positionData.valueVi}, ${item.firstName} ${item.lastName}`;
                    let nameEn = `${item.positionData.valueEn}, ${item.lastName} ${item.firstName}`;

                    const specialtyName = this.getDoctorSpecialtyName(item);

                    return (
                      <div
                        className="section-customize doctor-child"
                        key={index}
                        onClick={() => this.handleViewDetailDoctor(item)}
                      >
                        <div className="doctor-card">
                          <div className="doctor-avatar-wrapper">
                            <div
                              className="doctor-avatar"
                              style={{
                                backgroundImage: `url(${imageBase64})`,
                              }}
                            ></div>
                          </div>
                          <div className="doctor-info">
                            <h3 className="doctor-name">
                              {language === LANGUAGES.VI ? nameVi : nameEn}
                            </h3>
                            <p className="doctor-specialty">
                              {specialtyName || "Chưa cập nhật chuyên khoa"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </Slider>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    topDoctorsRedux: state.admin.topDoctors,
    language: state.app.language,
    allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
    getRequiredDoctorInfoRedux: () => dispatch(actions.getRequiredDoctorInfo()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor)
);
