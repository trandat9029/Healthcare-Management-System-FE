import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./HomeHeader.scss";
import logo from "../../assets/logo.svg";
import { LANGUAGES } from "../../utils/constant";
import { changeLanguageApp } from "../../store/actions";
import { withRouter } from "react-router";
import { MAIN_NAV_LINKS } from "./navLink";

class HomeHeader extends Component {
  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };

  returnToHome = () => {
    if (this.props.history) {
      this.props.history.push("/home");
    }
  };

  handleNavigate = (to) => {
    const { history } = this.props;
    if (history) {
      history.push(to);
    }
  };

  isActiveLink = (link) => {
    const { location } = this.props;
    if (!location) return false;

    const currentPath = location.pathname;

    // nếu ở trang home thì không active các mục này
    if (currentPath === "/" || currentPath === "/home") return false;

    // check xem path hiện tại có bắt đầu bằng 1 trong các matchPaths
    return link.matchPaths.some((p) => currentPath.indexOf(p) === 0);
  };

  render() {
    const language = this.props.language;

    return (
      <>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i className="fa-solid fa-bars"></i>
              <img
                className="header-logo"
                src={logo}
                alt="logo"
                onClick={this.returnToHome}
              />
            </div>

            <div className="center-content">
              {MAIN_NAV_LINKS.map((link) => (
                <div
                  key={link.key}
                  className={
                    this.isActiveLink(link)
                      ? "child-content active"
                      : "child-content"
                  }
                  onClick={() => this.handleNavigate(link.to)}
                >
                  <h4>
                    <b>
                      <FormattedMessage id={link.titleId} />
                    </b>
                  </h4>
                  <p className="subs-desc">
                    <FormattedMessage id={link.subId} />
                  </p>
                </div>
              ))}
            </div>

            <div className="right-content">
              <div className="support">
                <i className="fa-solid fa-circle-question"></i>
                <FormattedMessage id="homeHeader.support" />
              </div>
              <div
                className={
                  language === LANGUAGES.VI
                    ? "language-vi active"
                    : "language-vi"
                }
              >
                <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>
                  VI
                </span>
              </div>
              <div
                className={
                  language === LANGUAGES.EN
                    ? "language-en active"
                    : "language-en"
                }
              >
                <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>
                  EN
                </span>
              </div>
            </div>
          </div>
        </div>

        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1">
                <FormattedMessage id="banner.title1" />
              </div>
              <div className="title2">
                <FormattedMessage id="banner.title2" />
              </div>
              <div className="search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Tìm chuyên khoa khám bệnh" />
              </div>
            </div>
            <div className="content-down">
              <div className="options">
               
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fa-solid fa-stethoscope"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child2" />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fa-solid fa-hospital"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child3" />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fa-solid fa-newspaper"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child4" />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fa-solid fa-user-doctor"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child5" /> 
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fa-solid fa-circle-question"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
