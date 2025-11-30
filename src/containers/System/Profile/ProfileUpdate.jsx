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
import { getDetailInfoDoctorService } from '../../../services/doctorService';

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
      gender: '',
      position: '',
      image: '',

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
      selectedPrice: '',
      selectedPayment: '',
      selectedProvince: '',
      selectedClinic: '',
      selectedSpecialty: '',
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
    if (
      prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo
    ) {
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

        if (type === 'PAYMENT' || type === 'PROVINCE') {
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
    const listPayment = this.buildDataInputSelect(
      info.resPayment || [],
      'PAYMENT'
    );
    const listProvince = this.buildDataInputSelect(
      info.resProvince || [],
      'PROVINCE'
    );
    const listSpecialty = this.buildDataInputSelect(
      info.resSpecialty || [],
      'SPECIALTY'
    );
    const listClinic = this.buildDataInputSelect(info.resClinic || [], 'CLINIC');

    this.setState(
      {
        listPrice,
        listPayment,
        listProvince,
        listSpecialty,
        listClinic,
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

        let priceId = detail.Doctor_info?.priceId || '';
        let paymentId = detail.Doctor_info?.paymentId || '';
        let provinceId = detail.Doctor_info?.provinceId || '';
        let specialtyId = detail.Doctor_info?.specialtyId || '';
        let clinicId = detail.Doctor_info?.clinicId || '';
        let nameClinic = detail.Doctor_info?.nameClinic || '';
        let addressClinic = detail.Doctor_info?.addressClinic || '';
        let note = detail.Doctor_info?.note || '';

        const {
          listPrice,
          listPayment,
          listProvince,
          listSpecialty,
          listClinic,
        } = this.state;

        this.setState({
          // thong tin co ban
          firstName: detail.firstName || '',
          lastName: detail.lastName || '',
          address: detail.address || '',
          phoneNumber: detail.phoneNumber || '',
          gender:
            detail.genderData?.valueVi ||
            detail.genderData?.valueEn ||
            detail.gender ||
            '',
          position:
            detail.positionData?.valueVi ||
            detail.positionData?.valueEn ||
            '',
          image: detail.image || '',

          doctorName: `${detail.firstName || ''} ${
            detail.lastName || ''
          }`.trim(),

          // markdown
          contentHTML: markdown.contentHTML || '',
          contentMarkdown: markdown.contentMarkdown || '',
          description: markdown.description || '',
          hasOldData: !!markdown.contentMarkdown,

          // doctor_info select
          selectedPrice: listPrice.find((i) => i.value === priceId) || '',
          selectedPayment: listPayment.find((i) => i.value === paymentId) || '',
          selectedProvince:
            listProvince.find((i) => i.value === provinceId) || '',
          selectedSpecialty:
            listSpecialty.find((i) => i.value === specialtyId) || '',
          selectedClinic: listClinic.find((i) => i.value === clinicId) || '',
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

  handleSave = () => {
    const payload = {
      doctorId: this.props.doctorId,

      // thong tin co ban
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      address: this.state.address,
      phoneNumber: this.state.phoneNumber,
      gender: this.state.gender,
      position: this.state.position,
      image: this.state.image,

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

    console.log('ProfileUpdate payload', payload);

    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const { isOpen } = this.props;
    if (!isOpen) return null;

    const {
      listPrice,
      listPayment,
      listProvince,
      listSpecialty,
      listClinic,
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
      gender,
      position,
      image,
    } = this.state;

    return (
      <div className="doctor-modal-overlay" onClick={this.props.onClose}>
        <div
          className="doctor-modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="doctor-modal-header">
            <span className="doctor-modal-title">
              {hasOldData
                ? 'Chỉnh sửa thông tin bác sĩ'
                : 'Tạo thêm thông tin bác sĩ'}
            </span>
            <button
              className="doctor-modal-close"
              onClick={this.props.onClose}
            >
              ×
            </button>
          </div>

          <div className="doctor-modal-body">
            {/* dòng tên bác sĩ */}
            <div className="doctor-name-banner">
              <strong>Bác sĩ</strong>
              <span>{doctorName || 'Chưa có tên'}</span>
            </div>

            {/* khối 1: thông tin cơ bản và avatar */}
            <div className="doctor-section">
              <div className="doctor-section-title">Thông tin cơ bản</div>
              <div className="doctor-basic-grid">
                <div className="doctor-basic-left">
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
                        onChange={(e) =>
                          this.handleChangeText(e, 'phoneNumber')
                        }
                      />
                    </div>
                    <div className="col-3 form-group">
                      <label>Giới tính</label>
                      <input
                        className="form-control"
                        type="text"
                        value={gender}
                        onChange={(e) => this.handleChangeText(e, 'gender')}
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
                      <input
                        className="form-control"
                        type="text"
                        value={position}
                        onChange={(e) =>
                          this.handleChangeText(e, 'position')
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="doctor-basic-right">
                  <div className="avatar-label">Ảnh đại diện</div>
                  <div className="image-preview-box">
                    {image ? (
                      <img src={image} alt="avatar" />
                    ) : (
                      <div className="image-empty">Chưa có ảnh</div>
                    )}
                  </div>

                  <label className="upload-button">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={this.handleImageChange}
                    />
                    <i className="fa-regular fa-image" />
                    <span>Chọn ảnh</span>
                  </label>

                  <div className="upload-hint">
                    Nên dùng ảnh vuông, dung lượng nhỏ hơn 2MB
                  </div>
                </div>
              </div>
            </div>

            {/* khối 2: thông tin khám bệnh */}
            <div className="doctor-section">
              <div className="doctor-section-title">
                Thông tin khám bệnh và phòng khám
              </div>

              <div className="more-info mb-3">
                <label>Thông tin giới thiệu ngắn</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) =>
                    this.handleChangeText(e, 'description')
                  }
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
                    onChange={(e) =>
                      this.handleChangeText(e, 'nameClinic')
                    }
                  />
                </div>

                <div className="col-4 form-group mb-3">
                  <label>Địa chỉ phòng khám</label>
                  <input
                    className="form-control"
                    type="text"
                    value={addressClinic}
                    onChange={(e) =>
                      this.handleChangeText(e, 'addressClinic')
                    }
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

            {/* khối 3: nội dung chi tiết */}
            <div className="doctor-section">
              <div className="doctor-section-title">Nội dung giới thiệu chi tiết</div>
              <div className="manage-doctor-editor">
                <MdEditor
                  style={{ height: '360px' }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={this.handleEditorChange}
                  value={contentMarkdown}
                />
              </div>
            </div>
          </div>

          <div className="doctor-modal-footer">
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
    getRequiredDoctorInfoRedux: () =>
      dispatch(actions.getRequiredDoctorInfo()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdate);
