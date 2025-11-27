// src/containers/System/Clinic/ManageClinic.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageClinic.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import CommonUtils from '../../../utils/CommonUtils';
import { createNewClinicService } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt();

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      imageBase64: '',
      descriptionHTML: '',
      descriptionMarkdown: '',
    };
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState({
        name: '',
        address: '',
        imageBase64: '',
        descriptionHTML: '',
        descriptionMarkdown: '',
      });
    }
  }

  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionMarkdown: text,
      descriptionHTML: html,
    });
  };

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };

  handleSaveNewClinic = async () => {
    let res = await createNewClinicService(this.state);
    if (res && res.errCode === 0) {
      toast.success('Add new clinic succeed');
      this.setState({
        name: '',
        address: '',
        imageBase64: '',
        descriptionHTML: '',
        descriptionMarkdown: '',
      });

      if (this.props.onSaved) {
        this.props.onSaved();
      }
    } else {
      toast.error(res.errMessage || 'Error');
      console.log('check state clinic: ', this.state);
    }
  };

  render() {
    const { isOpen, onClose } = this.props;

    if (!isOpen) return null;

    return (
      <div className="clinic-modal-overlay" onClick={onClose}>
        <div
          className="clinic-modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="clinic-modal-header">
            <div className="clinic-modal-title">Quản lý phòng khám</div>
            <button className="clinic-modal-close" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="clinic-modal-body">
            <div className="add-new-clinic row">
              <div className="col-6 form-group mb-3">
                <label className="mb-2">Tên phòng khám</label>
                <input
                  className="form-control"
                  type="text"
                  value={this.state.name}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, 'name')
                  }
                />
              </div>

              <div className="col-6 form-group mb-3">
                <label className="mb-2">Địa chỉ phòng khám</label>
                <input
                  className="form-control"
                  type="text"
                  value={this.state.address}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, 'address')
                  }
                />
              </div>

              <div className="img-upload col-6 form-group mb-3">
                <label className="mb-2">Ảnh phòng khám</label>
                <div className="custom-upload">
                    <input
                    id="clinicImage"
                    type="file"
                    className="custom-upload-input"
                    onChange={(event) => this.handleOnChangeImage(event)}
                    />
                    <label htmlFor="clinicImage" className="custom-upload-btn">
                    <i className="fa-solid fa-upload"></i>
                    <span>Chọn ảnh</span>
                    </label>
                    <span className="custom-upload-text">
                    {this.state.imageBase64
                        ? 'Đã chọn 1 ảnh'
                        : 'Chưa có tệp nào được chọn'}
                    </span>
                </div>
            </div>


              <div className="col-12 form-group">
                <MdEditor
                  style={{ height: '300px' }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={this.handleEditorChange}
                  value={this.state.descriptionMarkdown}
                />
              </div>
            </div>
          </div>

          <div className="clinic-modal-footer">
            <button
              className="btn-save-clinic"
              onClick={this.handleSaveNewClinic}
            >
              Save
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
)(ManageClinic);
