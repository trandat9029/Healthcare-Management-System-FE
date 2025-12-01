import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Dashboard.scss';
import DatePicker from '../../../components/Input/DatePicker';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
    };
  }

  handleOnchangeDatePicker = (dateArr) => {
    // DatePicker trong project thường trả về [date]
    const picked = Array.isArray(dateArr) ? dateArr[0] : dateArr;
    this.setState({ selectedDate: picked });
  };

  render() {
    const { selectedDate } = this.state;

    const todayLabel = selectedDate
      ? selectedDate.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '';

    // dữ liệu fake, sau bạn nối API thật
    const upcomingAppointments = [
      {
        time: '08:30',
        patient: 'Nguyễn Văn A',
        doctor: 'BS. Lê Quốc Việt',
        room: 'Phòng 101',
      },
      {
        time: '09:15',
        patient: 'Trần Thị Bích',
        doctor: 'BS. Trần Minh Hùng',
        room: 'Phòng 203',
      },
      {
        time: '10:00',
        patient: 'Phạm Văn C',
        doctor: 'BS. Phan Thanh Hà',
        room: 'Phòng 305',
      },
      {
        time: '10:45',
        patient: 'Lý Mai Dung',
        doctor: 'BS. Lưu Thành Long',
        room: 'Phòng 102',
      },
    ];

    const topDoctors = [
      { name: 'BS. Lê Quốc Việt', count: 32 },
      { name: 'BS. Trần Minh Hùng', count: 27 },
      { name: 'BS. Phan Thanh Hà', count: 21 },
      { name: 'BS. Nguyễn Thu Trang', count: 19 },
    ];

    const specialtyStats = [
      { name: 'Cơ xương khớp', percent: 38 },
      { name: 'Tim mạch', percent: 24 },
      { name: 'Tiêu hóa', percent: 18 },
      { name: 'Nội tổng quát', percent: 12 },
      { name: 'Khác', percent: 8 },
    ];

    // dữ liệu cho biểu đồ cột số lịch theo giờ
    const hourlyStats = [
      { label: '8h', value: 12 },
      { label: '9h', value: 20 },
      { label: '10h', value: 18 },
      { label: '11h', value: 15 },
      { label: '14h', value: 22 },
      { label: '15h', value: 19 },
      { label: '16h', value: 14 },
    ];
    const maxHourly = Math.max(...hourlyStats.map((i) => i.value));

    return (
      <div className="bh-dashboard-container">
        {/* header */}
        <div className="bh-dashboard-header">
          <div>
            <h2 className="bh-dashboard-title">Tổng quan hệ thống</h2>
            <p className="bh-dashboard-subtitle">
              Ngày {todayLabel}. Theo dõi nhanh tình hình khám chữa bệnh.
            </p>
          </div>

          <div className="bh-dashboard-header-right">
            <div className="bh-filter-item">
              <label className="bh-filter-label">Ngày</label>
              <DatePicker
                className="form-control"
                onChange={this.handleOnchangeDatePicker}
                value={selectedDate}
              />
            </div>
            <div className="bh-dashboard-badge">BookingHealth Dashboard</div>
          </div>
        </div>

        {/* Hàng 1, các thẻ KPI */}
        <div className="bh-dashboard-row bh-dashboard-row-top">
          <div className="bh-stat-card">
            <div className="bh-stat-label">Lịch khám hôm nay</div>
            <div className="bh-stat-number">128</div>
            <div className="bh-stat-footer bh-stat-footer-positive">
              <span className="dot" />
              <span>+12% so với hôm qua</span>
            </div>
          </div>

          <div className="bh-stat-card">
            <div className="bh-stat-label">Bệnh nhân mới</div>
            <div className="bh-stat-number">46</div>
            <div className="bh-stat-footer">
              <span className="dot" />
              <span>Trong 24 giờ gần nhất</span>
            </div>
          </div>

          <div className="bh-stat-card">
            <div className="bh-stat-label">Bác sĩ đang làm việc</div>
            <div className="bh-stat-number">27</div>
            <div className="bh-stat-footer">
              <span className="dot" />
              <span>Đang có lịch trong ngày</span>
            </div>
          </div>

          <div className="bh-stat-card">
            <div className="bh-stat-label">Tỉ lệ hủy lịch</div>
            <div className="bh-stat-number small">3,2%</div>
            <div className="bh-stat-footer bh-stat-footer-warning">
              <span className="dot" />
              <span>Cần theo dõi</span>
            </div>
          </div>
        </div>

        {/* Hàng 2, 2 cột lớn */}
        <div className="bh-dashboard-row">
          {/* Trạng thái lịch + biểu đồ */}
          <div className="bh-panel bh-panel-large">
            <div className="bh-panel-header">
              <div>
                <h3 className="bh-panel-title">Trạng thái lịch khám</h3>
                <p className="bh-panel-subtitle">
                  Tổng quan theo trạng thái trong ngày
                </p>
              </div>
            </div>

            <div className="bh-status-grid">
              <div className="bh-status-item">
                <span className="status-label">Đã xác nhận</span>
                <div className="status-bar">
                  <div className="status-bar-fill confirmed" style={{ width: '62%' }} />
                </div>
                <span className="status-value">62 lịch</span>
              </div>

              <div className="bh-status-item">
                <span className="status-label">Chờ xác nhận</span>
                <div className="status-bar">
                  <div className="status-bar-fill pending" style={{ width: '24%' }} />
                </div>
                <span className="status-value">24 lịch</span>
              </div>

              <div className="bh-status-item">
                <span className="status-label">Đã khám xong</span>
                <div className="status-bar">
                  <div className="status-bar-fill done" style={{ width: '48%' }} />
                </div>
                <span className="status-value">48 lịch</span>
              </div>

              <div className="bh-status-item">
                <span className="status-label">Hủy</span>
                <div className="status-bar">
                  <div className="status-bar-fill canceled" style={{ width: '12%' }} />
                </div>
                <span className="status-value">12 lịch</span>
              </div>
            </div>

            {/* Biểu đồ cột */}
            <div className="bh-chart-wrapper">
              <div className="bh-chart-header">
                <span className="bh-chart-title">
                  Số lịch khám theo khung giờ
                </span>
                <span className="bh-chart-subtitle">
                  Dữ liệu minh họa cho ngày hiện tại
                </span>
              </div>

              <div className="bh-chart-bars">
                {hourlyStats.map((item) => {
                  const heightPercent = (item.value / maxHourly) * 100;
                  return (
                    <div key={item.label} className="bh-chart-bar-item">
                      <div className="bh-chart-bar-box">
                        <div
                          className="bh-chart-bar"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="bh-chart-bar-label">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lịch khám sắp tới */}
          <div className="bh-panel bh-panel-medium">
            <div className="bh-panel-header">
              <div>
                <h3 className="bh-panel-title">Lịch khám sắp tới</h3>
                <p className="bh-panel-subtitle">
                  4 lịch gần nhất trong ngày
                </p>
              </div>
            </div>

            <div className="bh-table-wrapper">
              <table className="bh-table">
                <thead>
                  <tr>
                    <th>Giờ</th>
                    <th>Bệnh nhân</th>
                    <th>Bác sĩ</th>
                    <th>Phòng</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((item, index) => (
                    <tr key={index}>
                      <td>{item.time}</td>
                      <td>{item.patient}</td>
                      <td>{item.doctor}</td>
                      <td>{item.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Hàng 3, 3 panel nhỏ */}
        <div className="bh-dashboard-row bh-dashboard-row-bottom">
          {/* Top bác sĩ */}
          <div className="bh-panel bh-panel-small">
            <div className="bh-panel-header">
              <h3 className="bh-panel-title">Top bác sĩ theo số lịch</h3>
            </div>
            <ul className="bh-list">
              {topDoctors.map((doctor, index) => (
                <li key={index} className="bh-list-item">
                  <div className="bh-list-main">
                    <span className="bh-list-rank">{index + 1}</span>
                    <span className="bh-list-name">{doctor.name}</span>
                  </div>
                  <span className="bh-list-badge">{doctor.count} lịch</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chuyên khoa nổi bật */}
          <div className="bh-panel bh-panel-small">
            <div className="bh-panel-header">
              <h3 className="bh-panel-title">Phân bố chuyên khoa</h3>
            </div>
            <ul className="bh-list">
              {specialtyStats.map((item, index) => (
                <li key={index} className="bh-list-item">
                  <div className="bh-list-main">
                    <span className="bh-list-dot" />
                    <span className="bh-list-name">{item.name}</span>
                  </div>
                  <span className="bh-list-badge">{item.percent}%</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hoạt động gần đây */}
          <div className="bh-panel bh-panel-small">
            <div className="bh-panel-header">
              <h3 className="bh-panel-title">Hoạt động gần đây</h3>
            </div>
            <ul className="bh-activity-list">
              <li>
                <span className="dot dot-green" />
                <div>
                  <div className="activity-title">
                    Tạo mới lịch khám cho Nguyễn Văn A
                  </div>
                  <div className="activity-time">
                    5 phút trước . BS. Lê Quốc Việt
                  </div>
                </div>
              </li>
              <li>
                <span className="dot dot-blue" />
                <div>
                  <div className="activity-title">
                    Xác nhận lịch khám cho Trần Thị Bích
                  </div>
                  <div className="activity-time">
                    15 phút trước . Lễ tân
                  </div>
                </div>
              </li>
              <li>
                <span className="dot dot-orange" />
                <div>
                  <div className="activity-title">
                    Cập nhật hồ sơ phòng khám Phòng 305
                  </div>
                  <div className="activity-time">
                    30 phút trước . Quản trị viên
                  </div>
                </div>
              </li>
              <li>
                <span className="dot dot-red" />
                <div>
                  <div className="activity-title">
                    Hủy lịch khám của Lý Mai Dung
                  </div>
                  <div className="activity-time">
                    1 giờ trước . Bệnh nhân yêu cầu
                  </div>
                </div>
              </li>
            </ul>
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
