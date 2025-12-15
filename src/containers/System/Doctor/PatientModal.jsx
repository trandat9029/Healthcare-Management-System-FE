import React, { Component } from 'react';
import { connect } from 'react-redux';
import './PatientModal.scss';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { CommonUtils } from '../../../utils';

// PatientModal.jsx
class PatientModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        email: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        genderText: '',
        birthday: '',
        insuranceNumber: '',
        note: '',
        reason: '',
        timeString: '',
        statusText: '',

        imgBase64: '',
        };
    }

    componentDidMount() {
        this.syncStateFromProps(this.props);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dataModal !== this.props.dataModal) {
        this.syncStateFromProps(this.props);
        }
    }

    formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(+timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    syncStateFromProps = (props) => {
        const d = props.dataModal || {};
        this.setState({
            email: d.email || '',
            fullName: d.fullName || '',
            phoneNumber: d.phoneNumber || '',
            address: d.address || '',
            genderText: d.genderText || '',
            birthday: this.formatDate(d.birthday) || '',
            insuranceNumber: d.insuranceNumber || '',
            note: d.note || '',
            reason: d.reason || '',
            timeString: d.timeString || '',
            statusText: d.statusText || '',
            imgBase64: '',
        });
    };

    

    render() {
        const { isOpenModal, closePatientModal } = this.props;
        const {
        email,
        fullName,
        phoneNumber,
        address,
        genderText,
        birthday,
        insuranceNumber,
        note,
        reason,
        timeString,
        statusText,
        } = this.state;

        return (
        <Modal
            isOpen={isOpenModal}
            className="patient-modal-container"
            size="lg"
            centered
        >
            <div className="patient-modal-header">
            <h5 className="patient-modal-title">Thông tin bệnh nhân</h5>
            <button
                className="patient-modal-close"
                type="button"
                aria-label="Close"
                onClick={closePatientModal}
            >
                <span aria-hidden="true">×</span>
            </button>
            </div>

            <ModalBody className="patient-modal-body">
            <div className="row">
                <div className="col-6 form-group">
                <label>Họ và tên</label>
                <input className="form-control" value={fullName} disabled />
                </div>
                <div className="col-6 form-group">
                <label>Email</label>
                <input className="form-control" value={email} disabled />
                </div>

                <div className="col-6 form-group">
                <label>Số điện thoại</label>
                <input className="form-control" value={phoneNumber} disabled />
                </div>
                <div className="col-6 form-group">
                <label>Giới tính</label>
                <input className="form-control" value={genderText} disabled />
                </div>

                <div className="col-12 form-group">
                <label>Địa chỉ</label>
                <input className="form-control" value={address} disabled />
                </div>

                <div className="col-6 form-group">
                <label>Ngày sinh</label>
                <input className="form-control" value={birthday} disabled />
                </div>
                <div className="col-6 form-group">
                <label>Số BHYT</label>
                <input className="form-control" value={insuranceNumber} disabled />
                </div>

                <div className="col-12 form-group">
                <label>Lý do khám</label>
                <input className="form-control" value={reason} disabled />
                </div>

                <div className="col-12 form-group">
                <label>Ghi chú</label>
                <input className="form-control" value={note} disabled />
                </div>

                <div className="col-6 form-group">
                <label>Khung giờ</label>
                <input className="form-control" value={timeString} disabled />
                </div>
                <div className="col-6 form-group">
                <label>Trạng thái</label>
                <input className="form-control" value={statusText} disabled />
                </div>
            </div>
            </ModalBody>

            <ModalFooter className="patient-modal-footer">
            <button
                type="button"
                className="btn-patient btn-patient-cancel"
                onClick={closePatientModal}
            >
                Đóng
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

export default connect(mapStateToProps)(PatientModal);
