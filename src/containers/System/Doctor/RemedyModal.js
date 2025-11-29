import React, { Component } from 'react';
import { connect } from 'react-redux';
import './RemedyModal.scss';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { CommonUtils } from '../../../utils';

class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      imgBase64: '',
    };
  }

  async componentDidMount() {
    if (this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.dataModal !== this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }

  handleOnchangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handleOnChangeImage = async (event) => {
    const data = event.target.files;
    const file = data && data[0];
    if (file) {
      const base64 = await CommonUtils.getBase64(file);
      this.setState({
        imgBase64: base64,
      });
    }
  };

  handleSendRemedy = () => {
    if (this.props.sendRemedy) {
      this.props.sendRemedy(this.state);
    }
  };

  render() {
    const { isOpenModal, closeRemedyModal } = this.props;
    const { email } = this.state;

    return (
      <Modal
        isOpen={isOpenModal}
        className="remedy-modal-container"
        size="md"
        centered
      >
        <div className="remedy-modal-header">
          <h5 className="remedy-modal-title">
            Gửi hóa đơn khám bệnh thành công
          </h5>
          <button
            className="remedy-modal-close"
            type="button"
            aria-label="Close"
            onClick={closeRemedyModal}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <ModalBody className="remedy-modal-body">
          <div className="row">
            <div className="col-6 form-group">
              <label>Email bệnh nhân</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={this.handleOnchangeEmail}
              />
            </div>
            <div className="col-6 form-group">
              <label>Chọn file hóa đơn</label>
              <input
                className="form-control"
                type="file"
                onChange={this.handleOnChangeImage}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="remedy-modal-footer">
          <button
            type="button"
            className="btn-remedy btn-remedy-send"
            onClick={this.handleSendRemedy}
          >
            Send
          </button>
          <button
            type="button"
            className="btn-remedy btn-remedy-cancel"
            onClick={closeRemedyModal}
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(RemedyModal);
