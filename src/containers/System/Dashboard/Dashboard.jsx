import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "../../../components/Input/DatePicker";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./Dashboard.scss";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
    };
  }

  handleOnchangeDatePicker = (date) => {
    this.setState({
      selectedDate: date,
    });
  };

  render() {
    const { selectedDate } = this.state;

    // demo trạng thái lịch khám theo tháng
    const bookingStatusData = [
      { month: "10/2025", confirmed: 160, finished: 145, pending: 40, cancelled: 25 },
      { month: "11/2025", confirmed: 170, finished: 150, pending: 45, cancelled: 23 },
      { month: "12/2025", confirmed: 190, finished: 160, pending: 48, cancelled: 22 },
      { month: "01/2026", confirmed: 200, finished: 168, pending: 46, cancelled: 20 },
      { month: "02/2026", confirmed: 195, finished: 165, pending: 44, cancelled: 18 },
      { month: "03/2026", confirmed: 210, finished: 175, pending: 47, cancelled: 19 },
    ];

    // demo phân bố bệnh nhân theo chuyên khoa
    const specialtyData = [
      { name: "Cơ xương khớp", value: 190 },
      { name: "Tim mạch", value: 150 },
      { name: "Tiêu hóa", value: 130 },
      { name: "Nội tổng quát", value: 100 },
      { name: "Khác", value: 70 },
    ];

    // demo top bác sĩ
    const topDoctors = [
      { id: 1, name: "BS. Lê Quốc Việt", specialty: "Cơ xương khớp", count: 32 },
      { id: 2, name: "BS. Trần Minh Hùng", specialty: "Tim mạch", count: 27 },
      { id: 3, name: "BS. Phan Thanh Hà", specialty: "Tiêu hóa", count: 21 },
      { id: 4, name: "BS. Nguyễn Thu Trang", specialty: "Nội tổng quát", count: 19 },
    ];

    // demo hoạt động gần đây
    const activities = [
      {
        id: 1,
        type: "success",
        title: "Tạo mới lịch khám cho Nguyễn Văn A",
        time: "5 phút trước . BS. Lê Quốc Việt",
      },
      {
        id: 2,
        type: "info",
        title: "Cập nhật hồ sơ phòng khám Phòng 305",
        time: "30 phút trước . Quản trị viên",
      },
      {
        id: 3,
        type: "warning",
        title: "Thêm bài viết cẩm nang về bệnh xương khớp",
        time: "1 giờ trước . Bộ phận nội dung",
      },
      {
        id: 4,
        type: "danger",
        title: "Khóa tài khoản bệnh nhân không xác thực email",
        time: "2 giờ trước . Hệ thống",
      },
    ];

    const formattedDate = selectedDate
      ? new Date(selectedDate).toLocaleDateString("vi-VN")
      : "";

    const renderBookingTooltip = (props) => {
      const { active, payload, label } = props;
      if (!active || !payload || !payload.length) return null;

      return (
        <div className="bh-tooltip">
          <div className="bh-tooltip-title">Tháng {label}</div>
          {payload.map((item) => (
            <div key={item.dataKey} className="bh-tooltip-row">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: item.color,
                  display: "inline-block",
                }}
              />
              <span>
                {item.name}: {item.value} lịch
              </span>
            </div>
          ))}
        </div>
      );
    };

    const renderSpecialtyTooltip = (props) => {
      const { active, payload } = props;
      if (!active || !payload || !payload.length) return null;
      const item = payload[0];

      return (
        <div className="bh-tooltip">
          <div className="bh-tooltip-title">{item.payload.name}</div>
          <div>{item.value} bệnh nhân</div>
        </div>
      );
    };

    return (
      <div className="dashboard-page">
        {/* header */}
        <div className="dashboard-header">
          <div>
            <div className="dashboard-title">Tổng quan hệ thống</div>
            <div className="dashboard-subtitle">
              Theo dõi nhanh tình hình hệ thống BookingHealth theo ngày.
            </div>
          </div>

          <div className="dashboard-header-right">
            <div className="filter-item">
              <label className="filter-label">Ngày</label>
              <DatePicker
                className="form-control"
                onChange={this.handleOnchangeDatePicker}
                value={selectedDate}
              />
            </div>

            <button type="button" className="btn-dashboard-tag">
              BookingHealth Dashboard
            </button>
          </div>
        </div>

        {/* thẻ thống kê */}
        <div className="dashboard-metrics-row">
          <div className="metric-card">
            <div className="metric-icon doctors">
              <i className="fa-solid fa-user-doctor" />
            </div>
            <div className="metric-label">Tổng bác sĩ</div>
            <div className="metric-value">18</div>
            <div className="metric-desc">Đang hoạt động trong hệ thống</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon patients">
              <i className="fa-solid fa-users" />
            </div>
            <div className="metric-label">Tổng bệnh nhân</div>
            <div className="metric-value">16</div>
            <div className="metric-desc">Tài khoản bệnh nhân đã đăng ký</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon specialties">
              <i className="fa-solid fa-stethoscope" />
            </div>
            <div className="metric-label">Tổng chuyên khoa</div>
            <div className="metric-value">16</div>
            <div className="metric-desc">Chuyên khoa đang được quản lý</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon clinics">
              <i className="fa-solid fa-hospital" />
            </div>
            <div className="metric-label">Tổng phòng khám</div>
            <div className="metric-value">18</div>
            <div className="metric-desc">
              Cơ sở khám chữa bệnh trong hệ thống
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon posts">
              <i className="fa-regular fa-newspaper" />
            </div>
            <div className="metric-label">Tổng bài viết</div>
            <div className="metric-value">9</div>
            <div className="metric-desc">Bài viết cẩm nang và tin tức</div>
          </div>
        </div>

        {/* nội dung chính */}
        <div className="dashboard-main">
          {/* biểu đồ trạng thái lịch khám */}
          <div className="dashboard-section wide">
            <div className="section-header">
              <div>
                <h3>Trạng thái lịch khám theo tháng</h3>
                <p>
                  Phân bố số lịch khám đã xác nhận. đã khám xong. chờ xác nhận
                  và hủy trong từng tháng. Dữ liệu demo.
                </p>
              </div>
              <button type="button" className="btn-small-secondary">
                Xem theo tháng
              </button>
            </div>

            <div className="section-body chart-body-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bookingStatusData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  {/* gradient cho cột đẹp hơn */}
                  <defs>
                    <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#86efac" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                    <linearGradient id="colorFinished" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={renderBookingTooltip} />
                  <Legend
                    verticalAlign="bottom"
                    height={32}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Bar
                    dataKey="confirmed"
                    name="Đã xác nhận"
                    stackId="status"
                    fill="url(#colorConfirmed)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="finished"
                    name="Đã khám xong"
                    stackId="status"
                    fill="url(#colorFinished)"
                  />
                  <Bar
                    dataKey="pending"
                    name="Chờ xác nhận"
                    stackId="status"
                    fill="#fbbf24"
                  />
                  <Bar
                    dataKey="cancelled"
                    name="Hủy"
                    stackId="status"
                    fill="#fb923c"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* các khối bên dưới, mỗi khối 1 hàng riêng */}
          <div className="dashboard-lower">
            {/* bệnh nhân theo chuyên khoa */}
            <div className="dashboard-section">
              <div className="section-header">
                <div>
                  <h3>Bệnh nhân theo chuyên khoa</h3>
                  <p>
                    Tỉ lệ phân bố bệnh nhân theo khoa trong ngày hôm nay
                    {formattedDate ? ` . ${formattedDate}` : ""}.
                  </p>
                </div>
              </div>

              <div className="section-body chart-body-md">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={specialtyData}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                  >
                    <CartesianGrid horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={renderSpecialtyTooltip} />
                    <Bar dataKey="value" fill="#22c55e" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* top bác sĩ nổi bật */}
            <div className="dashboard-section">
              <div className="section-header">
                <div>
                  <h3>Top bác sĩ nổi bật</h3>
                  <p>Dựa trên số lượt khám trong tháng. Dữ liệu demo.</p>
                </div>
              </div>

              <div className="section-body doctor-section-body">
                <ul className="doctor-ranking">
                  {topDoctors.map((doctor, index) => (
                    <li key={doctor.id}>
                      <div className="rank-badge">{index + 1}</div>
                      <div className="doctor-info">
                        <div className="name">{doctor.name}</div>
                        <div className="meta">{doctor.specialty}</div>
                      </div>
                      <div className="count-tag">{doctor.count} lượt khám</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* hoạt động gần đây */}
            <div className="dashboard-section">
              <div className="section-header">
                <div>
                  <h3>Hoạt động gần đây</h3>
                  <p>Một số thao tác mới phát sinh trong hệ thống.</p>
                </div>
              </div>

              <div className="section-body activities-tall">
                <div className="activities">
                  {activities.map((item) => {
                    let color = "#22c55e";
                    if (item.type === "info") color = "#3b82f6";
                    if (item.type === "warning") color = "#f97316";
                    if (item.type === "danger") color = "#ef4444";

                    return (
                      <div key={item.id} className="activity-item">
                        <div
                          className="activity-dot"
                          style={{ backgroundColor: color }}
                        />
                        <div className="activity-text">
                          <div className="activity-title">{item.title}</div>
                          <div className="activity-time">{item.time}</div>
                        </div>
                      </div>
                    );
                  })}
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

export default connect(mapStateToProps)(Dashboard);
