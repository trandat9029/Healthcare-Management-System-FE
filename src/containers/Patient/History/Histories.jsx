import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getHistoriesByEmail,
  postSendEmailCancelBookedService,
} from "../../../services/bookingService";
import { LANGUAGES } from "../../../utils";
import "./Histories.scss";

class Histories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      bookings: [],
      loading: false,
      error: "",
    };
  }

  handleChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  handleSearch = async () => {
    const { email } = this.state;

    if (!email) {
      this.setState({ error: "Vui lòng nhập email" });
      return;
    }

    this.setState({ loading: true, error: "" });

    try {
      const res = await getHistoriesByEmail(email, 1, 20);
      console.log("check res list histories: ", res);

      if (res  && res.errCode === 0) {
        this.setState({
          bookings: res.bookings || [],
        });
      } else {
        this.setState({
          bookings: [],
          error: res.data?.errMessage || "Không tìm thấy lịch sử",
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({
        error: "Có lỗi khi gọi API",
        bookings: [],
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(Number(timestamp));
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("vi-VN");
  };

  handleCancel = async (booking) => {
    const { language } = this.props;

    const doctor = booking.doctorBookings || {};
    const patient = booking.patientData || {};
    const timeType = booking.timeTypeDataPatient || {};

    const doctorName = `${doctor.lastName || ""} ${
      doctor.firstName || ""
    }`.trim();

    const patientName = `${patient.lastName || ""} ${
      patient.firstName || ""
    }`.trim();

    const timeLabel =
      language === LANGUAGES.VI
        ? timeType.valueVi || ""
        : timeType.valueEn || "";

    const dateLabel = this.formatDate(booking.date);

    const payload = {
      email: patient.email,
      doctorId: booking.doctorId,
      bookingId: booking.id,
      language: language === LANGUAGES.VI ? "vi" : "en",
      fullName: patientName,
      timeString: `${timeLabel} ${dateLabel}`,
      doctorName: doctorName,
    };

    console.log("payload cancel booking: ", payload);

    try {
      const res = await postSendEmailCancelBookedService(payload);
      if (res && res.errCode === 0) {
        alert("Đã gửi email xác nhận hủy lịch, vui lòng kiểm tra hộp thư của bạn");
      } else {
        alert(res.errMessage || "Không thể gửi email hủy lịch");
      }
    } catch (error) {
      console.log(error);
      alert("Có lỗi khi gửi yêu cầu hủy lịch");
    }
  };

  render() {
    const { email, bookings, error, loading } = this.state;
    const { language } = this.props;

    return (
      <>
        {/* breadcrumb */}
        <div className="breadcrumb">
          <i className="fa-solid fa-house"></i> / Lịch sử khám
        </div>

        <div className="histories-page">
          <div className="histories-container">
            <div className="histories-header">
              <h2 className="histories-title">Lịch sử đặt lịch</h2>
              <p className="histories-subtitle">
                Nhập email để xem lại các lần đặt lịch khám của bạn.
              </p>
            </div>

            {/* vùng tìm kiếm */}
            <div className="histories-search-card">
              <div className="histories-search">
                <input
                  type="email"
                  placeholder="Nhập email bệnh nhân"
                  value={email}
                  onChange={this.handleChangeEmail}
                />
                <button onClick={this.handleSearch} disabled={loading}>
                  {loading ? "Đang tìm..." : "Tìm kiếm"}
                </button>
              </div>
              {error && <div className="histories-error">{error}</div>}
            </div>

            {/* bảng kết quả */}
            <div className="histories-result-card">
              {bookings.length > 0 && (
                <table className="histories-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Bác sĩ</th>
                      <th>Thời gian khám</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((item, index) => {
                      const doctor = item.doctorBookings || {};
                      const timeType = item.timeTypeDataPatient || {};
                      const statusData = item.statusData || {};

                      const doctorName = `${doctor.lastName || ""} ${
                        doctor.firstName || ""
                      }`.trim();

                      const timeLabel =
                        language === LANGUAGES.VI
                          ? timeType.valueVi || ""
                          : timeType.valueEn || "";

                      const statusLabel =
                        language === LANGUAGES.VI
                          ? statusData.valueVi || item.statusId
                          : statusData.valueEn || item.statusId;

                      const dateLabel = this.formatDate(item.date);

                      const canCancel =
                        item.statusId === "S1" || item.statusId === "S2";

                      const statusClass =
                        item.statusId === "S1"
                          ? "status-new"
                          : item.statusId === "S2"
                          ? "status-confirmed"
                          : "status-other";

                      return (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{doctorName}</td>
                          <td>
                            {timeLabel} {dateLabel}
                          </td>
                          <td>
                            <span className={`status-badge ${statusClass}`}>
                              {statusLabel}
                            </span>
                          </td>
                          <td>
                            <button
                              disabled={!canCancel}
                              className={
                                canCancel
                                  ? "btn-cancel active"
                                  : "btn-cancel disabled"
                              }
                              onClick={() => canCancel && this.handleCancel(item)}
                            >
                              Hủy
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {!loading && bookings.length === 0 && !error && (
                <div className="histories-empty">
                  Chưa có lịch sử đặt lịch nào.
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps, null)(Histories);
