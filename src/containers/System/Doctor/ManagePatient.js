import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import { getAllCodeService } from "../../../services/userService";

import moment from "moment";
import { LANGUAGES } from "../../../utils";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import Select from "react-select";
import {
  getAllPatientForDoctorService,
  postSendRemedy,
  handleCancelBookingByDoctor,
} from "../../../services/doctorService";
import PatientModal from "./PatientModal";

const savedDate = localStorage.getItem("mp_currentDate");

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: savedDate
        ? Number(savedDate)
        : moment().startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      isOpenPatientModal: false,
      dataModal: {},
      isShowLoading: false,

      // filter UI
      listTime: [],
      selectedTime: null,
      listStatus: [],
      selectedStatus: null,
      keyword: "",
    };
  }

  async componentDidMount() {
    await this.fetchFilterOptions();
    this.getDataPatient();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.language !== prevProps.language) {
      await this.fetchFilterOptions();
    }
  }

  fetchFilterOptions = async () => {
    try {
      const [resTime, resStatus] = await Promise.all([
        getAllCodeService("TIME"),
        getAllCodeService("STATUS"),
      ]);

      const listTime =
        resTime && resTime.errCode === 0
          ? this.buildOptionsFromAllcode(resTime.data)
          : [];

      const listStatus =
        resStatus && resStatus.errCode === 0
          ? this.buildOptionsFromAllcode(resStatus.data)
          : [];

      this.setState({
        listTime,
        listStatus,
      });
    } catch (error) {
      console.log("fetchFilterOptions error:", error);
    }
  };

  handleCancelBooking = async (item) => {
    try {
      const { user, language } = this.props;

      if (!item?.statusId || !["S1", "S2"].includes(item.statusId)) {
        toast.warning("Chỉ được hủy lịch khi trạng thái là S1 hoặc S2");
        return;
      }

      const ok = window.confirm("Bạn chắc chắn muốn hủy lịch khám này không?");
      if (!ok) return;

      // bật loading khi bắt đầu hủy
      this.setState({ isShowLoading: true });

      const payload = {
        bookingId: item.id,
        doctorId: user.id,
        language,
        cancelReason: "Bác sĩ hủy lịch",
      };

      const res = await handleCancelBookingByDoctor(payload);

      if (res && res.errCode === 0) {
        toast.success("Hủy lịch thành công. Đã gửi email cho bệnh nhân.");
        await this.getDataPatient();
      } else {
        toast.error(res?.errMessage || "Hủy lịch thất bại");
      }
    } catch (e) {
      console.log(e);
      toast.error("Có lỗi khi hủy lịch");
    } finally {
      // tắt loading dù thành công hay lỗi
      this.setState({ isShowLoading: false });
    }
  };

  buildOptionsFromAllcode = (data) => {
    const { language } = this.props;
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      value: item.keyMap,
      label: language === LANGUAGES.VI ? item.valueVi : item.valueEn,
    }));
  };

  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate, selectedTime, selectedStatus, keyword } = this.state;

    const formatedDate = moment(currentDate).startOf("day").valueOf();

    let res = await getAllPatientForDoctorService({
      doctorId: user.id,
      date: formatedDate,
      timeType: selectedTime ? selectedTime.value : "",
      statusId: selectedStatus ? selectedStatus.value : "",
      keyword: keyword || "",
    });

    if (res && res.errCode === 0) {
      this.setState({ dataPatient: res.data });
    }
  };

  handleOnChangeDatePicker = (date) => {
    const selected = moment(date[0]).startOf("day").valueOf();
    localStorage.setItem("mp_currentDate", String(selected));

    this.setState({ currentDate: selected }, async () => {
      await this.getDataPatient();
    });
  };

  handleChangeTime = async (selectedTime) => {
    this.setState({ selectedTime }, async () => {
      await this.getDataPatient();
    });
  };

  handleChangeStatus = async (selectedStatus) => {
    this.setState({ selectedStatus }, async () => {
      await this.getDataPatient();
    });
  };

  handleChangeKeyword = (e) => {
    const value = e.target.value;
    this.setState({ keyword: value });

    if (this.keywordTimer) clearTimeout(this.keywordTimer);

    this.keywordTimer = setTimeout(async () => {
      await this.getDataPatient();
    }, 400);
  };

  handleSearchByKeyword = async () => {
    await this.getDataPatient();
  };

  handleBtnConfirm = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  closePatientModal = () => {
    this.setState({
      isOpenPatientModal: false,
    });
  };

  handleResetFilters = async () => {
    const today = moment().startOf("day").valueOf();
    localStorage.setItem("mp_currentDate", String(today));

    this.setState(
      {
        selectedTime: null,
        selectedStatus: null,
        keyword: "",
        currentDate: today,
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };

  canConfirmBooking = (item) => {
    if (!item?.date) return false;

    const today = moment().startOf("day").valueOf();
    const bookingDate = moment(+item.date).startOf("day").valueOf();

    if (bookingDate > today) return false;
    if (!["S2"].includes(item.statusId)) return false;

    return true;
  };

  handleBtnViewDetail = (item) => {
    const data = {
      bookingId: item.id,
      doctorId: item.doctorId,
      patientId: item.patientId,
      date: item.date,
      timeType: item.timeType,

      email: item.patientData?.email || "",
      firstName: item.patientData?.firstName || "",
      lastName: item.patientData?.lastName || "",
      fullName: `${item.patientData?.lastName || ""} ${
        item.patientData?.firstName || ""
      }`.trim(),
      address: item.patientData?.address || "",
      phoneNumber: item.patientData?.phoneNumber || "",

      birthday: item.patientData.patientInfoData?.birthday || "",
      insuranceNumber: item.patientData.patientInfoData?.insuranceNumber || "",
      note: item.patientData.patientInfoData?.note || "",
      reason: item.patientData.patientInfoData?.reason || "",

      timeString:
        this.props.language === LANGUAGES.VI
          ? item.timeTypeDataPatient?.valueVi
          : item.timeTypeDataPatient?.valueEn,

      genderText:
        this.props.language === LANGUAGES.VI
          ? item.patientData?.genderData?.valueVi
          : item.patientData?.genderData?.valueEn,

      statusText:
        this.props.language === LANGUAGES.VI
          ? item.statusData?.valueVi
          : item.statusData?.valueEn,
    };

    this.setState({
      isOpenPatientModal: true,
      dataModal: data,
    });
  };

  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;

    this.setState({
      isShowLoading: true,
    });

    try {
      let res = await postSendRemedy({
        email: dataChild.email,
        imgBase64: dataChild.imgBase64,
        doctorId: dataModal.doctorId,
        patientId: dataModal.patientId,
        timeType: dataModal.timeType,
        language: this.props.language,
        patientName: dataModal.patientName,
      });

      if (res && res.errCode === 0) {
        toast.success("Gửi hóa đơn thành công");
        await this.getDataPatient();
        this.closeRemedyModal();
      } else {
        toast.error("Gửi hóa đơn thất bại");
      }
    } catch (e) {
      console.log(e);
      toast.error("Gửi hóa đơn thất bại");
    } finally {
      this.setState({
        isShowLoading: false,
      });
    }
  };

  render() {
    let { language } = this.props;
    let {
      dataPatient,
      isOpenRemedyModal,
      isOpenPatientModal,
      dataModal,
      listTime,
      selectedTime,
      listStatus,
      selectedStatus,
      keyword,
    } = this.state;

    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading..."
        >
          <div className="manage-patient-container">
            <div className="manage-patient-title">
              <FormattedMessage id="admin.doctor.manage-booking.booking-title" />
            </div>

            <div className="manage-patient-body row">
              <div className="col-12 filter-bar">
                <div className="filter-item">
                  <label className="filter-label">
                    <FormattedMessage id="admin.doctor.manage-booking.filter-date" />
                  </label>
                  <DatePicker
                    onChange={this.handleOnChangeDatePicker}
                    className="form-control"
                    value={this.state.currentDate}
                  />
                </div>

                <div className="filter-item">
                  <label className="filter-label">
                    <FormattedMessage id="admin.doctor.manage-booking.filter-time-type" />
                  </label>
                  <Select
                    value={selectedTime}
                    onChange={this.handleChangeTime}
                    options={listTime}
                    name="selectedTime"
                    placeholder="Chọn khoảng thời gian"
                    classNamePrefix="mp-select"
                  />
                </div>

                <div className="filter-item">
                  <label className="filter-label">
                    <FormattedMessage id="admin.doctor.manage-booking.filter-status" />
                  </label>
                  <Select
                    value={selectedStatus}
                    onChange={this.handleChangeStatus}
                    options={listStatus}
                    name="selectedStatus"
                    placeholder="Chọn trạng thái"
                    classNamePrefix="mp-select"
                  />
                </div>

                <div className="filter-item filter-item-search">
                  <label className="filter-label">
                    <FormattedMessage id="admin.doctor.manage-booking.filter-name" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên bệnh nhân"
                    value={keyword}
                    onChange={this.handleChangeKeyword}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") this.handleSearchByKeyword();
                    }}
                  />
                </div>

                <div className="filter-item">
                  <label className="filter-label">&nbsp;</label>
                  <button
                    type="button"
                    className="btn-reset-filters"
                    onClick={this.handleResetFilters}
                    disabled={this.state.isShowLoading}
                  >
                    <FormattedMessage id="admin.filter-cancel" />
                  </button>
                </div>
              </div>

              <div className="col-12 table-manage-patient">
                <table>
                  <tbody>
                    <tr>
                      <th>STT</th>
                      <th>
                        <FormattedMessage id="admin.doctor.manage-booking.patient.time" />
                      </th>
                      <th>
                        <FormattedMessage id="admin.doctor.manage-booking.patient.name" />
                      </th>
                      <th>
                        <FormattedMessage id="admin.doctor.manage-booking.patient.gender" />
                      </th>
                      <th>
                        <FormattedMessage id="admin.doctor.manage-booking.patient.address" />
                      </th>
                      <th>
                        <FormattedMessage id="admin.doctor.manage-booking.patient.status" />
                      </th>
                      <th>
                        <FormattedMessage id="admin.doctor.manage-booking.patient.action" />
                      </th>
                    </tr>

                    {dataPatient && dataPatient.length > 0 ? (
                      dataPatient.map((item, index) => {
                        const patient = item?.patientData || {};
                        const gender =
                          language === LANGUAGES.VI
                            ? patient?.genderData?.valueVi
                            : patient?.genderData?.valueEn;

                        const time =
                          language === LANGUAGES.VI
                            ? item?.timeTypeDataPatient?.valueVi
                            : item?.timeTypeDataPatient?.valueEn;

                        const status =
                          language === LANGUAGES.VI
                            ? item?.statusData?.valueVi
                            : item?.statusData?.valueEn;

                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{time || ""}</td>
                            <td>
                              {patient.firstName || ""} {patient.lastName || ""}
                            </td>
                            <td>{gender || ""}</td>
                            <td>{patient.address || ""}</td>
                            <td>{status || ""}</td>
                            <td>
                              <button
                                className="mp-btn-confirm"
                                onClick={() => this.handleBtnConfirm(item)}
                                disabled={
                                  this.state.isShowLoading ||
                                  !this.canConfirmBooking(item)
                                }
                                title={
                                  !this.canConfirmBooking(item) ? (
                                    <FormattedMessage id="admin.doctor.manage-booking.patient-confirm" />
                                  ) : (
                                    ""
                                  )
                                }
                              >
                                <FormattedMessage id="admin.doctor.manage-booking.patient.confirm" />
                              </button>

                              <button
                                className="mp-btn-detail"
                                onClick={() => this.handleBtnViewDetail(item)}
                                disabled={this.state.isShowLoading}
                              >
                                <FormattedMessage id="admin.doctor.manage-booking.patient.view-detail" />
                              </button>

                              <button
                                className="mp-btn-cancel"
                                onClick={() => this.handleCancelBooking(item)}
                                disabled={
                                  this.state.isShowLoading ||
                                  !["S1", "S2"].includes(item?.statusId)
                                }
                                title={
                                  !["S1", "S2"].includes(item?.statusId) ? (
                                    <FormattedMessage id="admin.doctor.manage-booking.patient.booking-cancel-s" />
                                  ) : (
                                    ""
                                  )
                                }
                              >
                                <FormattedMessage id="admin.doctor.manage-booking.patient.booking-cancel" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center" }}>
                          <FormattedMessage id="admin.doctor.manage-booking.booking-no-found" />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <RemedyModal
            isOpenModal={isOpenRemedyModal}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />
          <PatientModal
            isOpenModal={isOpenPatientModal}
            dataModal={dataModal}
            closePatientModal={this.closePatientModal}
          />
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
