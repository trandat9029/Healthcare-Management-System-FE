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
import { getDetailInfoDoctorService } from '../../../services/userService';

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
      nameClinic: '',
      addressClinic: '',
      note: '',
    };
  }

  componentDidMount() {
    this.props.getRequiredDoctorInfoRedux();

    // trường hợp reload lại trang mà redux đã có dữ liệu sẵn
    if (this.props.allRequiredDoctorInfo) {
      this.rebuildSelectOptions();
    }
  }

  componentDidUpdate(prevProps) {
    // khi load xong dữ liệu required cho doctor
    if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
      this.rebuildSelectOptions();
    }

    // khi chọn bác sĩ khác ở TableManageDoctor
    if (prevProps.currentDoctor !== this.props.currentDoctor) {
      if (this.props.currentDoctor) {
        this.loadDoctorDetail(this.props.currentDoctor);
      }
    }

    // đổi ngôn ngữ thì map lại label cho select
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

  // build lại toàn bộ options cho select, sau đó nếu đang có currentDoctor thì load detail luôn
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
        // sau khi options đã sẵn sàng, nếu đang mở modal cho một bác sĩ thì load detail
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

      if (res && res.errCode === 0 && res.data && res.data.Markdown) {
        let detail = res.data;
        let markdown = detail.Markdown;

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
          contentHTML: markdown.contentHTML,
          contentMarkdown: markdown.contentMarkdown,
          description: markdown.description,
          hasOldData: true,

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
      } else {
        // chưa có thông tin, reset form
        this.setState({
          contentHTML: '',
          contentMarkdown: '',
          description: '',
          hasOldData: false,

          selectedPrice: '',
          selectedPayment: '',
          selectedProvince: '',
          selectedSpecialty: '',
          selectedClinic: '',
          nameClinic: '',
          addressClinic: '',
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
      selectedSpecialty: this.state.selectedSpecialty?.value || '',
      selectedClinic: this.state.selectedClinic?.value || '',
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
    });

    // sau khi lưu xong đóng modal
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
      nameClinic,
      addressClinic,
      note,
      contentMarkdown,
      hasOldData,
    } = this.state;

    return (
      <div
        className="doctor-modal-overlay"
        onClick={this.props.onClose}
      >
        <div
          className="doctor-modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="doctor-modal-header">
            <span>
              {hasOldData ? 'Chỉnh sửa thông tin bác sĩ' : 'Tạo thêm thông tin bác sĩ'}
            </span>
            <button
              className="doctor-modal-close"
              onClick={this.props.onClose}
            >
              ×
            </button>
          </div>

          <div className="doctor-modal-body">
            <div className="mb-3">
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
            <button
              className="btn btn-primary"
              onClick={this.handleSave}
            >
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
    saveDetailDoctorRedux: (data) =>
      dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
