// src/containers/System/Admin/ManageDoctor.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageDoctor.scss';

import * as actions from '../../../store/actions';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { getDetailInfoDoctorService } from '../../../services/doctorService';

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

      // giá trị được chọn
      selectedPrice: '',
      selectedPayment: '',
      selectedProvince: '',
      selectedClinic: '',
      selectedSpecialty: '',

      // thay thế nameClinic, addressClinic bằng dateOfBirth (string)
      dateOfBirth: '',
      note: '',
      avatarUrl: '',
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

    if (prevProps.currentDoctor !== this.props.currentDoctor) {
      const { currentDoctor, allRequiredDoctorInfo } = this.props;
      const { listPrice, listPayment, listProvince, listSpecialty, listClinic } = this.state;

      const optionsReady =
        allRequiredDoctorInfo &&
        listPrice.length &&
        listPayment.length &&
        listProvince.length &&
        listSpecialty.length &&
        listClinic.length;

      if (currentDoctor && optionsReady) {
        this.loadDoctorDetail(currentDoctor);
      }
    }

    if (prevProps.language !== this.props.language) {
      if (this.props.allRequiredDoctorInfo) {
        this.rebuildSelectOptions();
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
    const listPayment = this.buildDataInputSelect(info.resPayment || [], 'PAYMENT');
    const listProvince = this.buildDataInputSelect(info.resProvince || [], 'PROVINCE');
    const listSpecialty = this.buildDataInputSelect(info.resSpecialty || [], 'SPECIALTY');
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
        if (this.props.currentDoctor) {
          this.loadDoctorDetail(this.props.currentDoctor);
        }
      }
    );
  };

  loadDoctorDetail = async (doctor) => {
    if (!doctor || !doctor.id) return;

    try {
      let res = await getDetailInfoDoctorService(doctor.id);
      console.log('check res info doctor', res);

      if (res && res.errCode === 0 && res.data && res.data.Markdown) {
        let detail = res.data;

        let avatarUrl = '';
        if (detail?.image) {
          if (typeof detail.image === 'string' && detail.image.startsWith('data:image')) {
            avatarUrl = detail.image;
          } else {
            avatarUrl = `data:image/jpeg;base64,${detail.image}`;
          }
        }

        let markdown = detail.Markdown;

        let doctorInfo =
          detail.Doctor_info || detail.doctorInfoData || detail.DoctorInfo || null;

        let priceId = doctorInfo?.priceId || '';
        let paymentId = doctorInfo?.paymentId || '';
        let provinceId = doctorInfo?.provinceId || '';
        let specialtyId = doctorInfo?.specialtyId || '';
        let clinicId = doctorInfo?.clinicId || '';
        let dateOfBirth = doctorInfo?.dateOfBirth || '';
        let note = doctorInfo?.note || '';

        const { listPrice, listPayment, listProvince, listSpecialty, listClinic } = this.state;

        this.setState({
          contentHTML: markdown.contentHTML,
          contentMarkdown: markdown.contentMarkdown,
          description: markdown.description,
          hasOldData: true,

          selectedPrice: listPrice.find((i) => i.value === priceId) || '',
          selectedPayment: listPayment.find((i) => i.value === paymentId) || '',
          selectedProvince: listProvince.find((i) => i.value === provinceId) || '',
          selectedSpecialty: listSpecialty.find((i) => i.value === specialtyId) || '',
          selectedClinic: listClinic.find((i) => i.value === clinicId) || '',

          dateOfBirth,
          note,
          avatarUrl,
        });

        
      } else {
        this.setState({
          contentHTML: '',
          contentMarkdown: '',
          description: '',

          hasOldData: false,
          avatarUrl: '',
          selectedPrice: '',
          selectedPayment: '',
          selectedProvince: '',
          selectedSpecialty: '',
          selectedClinic: '',

          dateOfBirth: '',
          note: '',
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

  handleSave = () => {
    const { hasOldData } = this.state;
    const doctor = this.props.currentDoctor;

    if (!doctor || !doctor.id) return;

    this.props.saveDetailDoctorRedux({
      doctorId: doctor.id,
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      action: hasOldData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

      selectedPrice: this.state.selectedPrice?.value || '',
      selectedPayment: this.state.selectedPayment?.value || '',
      selectedProvince: this.state.selectedProvince?.value || '',
      specialtyId: this.state.selectedSpecialty?.value || '',
      clinicId: this.state.selectedClinic?.value || '',

      dateOfBirth: this.state.dateOfBirth, // string
      note: this.state.note,
    });

    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const { isOpen, currentDoctor } = this.props;

    if (!isOpen || !currentDoctor) return null;

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
      dateOfBirth,
      note,
      contentMarkdown,
      hasOldData,
      avatarUrl,
    } = this.state;

            console.log('check state: ', this.state);

    return (
      <div className="doctor-modal-overlay" onClick={this.props.onClose}>
        <div className="doctor-modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="doctor-modal-header">
            <span>
              {hasOldData ? 'Chỉnh sửa thông tin bác sĩ' : 'Tạo thêm thông tin bác sĩ'}
            </span>
            <button className="doctor-modal-close" onClick={this.props.onClose}>
              ×
            </button>
          </div>

          <div className="doctor-modal-body">
            <div className="doctor-info-header">
              <div className="doctor-info-about">
                <div className="mb-3 doctor-info-title">
                  <strong>Bác sĩ. </strong>
                  {currentDoctor.firstName} {currentDoctor.lastName}
                </div>

                <div className="more-info">
                  <div className="content-right">
                    <label>Thông tin giới thiệu</label>
                    <textarea
                      className="form-control"
                      value={description}
                      onChange={(e) => this.handleChangeText(e, 'description')}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="doctor-basic mb-3">
                <div
                  className="doctor-avatar"
                  style={{
                    backgroundImage: `url(${avatarUrl || ''})`,
                  }}
                />
              </div>
            </div>

            <div className="more-info-extra mb-3 row">
              <div className="col-4 form-group mb-3">
                <label>Giá khám</label>
                <Select
                  value={selectedPrice}
                  onChange={this.handleChangeSelect}
                  options={listPrice}
                  name="selectedPrice"
                  placeholder="Giá khám"
                />
              </div>

              <div className="col-4 form-group mb-3">
                <label>Phương thức thanh toán</label>
                <Select
                  value={selectedPayment}
                  onChange={this.handleChangeSelect}
                  options={listPayment}
                  name="selectedPayment"
                  placeholder="Phương thức thanh toán"
                />
              </div>

              <div className="col-4 form-group mb-3">
                <label>Tỉnh thành</label>
                <Select
                  value={selectedProvince}
                  onChange={this.handleChangeSelect}
                  options={listProvince}
                  name="selectedProvince"
                  placeholder="Tỉnh thành"
                />
              </div>

              <div className="col-4 form-group mb-3">
                <label>Ngày sinh</label>
                <input
                  className="form-control"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => this.handleChangeText(e, 'dateOfBirth')}
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
                <label>Chọn chuyên khoa</label>
                <Select
                  value={selectedSpecialty}
                  onChange={this.handleChangeSelect}
                  options={listSpecialty}
                  name="selectedSpecialty"
                  placeholder="Chọn chuyên khoa"
                />
              </div>

              <div className="col-4 form-group">
                <label>Chọn phòng khám</label>
                <Select
                  value={selectedClinic}
                  onChange={this.handleChangeSelect}
                  options={listClinic}
                  name="selectedClinic"
                  placeholder="Chọn phòng khám"
                />
              </div>
            </div>

            <div className="manage-doctor-editor">
              <MdEditor
                style={{ height: '400px' }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={this.handleEditorChange}
                value={contentMarkdown}
              />
            </div>
          </div>

          <div className="doctor-modal-footer">
            <button className="btn btn-primary" onClick={this.handleSave}>
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
    saveDetailDoctorRedux: (data) => dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
