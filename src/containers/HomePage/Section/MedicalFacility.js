import React, { Component } from "react";
import { connect } from "react-redux";
import "./MedicalFacility.scss";
import Slider from "react-slick";

class MedicalFacility extends Component {
  render() {

    return (
        <>
          <div className="section-share section-medical-facility">
            <div className="section-container">
              <div className="section-header">
                <span className="title-section">Cơ sở y tế nổi bật</span>
                <button className="btn-section">xem thêm</button>
              </div>
              <div className="section-body">
                <Slider {...this.props.settings} >
                  <div className="section-customize">
                    <div className="bg-image section-medical-facility"></div>
                    <h3>Benh vien y te Viet Duc 1</h3>
                  </div>
                  <div className="section-customize">
                    <div className="bg-image section-medical-facility"></div>
                    <h3>Benh vien y te Viet Duc 2</h3>
                  </div>
                  <div className="section-customize">
                    <div className="bg-image section-medical-facility"></div>
                    <h3>Benh vien y te Viet Duc 3</h3>
                  </div>
                  <div className="section-customize">
                    <div className="bg-image section-medical-facility"></div>
                    <h3>Benh vien y te Viet Duc 4</h3>
                  </div>
                  <div className="section-customize">
                    <div className="bg-image section-medical-facility"></div>
                    <h3>Benh vien y te Viet Duc 5</h3>
                  </div>
                  <div className="section-customize" >
                    <div className="bg-image section-medical-facility"></div>
                    <h3>Benh vien y te Viet Duc 6</h3>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
