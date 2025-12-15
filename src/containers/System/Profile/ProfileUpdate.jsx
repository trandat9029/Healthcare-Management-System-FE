// src/containers/System/Profile/ProfileUpdate.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ProfileUpdate.scss';

import * as actions from '../../../store/actions';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import {
  getDetailInfoDoctorService,
  updateProfileDoctorService,
} from '../../../services/doctorService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt();

class ProfileUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // thong tin co ban cua user
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: '',
      image: '',

      // gender + position chuyển sang select
      listGender: [],
      listPosition: [],
      selectedGender: null,
      selectedPosition: null,

      doctorName: '',

      // markdown
      contentMarkdown: '',
      contentHTML: '',
      description: '',
      hasOldData: false,

      // option list cho doctor_info
      listPrice: [],
      listPayment: [],
      listProvince: [],
      listClinic: [],
      listSpecialty: [],

      // gia tri duoc chon
      selectedPrice: null,
      selectedPayment: null,
      selectedProvince: null,
      selectedClinic: null,
      selectedSpecialty: null,
      nameClinic: '',
      addressClinic: '',
      note: '',
    };
  }

  componentDidMount() {
    this.props.getRequiredDoctorInfoRedux();
    if (this.props.allRequiredDoctorInfo) {
      this.rebuildSelectOptions();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
      this.rebuildSelectOptions();
    }

    if (prevProps.language !== this.props.language) {
      if (this.props.allRequiredDoctorInfo) {
        this.rebuildSelectOptions();
      }
    }

    if (prevProps.doctorId !== this.props.doctorId) {
      if (this.props.doctorId && this.props.allRequiredDoctorInfo) {
        this.loadDoctorDetail(this.props.doctorId);
      }
    }
  }

  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let { language } = this.props;

    if (inputData && inputData.length > 0) {
      inputData.forEach((item) => {
        let object = {};

        if (type === 'PRICE') {
          let labelVi = `${item.valueVi} VND`;
          let labelEn = `${item.valueEn} USD`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
        }

        if (type === 'PAYMENT' || type === 'PROVINCE' || type === 'GENDER' || type === 'POSITION') {
          let labelVi = item.valueVi;
          let labelEn = item.valueEn;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
        }

        if (type === 'SPECIALTY') {
          object.label = item.name;
          object.value = item.id;
        }

        if (type === 'CLINIC') {
          object.label = item.name;
          object.value = item.id;
        }

        result.push(object);
      });
    }

    return result;
  };

  rebuildSelectOptions = () => {
    const info = this.props.allRequiredDoctorInfo;
    if (!info) return;

    const listPrice = this.buildDataInputSelect(info.resPrice || [], 'PRICE');
    const listPayment = this.buildDataInputSelect(info.resPayment || [], 'PAYMENT');
    const listProvince = this.buildDataInputSelect(info.resProvince || [], 'PROVINCE');
    const listSpecialty = this.buildDataInputSelect(info.resSpecialty || [], 'SPECIALTY');
    const listClinic = this.buildDataInputSelect(info.resClinic || [], 'CLINIC');

    // 2 list này yêu cầu BE/Redux trả về resGender, resPosition
    const listGender = this.buildDataInputSelect(info.resGender || [], 'GENDER');
    const listPosition = this.buildDataInputSelect(info.resPosition || [], 'POSITION');

    this.setState(
      {
        listPrice,
        listPayment,
        listProvince,
        listSpecialty,
        listClinic,
        listGender,
        listPosition,
      },
      () => {
        if (this.props.doctorId) {
          this.loadDoctorDetail(this.props.doctorId);
        }
      }
    );
  };

  loadDoctorDetail = async (doctorId) => {
    if (!doctorId) return;

    try {
      let res = await getDetailInfoDoctorService(doctorId);

      if (res && res.errCode === 0 && res.data) {
        let detail = res.data;
        let markdown = detail.Markdown || {};

        let priceId = detail.doctorInfoData?.priceId || '';
        let paymentId = detail.doctorInfoData?.paymentId || '';
        let provinceId = detail.doctorInfoData?.provinceId || '';
        let specialtyId = detail.doctorInfoData?.specialtyId || '';
        let clinicId = detail.doctorInfoData?.clinicId || '';
        let nameClinic = detail.doctorInfoData?.nameClinic || '';
        let addressClinic = detail.doctorInfoData?.addressClinic || '';
        let note = detail.doctorInfoData?.note || '';

        const {
          listPrice,
          listPayment,
          listProvince,
          listSpecialty,
          listClinic,
          listGender,
          listPosition,
        } = this.state;

        this.setState({
          // thong tin co ban
          firstName: detail.firstName || '',
          lastName: detail.lastName || '',
          address: detail.address || '',
          phoneNumber: detail.phoneNumber || '',
          image: detail.image || '',

          // set select theo keyMap
          selectedGender: listGender.find((i) => i.value === detail.gender) || null,
          selectedPosition: listPosition.find((i) => i.value === detail.positionId) || null,

          doctorName: `${detail.firstName || ''} ${detail.lastName || ''}`.trim(),

          // markdown
          contentHTML: markdown.contentHTML || '',
          contentMarkdown: markdown.contentMarkdown || '',
          description: markdown.description || '',
          hasOldData: !!markdown.contentMarkdown,

          // doctor_info select
          selectedPrice: listPrice.find((i) => i.value === priceId) || null,
          selectedPayment: listPayment.find((i) => i.value === paymentId) || null,
          selectedProvince: listProvince.find((i) => i.value === provinceId) || null,
          selectedSpecialty: listSpecialty.find((i) => Number(i.value) === Number(specialtyId)) || null,
          selectedClinic: listClinic.find((i) => Number(i.value) === Number(clinicId)) || null,
          nameClinic,
          addressClinic,
          note,
        });
      }
    } catch (e) {
      console.log('loadDoctorDetail error', e);
    }
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };

  handleChangeText = (event, field) => {
    this.setState({
      [field]: event.target.value,
    });
  };

  handleChangeSelect = (selectedOption, name) => {
    const stateName = name.name;
    this.setState({
      [stateName]: selectedOption,
    });
  };

  toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  handleImageChange = async (e) => {
    let file = e.target.files[0];
    if (file) {
      try {
        let base64 = await this.toBase64(file);
        this.setState({
          image: base64,
        });
      } catch (error) {
        console.log('toBase64 error', error);
      }
    }
  };

  handleSave = async () => {
    const payload = {
      doctorId: this.props.doctorId,

      // thong tin co ban
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      address: this.state.address,
      phoneNumber: this.state.phoneNumber,
      image: this.state.image,

      // gửi keyMap cho BE
      gender: this.state.selectedGender?.value || '',
      positionId: this.state.selectedPosition?.value || '',

      // thong tin kham benh
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      action: this.state.hasOldData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

      selectedPrice: this.state.selectedPrice?.value || '',
      selectedPayment: this.state.selectedPayment?.value || '',
      selectedProvince: this.state.selectedProvince?.value || '',
      selectedSpecialty: this.state.selectedSpecialty?.value || '',
      selectedClinic: this.state.selectedClinic?.value || '',
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
    };

    try {
      const res = await updateProfileDoctorService(payload);
      if (res && res.errCode === 0) {
        await this.loadDoctorDetail(this.props.doctorId);
        if (this.props.onClose) this.props.onClose();
        toast.success('Cập nhật hồ sơ cá nhân thành công');
      } else {
        alert(res?.errMessage || 'Update failed');
        toast.error('Cập nhật hồ sơ cá nhân thất bại');
      }
    } catch (e) {
      console.log('update profile error', e);
      alert('Error from the server!');
      toast.error('Cập nhật hồ sơ cá nhân thất bại');
    }
  };

  render() {
    const { isOpen } = this.props;
    if (!isOpen) return null;

    const {
      listGender,
      listPosition,
      listPrice,
      listPayment,
      listProvince,
      listSpecialty,
      listClinic,

      selectedGender,
      selectedPosition,
      selectedPrice,
      selectedPayment,
      selectedProvince,
      selectedSpecialty,
      selectedClinic,

      description,
      nameClinic,
      addressClinic,
      note,
      contentMarkdown,
      hasOldData,
      doctorName,
      firstName,
      lastName,
      address,
      phoneNumber,
      image,
    } = this.state;


    return (
      <div className="profile-modal-overlay" onClick={this.props.onClose}>
        <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="profile-modal-header">
            <span className="profile-modal-title">
              {hasOldData ? 'Chỉnh sửa thông tin bác sĩ' : 'Tạo thêm thông tin bác sĩ'}
            </span>
            <button className="profile-modal-close" onClick={this.props.onClose}>
              ×
            </button>
          </div>

          <div className="profile-modal-body">
            <div className="profile-name-banner">
              <strong>Bác sĩ</strong>
              <span>{doctorName || 'Chưa có tên'}</span>
            </div>

            <div className="profile-section">
              <div className="profile-section-title">Thông tin cơ bản</div>
              <div className="profile-basic-grid">
                <div className="profile-basic-left">
                  <div className="row mb-3">
                    <div className="col-3 form-group">
                      <label>Họ</label>
                      <input
                        className="form-control"
                        type="text"
                        value={lastName}
                        onChange={(e) => this.handleChangeText(e, 'lastName')}
                      />
                    </div>
                    <div className="col-3 form-group">
                      <label>Tên</label>
                      <input
                        className="form-control"
                        type="text"
                        value={firstName}
                        onChange={(e) => this.handleChangeText(e, 'firstName')}
                      />
                    </div>
                    <div className="col-3 form-group">
                      <label>Số điện thoại</label>
                      <input
                        className="form-control"
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => this.handleChangeText(e, 'phoneNumber')}
                      />
                    </div>
                    <div className="col-3 form-group">
                      <label>Giới tính</label>
                      <Select
                        value={selectedGender}
                        onChange={this.handleChangeSelect}
                        options={listGender}
                        name="selectedGender"
                        placeholder="Chọn giới tính"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6 form-group">
                      <label>Địa chỉ</label>
                      <input
                        className="form-control"
                        type="text"
                        value={address}
                        onChange={(e) => this.handleChangeText(e, 'address')}
                      />
                    </div>
                    <div className="col-6 form-group">
                      <label>Chức danh</label>
                      <Select
                        value={selectedPosition}
                        onChange={this.handleChangeSelect}
                        options={listPosition}
                        name="selectedPosition"
                        placeholder="Chọn chức danh"
                      />
                    </div>
                  </div>
                </div>

                <div className="profile-basic-right">
                  <div className="avatar-label">Ảnh đại diện</div>
                  <div className="image-preview-box">
                    {image ? <img src={image} alt="avatar" /> : <div className="image-empty">Chưa có ảnh</div>}
                  </div>

                  <label className="upload-button">
                    <input type="file" accept="image/*" onChange={this.handleImageChange} />
                    <i className="fa-regular fa-image" />
                    <span>Chọn ảnh</span>
                  </label>

                  <div className="upload-hint">Nên dùng ảnh vuông, dung lượng nhỏ hơn 2MB</div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <div className="profile-section-title">Thông tin khám bệnh và phòng khám</div>

              <div className="more-info mb-3">
                <label>Thông tin giới thiệu ngắn</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => this.handleChangeText(e, 'description')}
                />
              </div>

              <div className="more-info-extra mb-3 row">
                <div className="col-4 form-group mb-3">
                  <label>Giá khám</label>
                  <Select
                    value={selectedPrice}
                    onChange={this.handleChangeSelect}
                    options={listPrice}
                    name="selectedPrice"
                    placeholder="Chọn giá khám"
                  />
                </div>

                <div className="col-4 form-group mb-3">
                  <label>Phương thức thanh toán</label>
                  <Select
                    value={selectedPayment}
                    onChange={this.handleChangeSelect}
                    options={listPayment}
                    name="selectedPayment"
                    placeholder="Chọn phương thức"
                  />
                </div>

                <div className="col-4 form-group mb-3">
                  <label>Tỉnh thành</label>
                  <Select
                    value={selectedProvince}
                    onChange={this.handleChangeSelect}
                    options={listProvince}
                    name="selectedProvince"
                    placeholder="Chọn tỉnh thành"
                  />
                </div>

                <div className="col-4 form-group mb-3">
                  <label>Tên phòng khám</label>
                  <input
                    className="form-control"
                    type="text"
                    value={nameClinic}
                    onChange={(e) => this.handleChangeText(e, 'nameClinic')}
                  />
                </div>

                <div className="col-4 form-group mb-3">
                  <label>Địa chỉ phòng khám</label>
                  <input
                    className="form-control"
                    type="text"
                    value={addressClinic}
                    onChange={(e) => this.handleChangeText(e, 'addressClinic')}
                  />
                </div>

                <div className="col-4 form-group mb-3">
                  <label>Ghi chú</label>
                  <input
                    className="form-control"
                    type="text"
                    value={note}
                    onChange={(e) => this.handleChangeText(e, 'note')}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-4 form-group">
                  <label>Chuyên khoa</label>
                  <Select
                    value={selectedSpecialty}
                    onChange={this.handleChangeSelect}
                    options={listSpecialty}
                    name="selectedSpecialty"
                    placeholder="Chọn chuyên khoa"
                  />
                </div>

                <div className="col-4 form-group">
                  <label>Phòng khám</label>
                  <Select
                    value={selectedClinic}
                    onChange={this.handleChangeSelect}
                    options={listClinic}
                    name="selectedClinic"
                    placeholder="Chọn phòng khám"
                  />
                </div>
              </div>
            </div>

            <div className="profile-section">
              <div className="profile-section-title">Nội dung giới thiệu chi tiết</div>
              <div className="manage-profile-editor">
                <MdEditor
                  style={{ height: '360px' }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={this.handleEditorChange}
                  value={contentMarkdown}
                />
              </div>
            </div>
          </div>

          <div className="profile-modal-footer">
            <button className="btn-save" onClick={this.handleSave}>
              {hasOldData ? 'Lưu thông tin' : 'Tạo thông tin'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRequiredDoctorInfoRedux: () => dispatch(actions.getRequiredDoctorInfo()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdate);
