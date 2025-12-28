// HomePage.jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import Specialty from "./Section/Specialty";
import MedicalFacility from "./Section/MedicalFacility";
import "./HomePage.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import OutstandingDoctor from "./Section/OutstandingDoctor";
import Handbook from "./Section/Handbook";
import About from "./Section/About";

class HomePage extends Component {
  handleAfterChange = () => {};

  render() {
    let settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      afterChange: this.handleAfterChange,
    };

    return (
      <div>
        <div id="section-specialty">
          <Specialty settings={settings} />
        </div>

        <div id="section-medical-facility">
          <MedicalFacility settings={settings} />
        </div>

        <div id="section-outstanding-doctor">
          <OutstandingDoctor settings={settings} />
        </div>

        <div id="section-handbook">
          <Handbook settings={settings} />
        </div>

        <div id="section-about">
          <About />
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

export default connect(mapStateToProps)(HomePage);
