// src/containers/System/Handbook/ManageHandbook.js
import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageHandbook.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import CommonUtils from '../../../utils/CommonUtils';
import { toast } from 'react-toastify';
import DatePicker from '../../../components/Input/DatePicker';
import { handleCreateHandbook } from '../../../services/handbookService';

const mdParser = new MarkdownIt();

class ManageHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      author: '',
      datePublish: new Date(),
      imageBase64: '',
      descriptionHTML: '',
      descriptionMarkdown: '',
      isPublished: true, // trạng thái toggle
    };
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps) {
    if (this.props.language !== prevProps.language) {
      // chưa dùng language ở đây
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

  handleOnchangeDatePicker = (date) => {
    // nếu DatePicker trả về mảng [date]
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

  handleSaveNewSpecialty = async () => {
    const payload = {
      ...this.state,
    };

    let res = await handleCreateHandbook(payload);
    if (res && res.errCode === 0) {
      toast.success('Add new handbook succeed');
      this.setState({
        name: '',
        author: '',
        datePublish: new Date(),
        imageBase64: '',
        descriptionHTML: '',
        descriptionMarkdown: '',
        isPublished: true,
      });
    } else {
      toast.error(res.errMessage || 'Error');
      console.log('check state handbook: ', this.state);
    }
  };

  render() {
    let { language } = this.props;
    const { isPublished } = this.state;

    return (
      <div className="manage-handbook-page">
        <div className="manage-handbook-container">
          <div className="ms-header">
            <div className="ms-title"><FormattedMessage id="admin.manage-handbook.handbook-create.title"/></div>
            <div className="ms-subtitle">
              <FormattedMessage id="admin.manage-handbook.handbook-create.subtitle"/>
            </div>
          </div>

          <div className="add-new-handbook">
            {/* Cột trái */}
            <div className="handbook-left">
              <div className="form-group mb-3">
                <label className="mb-2"><FormattedMessage id="admin.manage-handbook.handbook-create.name"/></label>
                <input
                  className="form-control"
                  type="text"
                  value={this.state.name}
                  onChange={(event) => this.handleOnChangeInput(event, 'name')}
                  placeholder="Nhập tiêu đề cẩm nang"
                />
              </div>

              <div className="form-group mb-3">
                <label className="mb-2"><FormattedMessage id="admin.manage-handbook.handbook-create.date-publish"/></label>
                <DatePicker
                  className="form-control"
                  onChange={this.handleOnchangeDatePicker}
                  value={this.state.datePublish}
                />
              </div>

              <div className="form-group editor-wrapper">
                <label className="mb-2"><FormattedMessage id="admin.manage-handbook.handbook-create.content"/></label>
                <MdEditor
                  style={{ height: '380px' }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={this.handleEditorChange}
                  value={this.state.descriptionMarkdown}
                />
              </div>
            </div>

            {/* Cột phải */}
            <div className="handbook-right">
              <div className="form-group mb-3">
                <label className="mb-2"><FormattedMessage id="admin.manage-handbook.handbook-create.author"/></label>
                <input
                  className="form-control"
                  type="text"
                  value={this.state.author}
                  onChange={(event) => this.handleOnChangeInput(event, 'author')}
                  placeholder="Nhập tên tác giả"
                />
              </div>

              <div className="form-group mb-4">
                <label className="mb-2"><FormattedMessage id="admin.manage-handbook.handbook-create.thumbnail"/></label>
                <div className="custom-upload">
                  <input
                    id="handbookImage"
                    className="custom-upload-input"
                    type="file"
                    onChange={(event) => this.handleOnChangeImage(event)}
                  />
                  <label htmlFor="handbookImage" className="custom-upload-btn">
                    <i className="fa-regular fa-image" />
                    <FormattedMessage id="admin.manage-handbook.handbook-create.choose-thumbnail"/>
                  </label>
                  <span className="custom-upload-text">
                    <FormattedMessage id="admin.manage-handbook.handbook-create.not-selected"/>
                  </span>
                </div>
              </div>

              <div className="form-group mb-4 status-row">
                <div className="status-label"><FormattedMessage id="admin.manage-handbook.handbook-create.status"/></div>
                <div
                  className={`toggle-switch ${isPublished ? 'on' : ''}`}
                  onClick={this.handleToggleStatus}
                >
                  <div className="toggle-circle" />
                </div>
                <span className="status-text">
                  {isPublished ? <FormattedMessage id="admin.manage-handbook.handbook-create.status-onl"/> : <FormattedMessage id="admin.manage-handbook.handbook-create.status-off"/>}
                </span>
              </div>

              <div className="form-actions">
                <button
                  className="btn-save-handbook"
                  onClick={this.handleSaveNewSpecialty}
                >
                  <FormattedMessage id="admin.manage-handbook.handbook-create.save"/>
                </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);
