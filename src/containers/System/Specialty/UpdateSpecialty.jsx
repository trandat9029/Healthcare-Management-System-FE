// src/containers/System/Specialty/ManageSpecialty.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UpdateSpecialty.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import CommonUtils from '../../../utils/CommonUtils';
import { createNewSpecialtyService } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt();

class UpdateSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      imageBase64: '',
      descriptionHTML: '',
      descriptionMarkdown: '',
      loadedId: null, // dùng để biết đang load specialty nào
    };
  }

  // Đồng bộ state từ props mỗi khi mở modal hoặc đổi currentSpecialty
  static getDerivedStateFromProps(nextProps, prevState) {
    const { isOpen, currentSpecialty } = nextProps;

    // Modal đang mở và có specialty để edit
    if (isOpen && currentSpecialty && currentSpecialty.id !== prevState.loadedId) {
      return {
        name: currentSpecialty.name || '',
        imageBase64:
          currentSpecialty.imageBase64 ||
          currentSpecialty.image ||
          '',
        descriptionHTML: currentSpecialty.descriptionHTML || '',
        descriptionMarkdown: currentSpecialty.descriptionMarkdown || '',
        loadedId: currentSpecialty.id || null,
      };
    }

    // Modal đang mở nhưng ở chế độ tạo mới
    if (isOpen && !currentSpecialty && prevState.loadedId !== null) {
      return {
        name: '',
        imageBase64: '',
        descriptionHTML: '',
        descriptionMarkdown: '',
        loadedId: null,
      };
    }

    return null;
  }

  handleOnChangeInput = (event, id) => {
    this.setState({
      [id]: event.target.value,
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

  handleSaveNewSpecialty = async () => {
    const { currentSpecialty } = this.props;

    // Nếu đang ở chế độ edit thì chưa làm API update
    if (currentSpecialty) {
      toast.info('Chức năng cập nhật chuyên khoa sẽ được bổ sung sau');
      return;
    }

    const res = await createNewSpecialtyService(this.state);
    if (res && res.errCode === 0) {
      toast.success('Add new specialty succeed!');
      this.setState({
        name: '',
        imageBase64: '',
        descriptionHTML: '',
        descriptionMarkdown: '',
        loadedId: null,
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
    const { isOpen, onClose } = this.props;
    const { name, imageBase64, descriptionMarkdown } = this.state;

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
                  value={name}
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
                    {imageBase64
                        ? 'Đã chọn ảnh'
                        : 'Chưa có tệp nào được chọn'}
                    </span>

                    {/* Preview ảnh */}
                    {imageBase64 && (
                    <div className="upload-preview">
                        <img src={imageBase64} alt="Ảnh chuyên khoa" />
                    </div>
                    )}

                    <input
                    id="specialtyImage"
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
)(UpdateSpecialty);
