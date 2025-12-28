// src/containers/Patient/Doctor/Modal/BookingModal.js
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import Select from "react-select";
import { postPatientBookAppointmentService } from "../../../../services/bookingService";
import { toast } from "react-toastify";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      note: "",
      insuranceNumber: "",
      birthday: "",
      selectedGender: "",
      doctorId: "",
      genders: [],
      timeType: "",
      isShowLoading: false,
    };
  }

  async componentDidMount() {
    this.props.fetchGenders();
  }

  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;

    if (data && data.length > 0) {
      data.forEach((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };

  async componentDidUpdate(prevProps) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }

    if (this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }

    if (this.props.dataTime !== prevProps.dataTime) {
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        let doctorId = this.props.dataTime.doctorId;
        let timeType = this.props.dataTime.timeType;
        this.setState({
          doctorId: doctorId,
          timeType: timeType,
        });
      }
    }
  }

  handleOnchangeInput = (event, id) => {
    let valueInput = event.target.value;
    this.setState({
      [id]: valueInput,
    });
  };

  handleOnchangeDatePicker = (date) => {
    this.setState({
      birthday: date[0],
    });
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({
      selectedGender: selectedOption,
    });
  };

  buildDataBooking = (dataTime) => {
    let { language } = this.props;

    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd . DD/MM/YYYY")
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("ddd . MM/DD/YYYY");
      return `${time} . ${date}`;
    }
    return "";
  };

  buildDoctorName = (dataTime) => {
    let { language } = this.props;

    if (dataTime && !_.isEmpty(dataTime)) {
      let name =
        language === LANGUAGES.VI
          ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
          : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
      return name;
    }
    return "";
  };

  handleConfirmBooking = async () => {
    this.setState({
      isShowLoading: true,
    });

    let date = new Date(this.state.birthday).getTime();
    let timeString = this.buildDataBooking(this.props.dataTime);
    let doctorName = this.buildDoctorName(this.props.dataTime);

    // gộp họ tên cho backend cũ nếu cần
    let fullName = `${this.state.lastName} ${this.state.firstName}`.trim();

    let res = await postPatientBookAppointmentService({
      // thông tin bắt buộc cũ
      fullName: fullName,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      reason: this.state.reason,
      date: this.props.dataTime.date,
      birthday: date,
      selectedGender: this.state.selectedGender?.value,
      doctorId: this.state.doctorId,
      timeType: this.state.timeType,
      language: this.props.language,
      timeString: timeString,
      doctorName: doctorName,

      // trường mới
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      note: this.state.note,
      insuranceNumber: this.state.insuranceNumber,
    });

    this.setState({
      isShowLoading: false,
    });

    if (res && res.errCode === 0) {
      toast.success(
        "Đã gửi email xác nhận. Vui lòng kiểm tra email để hoàn tất."
      );
      // báo cha refetch schedule
      if (this.props.onBookingSuccess) {
        await this.props.onBookingSuccess();
        return;
      }
      this.props.closeBookingModal();
    } else if (res && res.errCode === 4) {
      toast.error("Khung giờ đã đủ người. Vui lòng chọn khung giờ khác.");
    } else if (res && res.errCode === 2) {
      toast.error("Bạn đã đặt khung giờ này rồi.");
    } else {
      toast.error(res?.errMessage || "Đặt lịch thất bại. Vui lòng thử lại.");
    }
  };

  render() {
    let { language, isOpenModal, closeBookingModal, dataTime } = this.props;
    let doctorId = "";
    if (dataTime && !_.isEmpty(dataTime)) {
      doctorId = dataTime.doctorId;
    }

    // return (
    //   <LoadingOverlay
    //     active={this.state.isShowLoading}
    //     spinner
    //     text="Đang tải..."
    //     styles={{
    //       overlay: (base) => ({
    //         ...base,
    //         position: 'fixed',
    //         top: 0,
    //         left: 0,
    //         width: '100vw',
    //         height: '100vh',
    //         zIndex: 2000,
    //       }),
    //     }}
    //   >
    //     <Modal
    //       isOpen={isOpenModal}
    //       className="booking-modal-container"
    //       size="lg"
    //       centered
    //     >
    //       <div className="booking-modal-content">
    //         <div className="booking-modal-header">
    //           <span className="left">
    //             <FormattedMessage id="patient.booking-modal.title" />
    //           </span>
    //           <span className="right" onClick={closeBookingModal}>
    //             <i className="fa-solid fa-circle-xmark" />
    //           </span>
    //         </div>

    //         <div className="booking-modal-body">
    //           <div className="doctor-info">
    //             <ProfileDoctor
    //               doctorId={doctorId}
    //               isShowDescriptionDoctor={false}
    //               dataTime={dataTime}
    //               isShowLinkDetail={false}
    //               isShowPrice={true}
    //             />
    //           </div>

    //           <div className="booking-form row">
    //             {/* Họ tên */}
    //             <div className="col-6 form-group my-2">
    //                 <label>
    //                 <FormattedMessage
    //                     id="patient.booking-modal.lastName"
    //                 />
    //                 </label>
    //                 <input
    //                 type="text"
    //                 className="form-control"
    //                 value={this.state.lastName}
    //                 onChange={(event) => this.handleOnchangeInput(event, 'lastName')}
    //                 />
    //             </div>

    //             <div className="col-6 form-group my-2">
    //                 <label>
    //                 <FormattedMessage
    //                     id="patient.booking-modal.firstName"
    //                 />
    //                 </label>
    //                 <input
    //                 type="text"
    //                 className="form-control"
    //                 value={this.state.firstName}
    //                 onChange={(event) => this.handleOnchangeInput(event, 'firstName')}
    //                 />
    //             </div>

    //             {/* Giới tính . Ngày sinh  đưa lên cao hơn */}
    //             <div className="col-6 form-group my-2">
    //                 <label>
    //                 <FormattedMessage
    //                     id="patient.booking-modal.gender"
    //                     defaultMessage="Giới tính"
    //                 />
    //                 </label>
    //                 <Select
    //                 value={this.state.selectedGender}
    //                 onChange={this.handleChangeSelect}
    //                 options={this.state.genders}
    //                 className="booking-select-gender"
    //                 />
    //             </div>

    //             <div className="col-6 form-group my-2">
    //                 <label>
    //                 <FormattedMessage
    //                     id="patient.booking-modal.birthday"
    //                     defaultMessage="Ngày sinh"
    //                 />
    //                 </label>
    //                 <DatePicker
    //                 className="form-control"
    //                 onChange={this.handleOnchangeDatePicker}
    //                 value={this.state.birthday}
    //                 />
    //             </div>

    //             {/* Số điện thoại . Email */}
    //             <div className="col-6 form-group my-2">
    //                 <label>
    //                 <FormattedMessage
    //                     id="patient.booking-modal.phoneNumber"
    //                     defaultMessage="Số điện thoại"
    //                 />
    //                 </label>
    //                 <input
    //                 type="text"
    //                 className="form-control"
    //                 value={this.state.phoneNumber}
    //                 onChange={(event) =>
    //                     this.handleOnchangeInput(event, 'phoneNumber')
    //                 }
    //                 />
    //             </div>

    //             <div className="col-6 form-group my-2">
    //                 <label>
    //                 <FormattedMessage
    //                     id="patient.booking-modal.email"
    //                     defaultMessage="Địa chỉ email"
    //                 />
    //                 </label>
    //                 <input
    //                 type="text"
    //                 className="form-control"
    //                 value={this.state.email}
    //                 onChange={(event) => this.handleOnchangeInput(event, 'email')}
    //                 />
    //             </div>

    //             {/* Địa chỉ . Mã thẻ bảo hiểm */}
    //             <div className="col-6 form-group my-2">
    //                 <label>
    //                 <FormattedMessage
    //                     id="patient.booking-modal.address"
    //                     defaultMessage="Địa chỉ liên lạc"
    //                 />
    //                 </label>
    //                 <input
    //                 type="text"
    //                 className="form-control"
    //                 value={this.state.address}
    //                 onChange={(event) => this.handleOnchangeInput(event, 'address')}
    //                 />
    //             </div>

    //             <div className="col-6 form-group my-2">
    //                 <label>
    //                 <FormattedMessage
    //                     id="patient.booking-modal.insuranceNumber"
    //                     defaultMessage="Mã thẻ bảo hiểm y tế"
    //                 />
    //                 </label>
    //                 <input
    //                 type="text"
    //                 className="form-control"
    //                 value={this.state.insuranceNumber}
    //                 onChange={(event) =>
    //                     this.handleOnchangeInput(event, 'insuranceNumber')
    //                 }
    //                 />
    //             </div>

    //             {/* Lý do khám */}
    //             <div className="col-12 form-group my-2">
    //                 <label>
    //                 <FormattedMessage
    //                     id="patient.booking-modal.reason"
    //                     defaultMessage="Lý do khám"
    //                 />
    //                 </label>
    //                 <input
    //                 type="text"
    //                 className="form-control"
    //                 value={this.state.reason}
    //                 onChange={(event) => this.handleOnchangeInput(event, 'reason')}
    //                 />
    //             </div>

    //             {/* Ghi chú cho bác sĩ */}
    //             <div className="col-12 form-group my-2">
    //                 <label>
    //                 <FormattedMessage
    //                     id="patient.booking-modal.note"
    //                     defaultMessage="Ghi chú cho bác sĩ"
    //                 />
    //                 </label>
    //                 <textarea
    //                 rows={2}
    //                 className="form-control form-control-textarea"
    //                 value={this.state.note}
    //                 onChange={(event) => this.handleOnchangeInput(event, 'note')}
    //                 />
    //             </div>
    //             </div>

    //         </div>

    //         <div className="booking-modal-footer">
    //           <button
    //             className="btn btn-booking-confirm"
    //             onClick={this.handleConfirmBooking}
    //           >
    //             <FormattedMessage id="patient.booking-modal.btnConfirm" />
    //           </button>
    //           <button
    //             className="btn btn-booking-cancel"
    //             onClick={closeBookingModal}
    //           >
    //             <FormattedMessage id="patient.booking-modal.btnCancel" />
    //           </button>
    //         </div>
    //       </div>
    //     </Modal>
    //   </LoadingOverlay>
    // );

    return (
      <>
        <Modal
          isOpen={isOpenModal}
          className="booking-modal-container"
          size="lg"
          centered
        >
          <LoadingOverlay
            active={this.state.isShowLoading}
            spinner
            text="Đang tải..."
          >
            {/* Toàn bộ content bạn giữ y nguyên */}
            <div className="booking-modal-content">
              <div className="booking-modal-header">
                <span className="left">
                  <FormattedMessage id="patient.booking-modal.title" />
                </span>
                <span className="right" onClick={closeBookingModal}>
                  <i className="fa-solid fa-circle-xmark" />
                </span>
              </div>

              <div className="booking-modal-body">
                <div className="doctor-info">
                  <ProfileDoctor
                    doctorId={doctorId}
                    isShowDescriptionDoctor={false}
                    dataTime={dataTime}
                    isShowLinkDetail={false}
                    isShowPrice={true}
                  />
                </div>

                <div className="booking-form row">
                  {/* Họ tên */}
                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage id="patient.booking-modal.firstName" />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.lastName}
                      onChange={(event) =>
                        this.handleOnchangeInput(event, "lastName")
                      }
                    />
                  </div>

                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage id="patient.booking-modal.lastName" />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.firstName}
                      onChange={(event) =>
                        this.handleOnchangeInput(event, "firstName")
                      }
                    />
                  </div>

                  {/* Giới tính . Ngày sinh  đưa lên cao hơn */}
                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage
                        id="patient.booking-modal.gender"
                        defaultMessage="Giới tính"
                      />
                    </label>
                    <Select
                      value={this.state.selectedGender}
                      onChange={this.handleChangeSelect}
                      options={this.state.genders}
                      className="booking-select-gender"
                    />
                  </div>

                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage
                        id="patient.booking-modal.birthday"
                        defaultMessage="Ngày sinh"
                      />
                    </label>
                    <DatePicker
                      className="form-control"
                      onChange={this.handleOnchangeDatePicker}
                      value={this.state.birthday}
                    />
                  </div>

                  {/* Số điện thoại . Email */}
                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage
                        id="patient.booking-modal.phoneNumber"
                        defaultMessage="Số điện thoại"
                      />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.phoneNumber}
                      onChange={(event) =>
                        this.handleOnchangeInput(event, "phoneNumber")
                      }
                    />
                  </div>

                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage
                        id="patient.booking-modal.email"
                        defaultMessage="Địa chỉ email"
                      />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.email}
                      onChange={(event) =>
                        this.handleOnchangeInput(event, "email")
                      }
                    />
                  </div>

                  {/* Địa chỉ . Mã thẻ bảo hiểm */}
                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage
                        id="patient.booking-modal.address"
                        defaultMessage="Địa chỉ liên lạc"
                      />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.address}
                      onChange={(event) =>
                        this.handleOnchangeInput(event, "address")
                      }
                    />
                  </div>

                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage
                        id="patient.booking-modal.insuranceNumber"
                        defaultMessage="Mã thẻ bảo hiểm y tế"
                      />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.insuranceNumber}
                      onChange={(event) =>
                        this.handleOnchangeInput(event, "insuranceNumber")
                      }
                    />
                  </div>

                  {/* Lý do khám */}
                  <div className="col-12 form-group my-2">
                    <label>
                      <FormattedMessage
                        id="patient.booking-modal.reason"
                        defaultMessage="Lý do khám"
                      />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.reason}
                      onChange={(event) =>
                        this.handleOnchangeInput(event, "reason")
                      }
                    />
                  </div>

                  {/* Ghi chú cho bác sĩ */}
                  <div className="col-12 form-group my-2">
                    <label>
                      <FormattedMessage
                        id="patient.booking-modal.note"
                        defaultMessage="Ghi chú cho bác sĩ"
                      />
                    </label>
                    <textarea
                      rows={2}
                      className="form-control form-control-textarea"
                      value={this.state.note}
                      onChange={(event) =>
                        this.handleOnchangeInput(event, "note")
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="booking-modal-footer">
                <button
                  className="btn btn-booking-confirm"
                  onClick={this.handleConfirmBooking}
                  disabled={this.state.isShowLoading}
                >
                  <FormattedMessage id="patient.booking-modal.btnConfirm" />
                </button>
                <button
                  className="btn btn-booking-cancel"
                  onClick={closeBookingModal}
                >
                  <FormattedMessage id="patient.booking-modal.btnCancel" />
                </button>
              </div>
            </div>
          </LoadingOverlay>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGenders: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
