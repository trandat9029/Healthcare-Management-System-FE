// src/containers/System/Profile/ManageProfile.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageProfile.scss';
import { getDetailInfoDoctorService } from '../../../services/doctorService';
import ProfileUpdate from './ProfileUpdate';
import ChangePassword from './ChangePassword';

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
          {loading && <div className="profile-loading">Đang tải hồ sơ...</div>}

          {!loading && error && (
            <div className="profile-error">
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="manage-profile-grid">
              <div className="manage-profile-left">
                <div className="card-section">
                  <div className="section-title">Thông tin khám bệnh</div>

                  <div className="info-row">
                    <div className="info-label">Bác sĩ</div>
                    <div className="info-value">
                      {fullName || 'Chưa cập nhật'}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">Email</div>
                    <div className="info-value">
                      {email || 'Chưa cập nhật'}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">Ngày sinh</div>
                    <div className="info-value">
                      {info.dateOfBirth || 'Chưa cập nhật'}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">Tỉnh thành</div>
                    <div className="info-value">
                      {provinceText || 'Chưa cập nhật'}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">Giá khám</div>
                    <div className="info-value">
                      {priceText ? priceText : 'Chưa cập nhật'}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">Thanh toán</div>
                    <div className="info-value">
                      {paymentText || 'Chưa cập nhật'}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label">Mô tả ngắn</div>
                    <div className="info-value">
                      {markdown.description || 'Chưa cập nhật'}
                    </div>
                  </div>
                </div>

                <div className="card-section card-scroll">
                  <div className="section-title">Giới thiệu chi tiết</div>
                  <div className="scroll-body">
                    <div
                      className="markdown-content"
                      dangerouslySetInnerHTML={{
                        __html:
                          markdown.contentHTML || '<p>Chưa có nội dung</p>',
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
                    {fullName || 'Chưa có tên'}
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
                    <span>{email || 'Chưa cập nhật email'}</span>
                  </div>

                  <div className="profile-info-row">
                    <span className="icon">
                      <i className="fa-solid fa-phone" />
                    </span>
                    <span>{phoneNumber || 'Chưa cập nhật số điện thoại'}</span>
                  </div>

                  <div className="profile-info-row">
                    <span className="icon">
                      <i className="fa-solid fa-location-dot" />
                    </span>
                    <span>{address || 'Chưa cập nhật địa chỉ'}</span>
                  </div>

                  <div className="profile-actions">
                    <button
                      className="btn-primary"
                      onClick={this.openUpdateModal}
                    >
                      Chỉnh sửa hồ sơ
                    </button>
                    <button
                      className="btn-outline"
                      onClick={this.openChangePasswordModal}
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                </div>

                <div className="card-section small-note">
                  <div className="section-title">Gợi ý</div>
                  <p>
                    Bạn nên cập nhật đầy đủ thông tin phòng khám, mô tả chi tiết
                    và ảnh đại diện để bệnh nhân dễ nhận diện và tin tưởng hơn.
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
