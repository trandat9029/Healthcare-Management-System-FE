// src/containers/System/Clinic/ManageClinic.js
import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import CommonUtils from "../../../utils/CommonUtils";
import { createNewClinicService } from "../../../services/clinicService";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

const mdParser = new MarkdownIt();

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      imagePreview: "",
    };
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      if (this.state.imagePreview) {
        URL.revokeObjectURL(this.state.imagePreview);
      }
      this.setState({
        name: "",
        address: "",
        imageBase64: "",
        imagePreview: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
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
    const data = event.target.files;
    const file = data && data[0];

    if (file) {
      const base64 = await CommonUtils.getBase64(file);

      if (this.state.imagePreview) {
        URL.revokeObjectURL(this.state.imagePreview);
      }

      const previewUrl = URL.createObjectURL(file);

      this.setState({
        imageBase64: base64,
        imagePreview: previewUrl,
      });
    }
  };

  handleSaveNewClinic = async () => {
    let res = await createNewClinicService(this.state);
    if (res && res.errCode === 0) {
      toast.success("Add new clinic succeed");
      this.setState({
        name: "",
        address: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
      });

      if (this.props.onSaved) {
        this.props.onSaved();
      }
    } else {
      toast.error(res.errMessage || "Error");
      console.log("check state clinic: ", this.state);
    }
  };

  render() {
    const { isOpen, onClose } = this.props;

    if (!isOpen) return null;

    return (
      <div className="clinic-modal-overlay">
        <div className="clinic-modal-container">
          <div className="clinic-modal-header">
            <div className="clinic-modal-title">
              <FormattedMessage id="admin.manage-clinic.clinic-create.title" />
            </div>
            <button className="clinic-modal-close" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="clinic-modal-body">
            <div className="add-new-clinic row">
              <div className="col-6 form-group mb-3">
                <label className="mb-2">
                  <FormattedMessage id="admin.manage-clinic.clinic-create.name" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={this.state.name}
                  onChange={(event) => this.handleOnChangeInput(event, "name")}
                />
              </div>

              <div className="col-6 form-group mb-3">
                <label className="mb-2">
                  <FormattedMessage id="admin.manage-clinic.clinic-create.address" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={this.state.address}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "address")
                  }
                />
              </div>

              <div className="img-upload col-6 form-group mb-3">
                <label className="mb-2">
                  <FormattedMessage id="admin.manage-clinic.clinic-create.thumbnail" />
                </label>
                <div className="custom-upload">
                  {this.state.imagePreview && (
                    <div className="preview-image">
                      <img
                        src={this.state.imagePreview}
                        alt="Xem trước ảnh phòng khám"
                      />
                    </div>
                  )}

                  <input
                    id="clinicImage"
                    type="file"
                    className="custom-upload-input"
                    onChange={(event) => this.handleOnChangeImage(event)}
                  />
                  <label htmlFor="clinicImage" className="custom-upload-btn">
                    <i className="fa-solid fa-upload"></i>
                    <span>
                      <FormattedMessage id="admin.manage-clinic.clinic-create.choose-thumbnail" />
                    </span>
                  </label>
                  <span className="custom-upload-text">
                    {this.state.imageBase64 ? (
                      <FormattedMessage id="admin.manage-clinic.clinic-create.selected" />
                    ) : (
                      <FormattedMessage id="admin.manage-clinic.clinic-create.not-selected" />
                    )}
                  </span>
                </div>
              </div>

              <div className="col-12 form-group">
                <MdEditor
                  style={{ height: "300px" }}
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
              <FormattedMessage id="admin.manage-clinic.clinic-create.save" />
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
