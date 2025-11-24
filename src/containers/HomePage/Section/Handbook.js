import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";


class Handbook extends Component {

  render() {
    return (
      <>
        <div className="section-share section-handbook">  
          <div className="section-container">
            <div className="section-header">
              <span className="title-section">Cẩm nang</span>
              <button className="btn-section">xem thêm</button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings} >
                <div className="section-customize">
                  <div className="bg-image section-handbook"></div>
                  <h3>Co xuong khop 1</h3>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handbook"></div>
                  <h3>Co xuong khop 2</h3>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handbook"></div>
                  <h3>Co xuong khop 3</h3>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handbook"></div>
                  <h3>Co xuong khop 4</h3>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handbook"></div>
                  <h3>Co xuong khop 5</h3>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handbook"></div>
                  <h3>Co xuong khop 6</h3>
                </div>
              </Slider>
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
    

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Handbook);
