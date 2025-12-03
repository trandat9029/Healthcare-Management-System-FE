// src/containers/Patient/Specialty/DetailSpecialty.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import {
  getAllDetailSpecialtyByIdService,
  getAllCodeService,
} from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
        arrDoctorId: [],
        dataDetailSpecialty: {},
        listProvince: [],
        isShowFullDescription: false, 
        };
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
        let id = this.props.match.params.id;

        let res = await getAllDetailSpecialtyByIdService({
            id: id,
            location: 'ALL',
        });
        console.log('check res: ', res)
        let resProvince = await getAllCodeService('PROVINCE');

        if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
            let data = res.data;
            let arrDoctorId = [];

            if (data && !_.isEmpty(res.data)) {
            let arr = data.doctorSpecialty;
            if (arr && arr.length > 0) {
                arr.forEach((item) => {
                arrDoctorId.push(item.doctorId);
                });
            }
            }

            let dataProvince = resProvince.data;
            if (dataProvince && dataProvince.length > 0) {
                dataProvince.unshift({
                    createdAt: null,
                    keyMap: 'ALL',
                    type: 'PROVINCE',
                    valueEn: 'All locations',
                    valueVi: 'Toàn quốc',
                });
            }

            this.setState({
                dataDetailSpecialty: res.data,
                arrDoctorId: arrDoctorId,
                listProvince: dataProvince ? dataProvince : [],
            });
        }
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.language !== prevProps.language) {
        // hiện tại chưa cần xử lí gì khi đổi ngôn ngữ
        }
    }

        handleToggleDescription = () => {
        this.setState((prev) => ({
        isShowFullDescription: !prev.isShowFullDescription,
        }));
    };

    handleOnChangeSelect = async (event) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
        let id = this.props.match.params.id;
        let location = event.target.value;

        let res = await getAllDetailSpecialtyByIdService({
            id: id,
            location: location,
        });

        if (res && res.errCode === 0) {
            let data = res.data;
            let arrDoctorId = [];
            if (data && !_.isEmpty(res.data)) {
            let arr = data.doctorSpecialty;
            if (arr && arr.length > 0) {
                arr.forEach((item) => {
                arrDoctorId.push(item.doctorId);
                });
            }
            }

            this.setState({
            dataDetailSpecialty: res.data,
            arrDoctorId: arrDoctorId,
            });
        }
        }
    };

  render() {
    let { language } = this.props;
    let { arrDoctorId, dataDetailSpecialty, listProvince, isShowFullDescription } = this.state;

    const specialtyName =
      dataDetailSpecialty && dataDetailSpecialty.name
        ? dataDetailSpecialty.name
        : '';

    const descriptionHTML = dataDetailSpecialty?.descriptionHTML || '';
    const specialtyImage = dataDetailSpecialty?.image || '';

    return (
      <div className="detail-specialty-container">
        <div className="detail-specialty-wrapper">

          {/* breadcrumb */}
          <div className="breadcrumb">
            <i className="fa-solid fa-house"></i>
            <span> / Khám Chuyên khoa / </span>
            <span className="breadcrumb-current">{specialtyName}</span>
          </div>

          <div className="detail-specialty-body">
            {/* header có ảnh chuyên khoa */}
            <div className="specialty-header">
              <div className="specialty-header-text">
                <h1 className="specialty-title">{specialtyName}</h1>
                <p className="specialty-subtitle">
                  Bác sĩ {specialtyName} giỏi. giàu kinh nghiệm. lịch khám linh hoạt
                </p>
              </div>

              {specialtyImage && (
                <div
                  className="specialty-header-image"
                  style={{ backgroundImage: `url(${specialtyImage})` }}
                />
              )}
            </div>

            {/* mô tả có xem thêm */}
            {descriptionHTML && (
              <div
                className={
                  isShowFullDescription
                    ? 'description-specialty expanded'
                    : 'description-specialty collapsed'
                }
              >
                <div
                  className="specialty-description-html"
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

            {/* lọc tỉnh */}
            <div className="search-sp-doctor">
              <select onChange={(event) => this.handleOnChangeSelect(event)}>
                {listProvince &&
                  listProvince.length > 0 &&
                  listProvince.map((item, index) => {
                    return (
                      <option key={index} value={item.keyMap}>
                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                      </option>
                    );
                  })}
              </select>
            </div>

            {/* danh sách bác sĩ giữ nguyên logic */}
            {arrDoctorId &&
              arrDoctorId.length > 0 &&
              arrDoctorId.map((item, index) => {
                return (
                  <div className="each-doctor" key={index}>
                    <div className="dt-content-left">
                      <div className="profile-doctor">
                        <ProfileDoctor
                          doctorId={item}
                          isShowDescriptionDoctor={true}
                          isShowLinkDetail={true}
                          isShowPrice={false}
                        />
                      </div>
                    </div>
                    <div className="dt-content-right">
                      <div className="doctor-schedule">
                        <DoctorSchedule doctorIdFromParent={item} />
                      </div>
                      <div className="doctor-extra-info">
                        <DoctorExtraInfo doctorIdFromParent={item} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
