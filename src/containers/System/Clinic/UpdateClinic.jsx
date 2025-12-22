// src/containers/System/Clinic/UpdateClinic.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UpdateClinic.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import CommonUtils from '../../../utils/CommonUtils';
import { handleUpdateClinic } from '../../../services/clinicService';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

const mdParser = new MarkdownIt();

class UpdateClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: '',
      address: '',
      imageBase64: '',
      descriptionHTML: '',
      descriptionMarkdown: '',
      loadedId: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { isOpen, currentClinic } = nextProps;

    if (isOpen && currentClinic && currentClinic.id !== prevState.loadedId) {
      return {
        id: currentClinic.id,
        name: currentClinic.name || '',
        address: currentClinic.address || '',
        imageBase64:
          currentClinic.imageBase64 ||
          currentClinic.image ||
          '',
        descriptionHTML: currentClinic.descriptionHTML || '',
        descriptionMarkdown: currentClinic.descriptionMarkdown || '',
        loadedId: currentClinic.id,
      };
    }

    if (isOpen && !currentClinic && prevState.loadedId !== null) {
      return {
        id: null,
        name: '',
        address: '',
        imageBase64: '',
        descriptionHTML: '',
        descriptionMarkdown: '',
        loadedId: null,
      };
    }

    return null;
  }

  handleOnChangeInput = (event, field) => {
    this.setState({
      [field]: event.target.value,
    });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionMarkdown: text,
      descriptionHTML: html,
    });
  };

  handleOnChangeImage = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };

  handleUpdateClinic = async () => {
    const {
      id,
      name,
      address,
      imageBase64,
      descriptionHTML,
      descriptionMarkdown,
    } = this.state;

    if (!id) {
      toast.error('Thiếu id phòng khám');
      return;
    }

    try {
      const inputData = {
        id,
        name,
        address,
        imageBase64,
        descriptionHTML,
        descriptionMarkdown,
      };

      const res = await handleUpdateClinic(inputData);
      const data = res && res.data ? res.data : res;

      if (data && data.errCode === 0) {
        toast.success('Cập nhật phòng khám thành công');
        if (this.props.onUpdated) {
          this.props.onUpdated();
        }
      } else {
        toast.error(data.errMessage || 'Cập nhật phòng khám thất bại');
      }
    } catch (err) {
      console.log('handleUpdateClinic error', err);
      toast.error('Có lỗi xảy ra khi cập nhật');
    }
  };

  render() {
    const { isOpen, onClose } = this.props;
    const {
      name,
      address,
      imageBase64,
      descriptionMarkdown,
    } = this.state;

    if (!isOpen) return null;

    return (
      <div className="clinic-modal-overlay" onClick={onClose}>
        <div
          className="clinic-modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="clinic-modal-header">
            <div className="clinic-modal-title"><FormattedMessage id="admin.manage-clinic.clinic-edit.title"/></div>
            <button className="clinic-modal-close" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="clinic-modal-body">
            <div className="add-new-clinic row">
              <div className="col-6 form-group mb-3">
                <label className="mb-2"><FormattedMessage id="admin.manage-clinic.clinic-edit.name"/></label>
                <input
                  className="form-control"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, 'name')
                  }
                />
              </div>

              <div className="col-6 form-group mb-3">
                <label className="mb-2"><FormattedMessage id="admin.manage-clinic.clinic-edit.address"/></label>
                <input
                  className="form-control"
                  type="text"
                  value={address}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, 'address')
                  }
                />
              </div>

              <div className="img-upload col-6 form-group mb-3">
                <label className="mb-2"><FormattedMessage id="admin.manage-clinic.clinic-edit.thumbnail"/></label>
                <div className="upload-wrapper">
                  <label
                    htmlFor="clinicImage"
                    className="upload-button"
                  >
                    <i className="fas fa-upload"></i>
                    <span><FormattedMessage id="admin.manage-clinic.clinic-edit.choose-thumbnail"/></span>
                  </label>

                  <span className="upload-file-name">
                    {imageBase64
                      ? <FormattedMessage id="admin.manage-clinic.clinic-edit.selected"/>
                      : <FormattedMessage id="admin.manage-clinic.clinic-edit.not-selected"/>}
                  </span>

                  {imageBase64 && (
                    <div className="upload-preview">
                      <img src={imageBase64} alt="Ảnh phòng khám" />
                    </div>
                  )}

                  <input
                    id="clinicImage"
                    className="form-control-file"
                    type="file"
                    accept="image/*"
                    onChange={this.handleOnChangeImage}
                    hidden
                  />
                </div>
              </div>

              <div className="col-12 form-group">
                <MdEditor
                  style={{ height: '400px' }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={this.handleEditorChange}
                  value={descriptionMarkdown}
                />
              </div>
            </div>
          </div>

          <div className="clinic-modal-footer">
            <button
              className="btn-save-clinic"
              onClick={this.handleUpdateClinic}
            >
              <FormattedMessage id="admin.manage-clinic.clinic-edit.update"/>
            </button>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateClinic);
