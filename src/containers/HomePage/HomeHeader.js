import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./HomeHeader.scss";
import logo from '../../assets/logo.svg'
import { LANGUAGES } from "../../utils/constant";
import { changeLanguageApp } from "../../store/actions";


class HomeHeader extends Component {

  changeLanguage = (language) =>{
    // fire redux event: actions
    this.props.changeLanguageAppRedux(language);
  }

  render() {
    let language = this.props.language;
    
    return (
      <>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i className="fa-solid fa-bars"></i>
              <img className="header-logo" src={logo} alt="logo" />
            </div>
            <div className="center-content">
              <div className="child-content">
                <h4>
                  <b><FormattedMessage id="homeHeader.specialty" /></b>
                </h4>
                <p className="subs-desc"><FormattedMessage id="homeHeader.search-doctor" /></p>
              </div>
              <div className="child-content">
                <h4>
                  <b><FormattedMessage id="homeHeader.health-facility" /></b>
                </h4>
                <p className="subs-desc"><FormattedMessage id="homeHeader.select-room" /></p>
              </div>
              <div className="child-content">
                <h4>
                  <b><FormattedMessage id="homeHeader.doctor" /></b>
                </h4>
                <p className="subs-desc"><FormattedMessage id="homeHeader.select-doctor" /></p>
              </div>
              <div className="child-content">
                <h4>
                  <b><FormattedMessage id="homeHeader.fee" /></b>
                </h4>
                <p className="subs-desc"><FormattedMessage id="homeHeader.check-health" /></p>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fa-solid fa-circle-question"></i>
                <FormattedMessage id="homeHeader.support" />
              </div>
              <div className={language === LANGUAGES.VI ? "language-vi active" : "language-vi"}><span onClick={() => this.changeLanguage(LANGUAGES.VI)} >VI</span></div>
              <div className={language === LANGUAGES.EN ? "language-en active" : "language-en"}><span onClick={() => this.changeLanguage(LANGUAGES.EN)} >EN</span></div>
            </div>
          </div>  
        </div>
        <div className="home-header-banner">
          <div className="content-up">
            <div className="title1"><FormattedMessage id="banner.title1" /></div>
            <div className="title2"><FormattedMessage id="banner.title2" /></div>
            <div className="search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Tìm chuyên khoa khám bệnh"/>
            </div>
          </div>
          <div className="content-down">             
            <div className="options">
              <div className="option-child">
                <div className="icon-child"><i className="fa-regular fa-hospital"></i></div>
                <div className="text-child"><FormattedMessage id="banner.child1" /></div>
              </div>
              <div className="option-child">
                <div className="icon-child"><i className="fa-solid fa-mobile-screen-button"></i></div>
                <div className="text-child"><FormattedMessage id="banner.child2" /></div>
              </div>
              <div className="option-child">
                <div className="icon-child"><i className="fa-solid fa-hospital-user"></i></div>
                <div className="text-child"><FormattedMessage id="banner.child3" /></div>
              </div>
              <div className="option-child">
                <div className="icon-child"><i className="fa-solid fa-microscope"></i></div>
                <div className="text-child"><FormattedMessage id="banner.child4" /></div>
              </div>
              <div className="option-child">
                <div className="icon-child"><i className="fa-solid fa-user-doctor"></i></div>
                <div className="text-child"><FormattedMessage id="banner.child5" /></div>
              </div>
              <div className="option-child">
                <div className="icon-child"><i className="fa-solid fa-tooth"></i></div>
                <div className="text-child"><FormattedMessage id="banner.child6" /></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) =>dispatch(changeLanguageApp(language))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
