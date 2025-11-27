// src/containers/System/Specialty/ManageSpecialty.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageSpecialty.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import CommonUtils from '../../../utils/CommonUtils';
import { createNewSpecialtyService } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      imageBase64: '',
      descriptionHTML: '',
      descriptionMarkdown: '',
    };
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      // hiện tại chưa dùng language trong form này
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

  handleSaveNewSpecialty = async () => {
    let res = await createNewSpecialtyService(this.state);
    if (res && res.errCode === 0) {
      toast.success('Add new specialty succeed!');
      this.setState({
        name: '',
        imageBase64: '',
        descriptionHTML: '',
        descriptionMarkdown: '',
      });

      if (this.props.onSaved) {
        this.props.onSaved();
      }
    } else {
      toast.error(res.errMessage || 'Error!');
      console.log('check state specialty: ', this.state);
    }
  };

  render() {
    const { language, isOpen, onClose } = this.props;

    if (!isOpen) return null;

    return (
      <div className="specialty-modal-overlay" onClick={onClose}>
        <div
          className="specialty-modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="specialty-modal-header">
            <div className="specialty-modal-title">Quản lý chuyên khoa</div>
            <button className="specialty-modal-close" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="specialty-modal-body">
            <div className="add-new-specialty row">
              <div className="col-6 form-group mb-3">
                <label className="mb-2">Tên chuyên khoa</label>
                <input
                  className="form-control"
                  type="text"
                  value={this.state.name}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, 'name')
                  }
                />
              </div>
              <div className="img-upload col-6 form-group mb-3">
                <label className="mb-2">Ảnh chuyên khoa</label>
                <div className="upload-wrapper">
                    <label
                    htmlFor="specialtyImage"
                    className="upload-button"
                    >
                    <i className="fas fa-upload"></i>
                    <span>Chọn ảnh</span>
                    </label>

                    <span className="upload-file-name">
                    {this.state.imageBase64
                        ? 'Đã chọn ảnh'
                        : 'Chưa có tệp nào được chọn'}
                    </span>

                    <input
                    id="specialtyImage"
                    className="form-control-file"
                    type="file"
                    accept="image/*"
                    onChange={(event) => this.handleOnChangeImage(event)}
                    hidden
                    />
                </div>
                </div>

              <div className="col-12 form-group">
                <MdEditor
                  style={{ height: '400px' }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={this.handleEditorChange}
                  value={this.state.descriptionMarkdown}
                />
              </div>
            </div>
          </div>

          <div className="specialty-modal-footer">
            <button
              className="btn-save-specialty"
              onClick={this.handleSaveNewSpecialty}
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
)(ManageSpecialty);
