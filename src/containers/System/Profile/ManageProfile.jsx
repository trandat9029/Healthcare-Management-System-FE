// src/containers/System/Profile/ManageProfile.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageProfile.scss';
import { getDetailInfoDoctorService } from '../../../services/doctorService';
import ProfileUpdate from './ProfileUpdate';
import ChangePassword from './ChangePassword';
import { FormattedMessage } from 'react-intl';

class ManageProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      doctorData: null,
      error: null,

      showUpdateModal: false,
      showChangePasswordModal: false,
    };
  }

  async componentDidMount() {
    try {
      const { user } = this.props;

      if (!user || !user.id) {
        this.setState({
          loading: false,
          error: 'Không tìm thấy thông tin tài khoản',
        });
        return;
      }

      const res = await getDetailInfoDoctorService(user.id);

      if (res && res.errCode === 0 && res.data) {
        this.setState({
          loading: false,
          doctorData: res.data,
          error: null,
        });
      } else {
        this.setState({
          loading: false,
          error: res?.errMessage || 'Không lấy được dữ liệu hồ sơ',
        });
      }
    } catch (e) {
      console.log('getDetailInfoDoctorService error', e);
      this.setState({
        loading: false,
        error: 'Có lỗi xảy ra khi tải hồ sơ',
      });
    }
  }

  openUpdateModal = () => {
    this.setState({ showUpdateModal: true });
  };

  closeUpdateModal = () => {
    this.setState({ showUpdateModal: false });
  };
  
  openChangePasswordModal = () => {
    this.setState({ showChangePasswordModal: true });
  };

  closeChangePasswordModal = () => {
    this.setState({ showChangePasswordModal: false });
  };


  render() {
    const {
      loading,
      doctorData,
      error,
      showChangePasswordModal,
      showUpdateModal,
    } = this.state;

    console.log('check state doctorData: ', doctorData);

    const basic = doctorData || {};
    const info = doctorData?.doctorInfoData || {};
    const markdown = doctorData?.Markdown || {};

    const fullName = `${basic.firstName || ''} ${basic.lastName || ''}`.trim();
    const email = basic.email || '';
    const address = basic.address || '';
    const phoneNumber = basic.phoneNumber || '';
    const image = basic.image || '';

    const priceText =
      info.priceTypeData?.valueVi || info.priceTypeData?.valueEn || '';
    const paymentText =
      info.paymentTypeData?.valueVi || info.paymentTypeData?.valueEn || '';
    const provinceText =
      info.provinceTypeData?.valueVi || info.provinceTypeData?.valueEn || '';

    const doctorId = basic.id || this.props.user?.id;

    return (
      <>
        <div className="manage-profile-container">
          {loading && <div className="profile-loading"><FormattedMessage id="admin.doctor.manage-profile.profile-loading" /></div>}

          {!loading && error && (
            <div className="profile-error">
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="manage-profile-grid">
              <div className="manage-profile-left">
                <div className="card-section">
                  <div className="section-title"><FormattedMessage id="admin.doctor.manage-profile.profile-title" /></div>

                  <div className="info-row">
                    <div className="info-label"><FormattedMessage id="admin.doctor.manage-profile.profile-doctor" /></div>
                    <div className="info-value">
                      {fullName || <FormattedMessage id="admin.doctor.manage-profile.profile-nodata" />}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label"><FormattedMessage id="admin.doctor.manage-profile.profile-email" /></div>
                    <div className="info-value">
                      {email || <FormattedMessage id="admin.doctor.manage-profile.profile-nodata" />}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label"><FormattedMessage id="admin.doctor.manage-profile.profile-birthday" /></div>
                    <div className="info-value">
                      {info.dateOfBirth || <FormattedMessage id="admin.doctor.manage-profile.profile-nodata" />}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label"><FormattedMessage id="admin.doctor.manage-profile.profile-province" /></div>
                    <div className="info-value">
                      {provinceText || <FormattedMessage id="admin.doctor.manage-profile.profile-nodata" />}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label"><FormattedMessage id="admin.doctor.manage-profile.profile-price" /></div>
                    <div className="info-value">
                      {priceText ? priceText : <FormattedMessage id="admin.doctor.manage-profile.profile-nodata" />}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label"><FormattedMessage id="admin.doctor.manage-profile.profile-payment" /></div>
                    <div className="info-value">
                      {paymentText || <FormattedMessage id="admin.doctor.manage-profile.profile-nodata" />}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label"><FormattedMessage id="admin.doctor.manage-profile.profile-desc" /></div>
                    <div className="info-value">
                      {markdown.description || <FormattedMessage id="admin.doctor.manage-profile.profile-nodata" />}
                    </div>
                  </div>
                </div>

                <div className="card-section card-scroll">
                  <div className="section-title"><FormattedMessage id="admin.doctor.manage-profile.profile-detail" /></div>
                  <div className="scroll-body">
                    <div
                      className="markdown-content"
                      dangerouslySetInnerHTML={{
                        __html:
                          markdown.contentHTML || '<p><FormattedMessage id="admin.doctor.manage-profile.profile-nodata" /></p>',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="manage-profile-right">
                <div className="card-section profile-card">
                  <div className="avatar-wrapper">
                    {image ? (
                      <img src={image} alt="avatar" />
                    ) : (
                      <div className="avatar-placeholder">
                        {basic.firstName?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>

                  <div className="profile-name">
                    {fullName || <FormattedMessage id="admin.doctor.manage-profile.profile-nodata" />}
                  </div>
                  <div className="profile-role">
                    {basic.positionData?.valueVi ||
                      basic.positionData?.valueEn ||
                      'Bác sĩ'}
                  </div>

                  <div className="profile-divider" />

                  <div className="profile-info-row">
                    <span className="icon">
                      <i className="fa-regular fa-envelope" />
                    </span>
                    <span>{email || <FormattedMessage id="admin.doctor.manage-profile.profile-nodata" />}</span>
                  </div>

                  <div className="profile-info-row">
                    <span className="icon">
                      <i className="fa-solid fa-phone" />
                    </span>
                    <span>{phoneNumber || <FormattedMessage id="admin.doctor.manage-profile.profile-nodata" />}</span>
                  </div>

                  <div className="profile-info-row">
                    <span className="icon">
                      <i className="fa-solid fa-location-dot" />
                    </span>
                    <span>{address || <FormattedMessage id="admin.doctor.manage-profile.profile-nodata" />}</span>
                  </div>

                  <div className="profile-actions">
                    <button
                      className="btn-primary"
                      onClick={this.openUpdateModal}
                    >
                      <FormattedMessage id="admin.doctor.manage-profile.profile-btn-update" />
                    </button>
                    <button
                      className="btn-outline"
                      onClick={this.openChangePasswordModal}
                    >
                      <FormattedMessage id="admin.doctor.manage-profile.profile-btn-password" />
                    </button>
                  </div>
                </div>

                <div className="card-section small-note">
                  <div className="section-title"><FormattedMessage id="admin.doctor.manage-profile.profile-idea" /></div>
                  <p>
                    <FormattedMessage id="admin.doctor.manage-profile.profile-p" />
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {showUpdateModal && doctorId && (
          <ProfileUpdate
            isOpen={showUpdateModal}
            doctorId={doctorId}
            onClose={this.closeUpdateModal}
          />
        )}
        {showChangePasswordModal && doctorId && (
          <ChangePassword
            isOpen={showChangePasswordModal}
            doctorId={doctorId}
            onClose={this.closeChangePasswordModal}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

export default connect(mapStateToProps)(ManageProfile);
