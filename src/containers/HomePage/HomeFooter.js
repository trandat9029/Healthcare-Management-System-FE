import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeFooter.scss";
import logo from "../../assets/logo.svg";
import logoFooter1 from "../../assets/footer/hellodoctorlogo.png";
import logoFooter2 from "../../assets/footer/logo-bernard.png";
import logoFooter3 from "../../assets/footer/doctor-check-2.png";

class HomeFooter extends Component {
  render() {
    return (
      <div className="home-footer">
        {/* khối trên */}
        <div className="footer-top">
          {/* cột thông tin công ty */}
          <div className="footer-col footer-company">
            <h4>Công ty Cổ phần Công nghệ BookingHealth</h4>

            <p>
              <i className="fa-solid fa-map-location-dot icon-inline"></i>
              Lô B4/D21. Khu đô thị mới Cầu Giấy. Phường Dịch Vọng Hậu. Quận Cầu
              Giấy. Thành phố Hà Nội. Việt Nam
            </p>

            <ul className="footer-info-list">
              <li>
                <i className="fa-solid fa-clipboard-check icon-inline"></i>
                ĐKKD số 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/2015
              </li>
              <li>
                <i className="fa-solid fa-phone-volume icon-inline"></i>
                Điện thoại. 024 7301 2468 (7h đến 18h)
              </li>
              <li>
                <i className="fa-solid fa-envelope icon-inline"></i>
                Email. support@bookinghealth.vn (7h đến 18h)
              </li>
            </ul>

            <h5>Văn phòng tại TP Hồ Chí Minh</h5>
            <p>
              <i className="fa-solid fa-map-location-dot icon-inline"></i>
              Tòa nhà H3. 384 Hoàng Diệu. Phường 6. Quận 4. TP HCM
            </p>
          </div>

          {/* cột logo và liên kết */}
          <div className="footer-col footer-links">
            <div className="footer-logo">
              <div className="footer-logo-mark">
                <img src={logo} alt="BookingHealth logo" />
              </div>
            </div>

            <ul className="footer-link-list">
              <li>Liên hệ hợp tác</li>
              <li>Chuyển đổi số</li>
              <li>Chính sách bảo mật</li>
              <li>Quy chế hoạt động</li>
              <li>Điều khoản sử dụng</li>
              <li>Câu hỏi thường gặp</li>
            </ul>
          </div>

          {/* cột đối tác */}
          <div className="footer-col footer-partners">
            <h4>Đối tác bảo trợ nội dung</h4>

            <div className="partner-item">
              <div className="partner-logo">
                <img src={logoFooter1} alt="Hello Doctor" />
              </div>
              <div className="partner-text">
                <div className="partner-name">Hello Doctor</div>
                <div className="partner-desc">
                  Bảo trợ chuyên mục nội dung sức khỏe tinh thần
                </div>
              </div>
            </div>

            <div className="partner-item">
              <div className="partner-logo">
                <img src={logoFooter2} alt="Bernard" />
              </div>
              <div className="partner-text">
                <div className="partner-name">
                  Hệ thống y khoa chuyên sâu quốc tế Bernard
                </div>
                <div className="partner-desc">
                  Bảo trợ chuyên mục nội dung y khoa chuyên sâu
                </div>
              </div>
            </div>

            <div className="partner-item">
              <div className="partner-logo">
                <img src={logoFooter3} alt="Doctor Check" />
              </div>
              <div className="partner-text">
                <div className="partner-name">
                  Doctor Check. Tầm soát bệnh để sống thọ hơn
                </div>
                <div className="partner-desc">
                  Bảo trợ chuyên mục nội dung sức khỏe tổng quát
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* thanh dưới cùng */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <div className="footer-bottom-left">
              © 2025 BookingHealth. Tất cả các quyền được bảo lưu.
            </div>
            <div className="footer-bottom-right">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Tiktok"
              >
                <i className="fa-brands fa-tiktok"></i>
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Youtube"
              >
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

export default connect(mapStateToProps)(HomeFooter);
