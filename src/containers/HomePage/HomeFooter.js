import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeFooter.scss";
import logo from "../../assets/logo.svg";
import logoFooter1 from "../../assets/footer/hellodoctorlogo.png";
import logoFooter2 from "../../assets/footer/logo-bernard.png";
import logoFooter3 from "../../assets/footer/doctor-check-2.png";
import { FormattedMessage } from "react-intl";

class HomeFooter extends Component {
  render() {
    return (
      <div className="home-footer">
        {/* khối trên */}
        <div className="footer-top">
          {/* cột thông tin công ty */}
          <div className="footer-col footer-company">
            <h4><FormattedMessage id="footer.company.title" /></h4>

            <p>
              <i className="fa-solid fa-map-location-dot icon-inline"></i>
              <FormattedMessage id="footer.company.address" />
            </p>

            <ul className="footer-info-list">
              <li>
                <i className="fa-solid fa-clipboard-check icon-inline"></i>
                <FormattedMessage id="footer.company.dkhd" />
              </li>
              <li>
                <i className="fa-solid fa-phone-volume icon-inline"></i>
                <FormattedMessage id="footer.company.sdt" />
              </li>
              <li>
                <i className="fa-solid fa-envelope icon-inline"></i>
                <FormattedMessage id="footer.company.email" />
              </li>
            </ul>

            <h5><FormattedMessage id="footer.company.subtitle" /></h5>
            <p>
              <i className="fa-solid fa-map-location-dot icon-inline"></i>
              <FormattedMessage id="footer.company.location" />
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
              <li><FormattedMessage id="footer.logo.title1" /></li>
              <li><FormattedMessage id="footer.logo.title2" /></li>
              <li><FormattedMessage id="footer.logo.title3" /></li>
              <li><FormattedMessage id="footer.logo.title4" /></li>
              <li><FormattedMessage id="footer.logo.title5" /></li>
              <li><FormattedMessage id="footer.logo.title6" /></li>
            </ul>
          </div>

          {/* cột đối tác */}
          <div className="footer-col footer-partners">
            <h4><FormattedMessage id="footer.partner.title" /></h4>

            <div className="partner-item">
              <div className="partner-logo">
                <img src={logoFooter1} alt="Hello Doctor" />
              </div>
              <div className="partner-text">
                <div className="partner-name"><FormattedMessage id="footer.partner.name1" /></div>
                <div className="partner-desc">
                  <FormattedMessage id="footer.partner.desc1" />
                </div>
              </div>
            </div>

            <div className="partner-item">
              <div className="partner-logo">
                <img src={logoFooter2} alt="Bernard" />
              </div>
              <div className="partner-text">
                <div className="partner-name">
                  <FormattedMessage id="footer.partner.name2" />
                </div>
                <div className="partner-desc">
                  <FormattedMessage id="footer.partner.desc2" />
                </div>
              </div>
            </div>

            <div className="partner-item">
              <div className="partner-logo">
                <img src={logoFooter3} alt="Doctor Check" />
              </div>
              <div className="partner-text">
                <div className="partner-name">
                  <FormattedMessage id="footer.partner.name3" />
                </div>
                <div className="partner-desc">
                  <FormattedMessage id="footer.partner.desc3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* thanh dưới cùng */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <div className="footer-bottom-left">
              <FormattedMessage id="footer.copyright" />
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
