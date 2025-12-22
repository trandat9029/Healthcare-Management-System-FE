// src/containers/System/Handbook/HandbookModal.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HandbookModal.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import CommonUtils from '../../../utils/CommonUtils';
import { toast } from 'react-toastify';
import DatePicker from '../../../components/Input/DatePicker';
import {
  handleCreateHandbook,
  handleEditHandbook,
} from '../../../services/handbookService';
import { FormattedMessage } from 'react-intl';

const mdParser = new MarkdownIt();

class HandbookModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: '',
      author: '',
      datePublish: new Date(),
      imageBase64: '',
      imagePreviewUrl: '',
      imageFileName: '',
      descriptionHTML: '',
      descriptionMarkdown: '',
      isPublished: true,
    };
  }

  componentDidMount() {
    this.initFormFromProps();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.initialData !== this.props.initialData ||
      prevProps.isOpen !== this.props.isOpen
    ) {
      this.initFormFromProps();
    }
  }

  initFormFromProps = () => {
    const { initialData } = this.props;

    if (initialData && initialData.id) {
      this.setState({
        id: initialData.id,
        name: initialData.name || '',
        author: initialData.author || '',
        datePublish: initialData.datePublish
          ? new Date(initialData.datePublish)
          : new Date(),
        imageBase64: initialData.image || '',
        imagePreviewUrl: initialData.image || '',
        imageFileName: initialData.image ? 'Đã có ảnh hiện tại' : '',
        descriptionHTML: initialData.descriptionHTML || '',
        descriptionMarkdown: initialData.descriptionMarkdown || '',
        isPublished:
          typeof initialData.status === 'boolean'
            ? initialData.status
            : true,
      });
    } else {
      this.setState({
        id: null,
        name: '',
        author: '',
        datePublish: new Date(),
        imageBase64: '',
        imagePreviewUrl: '',
        imageFileName: '',
        descriptionHTML: '',
        descriptionMarkdown: '',
        isPublished: true,
      });
    }
  };

  handleOnChangeInput = (event, id) => {
    const value = event.target.value;
    this.setState({
      [id]: value,
    });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionMarkdown: text,
      descriptionHTML: html,
    });
  };

  handleOnChangeImage = async (event) => {
    const files = event.target.files;
    const file = files && files[0];

    if (file) {
      const base64 = await CommonUtils.getBase64(file);

      this.setState({
        imageBase64: base64,
        imagePreviewUrl: base64,
        imageFileName: file.name,
      });
    }
  };

  handleOnchangeDatePicker = (date) => {
    const pickedDate = Array.isArray(date) ? date[0] : date;
    this.setState({
      datePublish: pickedDate,
    });
  };

  handleToggleStatus = () => {
    this.setState((prev) => ({
      isPublished: !prev.isPublished,
    }));
  };

  handleSaveHandbook = async () => {
    const {
      id,
      name,
      author,
      datePublish,
      imageBase64,
      descriptionHTML,
      descriptionMarkdown,
      isPublished,
    } = this.state;

    const payload = {
      id,
      name,
      author,
      datePublish,
      imageBase64,
      descriptionHTML,
      descriptionMarkdown,
      status: isPublished,
    };

    try {
      let res;

      if (id) {
        // edit
        res = await handleEditHandbook(payload);
      } else {
        // create
        res = await handleCreateHandbook(payload);
      }

      if (res && res.errCode === 0) {
        toast.success(id ? 'Update handbook succeed' : 'Add new handbook succeed');

        if (this.props.onSaveSuccess) {
          await this.props.onSaveSuccess();
        }
        if (this.props.onClose) {
          this.props.onClose();
        }

        if (!id) {
          // nếu là tạo mới thì reset form cho lần sau
          this.setState({
            id: null,
            name: '',
            author: '',
            datePublish: new Date(),
            imageBase64: '',
            imagePreviewUrl: '',
            imageFileName: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            isPublished: true,
          });
        }
      } else {
        toast.error(res?.errMessage || 'Error');
      }
    } catch (error) {
      console.log('handleSaveHandbook error: ', error);
      toast.error('Có lỗi xảy ra khi lưu cẩm nang');
    }
  };

  render() {
    const {
      name,
      author,
      datePublish,
      descriptionMarkdown,
      isPublished,
      imagePreviewUrl,
      imageFileName,
      id,
    } = this.state;

    const { onClose } = this.props;

    return (
      <div className="handbook-modal-backdrop">
        <div className="handbook-modal-content">
          <button className="handbook-modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>

          <div className="manage-handbook-container">
            <div className="ms-header">
              <div className="ms-title">
                <FormattedMessage id="admin.manage-handbook.handbook-edit.title"/>
              </div>
              <div className="ms-subtitle">
                <FormattedMessage id="admin.manage-handbook.handbook-edit.subtitle"/>
              </div>
            </div>

            <div className="add-new-handbook">
              {/* Cột trái */}
              <div className="handbook-left">
                <div className="form-group mb-3">
                  <label className="mb-2"><FormattedMessage id="admin.manage-handbook.handbook-edit.name"/></label>
                  <input
                    className="form-control"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, 'name')
                    }
                    placeholder="Nhập tiêu đề cẩm nang"
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="mb-2"><FormattedMessage id="admin.manage-handbook.handbook-edit.date-publish"/></label>
                  <DatePicker
                    className="form-control"
                    onChange={this.handleOnchangeDatePicker}
                    value={datePublish}
                  />
                </div>

                <div className="form-group editor-wrapper">
                  <label className="mb-2"><FormattedMessage id="admin.manage-handbook.handbook-edit.content"/></label>
                  <MdEditor
                    style={{ height: '380px' }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={this.handleEditorChange}
                    value={descriptionMarkdown}
                  />
                </div>
              </div>

              {/* Cột phải */}
              <div className="handbook-right">
                <div className="form-group mb-3">
                  <label className="mb-2"><FormattedMessage id="admin.manage-handbook.handbook-edit.author"/></label>
                  <input
                    className="form-control"
                    type="text"
                    value={author}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, 'author')
                    }
                    placeholder="Nhập tên tác giả"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="mb-2"><FormattedMessage id="admin.manage-handbook.handbook-edit.thumbnail"/></label>
                  <div className="custom-upload">
                    <input
                      id="handbookImage"
                      className="custom-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={this.handleOnChangeImage}
                    />
                    <label
                      htmlFor="handbookImage"
                      className="custom-upload-btn"
                    >
                      <i className="fa-regular fa-image" />
                      <FormattedMessage id="admin.manage-handbook.handbook-edit.choose-thumbnail"/>
                    </label>
                    <span className="custom-upload-text">
                      {imageFileName ? <FormattedMessage id="admin.manage-handbook.handbook-edit.selected"/> : <FormattedMessage id="admin.manage-handbook.handbook-edit.not-selected"/>}
                    </span>
                  </div>

                  {imagePreviewUrl && (
                    <div className="handbook-image-preview">
                      <img src={imagePreviewUrl} alt="Handbook preview" />
                    </div>
                  )}
                </div>

                <div className="form-group mb-4 status-row">
                  <div className="status-label"><FormattedMessage id="admin.manage-handbook.handbook-edit.status"/></div>
                  <div
                    className={`toggle-switch ${isPublished ? 'on' : ''}`}
                    onClick={this.handleToggleStatus}
                  >
                    <div className="toggle-circle" />
                  </div>
                  <span className="status-text">
                    {isPublished ? <FormattedMessage id="admin.manage-handbook.handbook-edit.status-onl"/> : <FormattedMessage id="admin.manage-handbook.handbook-edit.status-off"/>}
                  </span>
                </div>

                <div className="form-actions">
                  <button
                    className="btn-save-handbook"
                    onClick={this.handleSaveHandbook}
                  >
                    <FormattedMessage id="admin.manage-handbook.handbook-edit.update"/>
                  </button>
                </div>
              </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HandbookModal);
