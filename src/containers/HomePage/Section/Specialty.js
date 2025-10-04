import React, { Component } from "react";
import { connect } from "react-redux";
import "./Specialty.scss";
import Slider from "react-slick";
import { getAllSpecialtyService } from "../../../services/userService";
import { FormattedMessage } from "react-intl";

class Specialty extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataSpecialty: [],
    }
  }

  async componentDidMount(){
    let res = await getAllSpecialtyService();
    if(res && res.errCode === 0){
      this.setState({
        dataSpecialty: res.data ? res.data : [],
      })
          console.log('check data: ', this.state);
    }
  }

  render() {
    let { dataSpecialty } = this.state;

    return (
      <>
        <div className="section-share section-specialty">
          <div className="section-container">
            <div className="section-header">
              <span className="title-section">
                <FormattedMessage id="homepage.specialty-popular" />
              </span>
              <button className="btn-section">
                <FormattedMessage id="homepage.more-info" />
              </button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings} >
                {dataSpecialty && dataSpecialty.length > 0 &&
                  dataSpecialty.map((item, index) =>{
                    return (
                        <div className="section-customize specialty-child" key={index}>
                          <div 
                            className="bg-image section-specialty"
                            style={{ backgroundImage: `url(${item.image})` }}
                          ></div>
                          <h3 className="specialty-name">{item.name}</h3>
                      </div>
                    )
                  })
                }

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
    language: state.app.language

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
