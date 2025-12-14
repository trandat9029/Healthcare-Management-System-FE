import React, { Component } from "react";
import { connect } from "react-redux";
import "./MedicalFacility.scss";
import Slider from "react-slick";
import { getAllClinicService } from "../../../services/clinicService";
import { withRouter } from "react-router";

class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataClinics: [],
    };
  }

  async componentDidMount() {
    let res = await getAllClinicService();
    if (res && res.errCode === 0) {
      this.setState({
        dataClinics: res.data ? res.data : [],
      });
    }
  }

  handleViewDetailClinic = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${clinic.id}`);
    }
  };

  handleViewMoreClinics = () => {
    if (this.props.history) {
      this.props.history.push(`/clinics`);
    }
  };

  render() {
    let { dataClinics } = this.state;

    return (
      <>
        <div className="section-share section-medical-facility">
          <div className="section-container">
            <div className="section-header">
              <span className="title-section">Cơ sở y tế nổi bật</span>
              <button
                className="btn-section"
                onClick={this.handleViewMoreClinics}
              >
                xem thêm
              </button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings}>
                {dataClinics &&
                  dataClinics.length > 0 &&
                  dataClinics.map((item, index) => {
                    return (
                      <div
                        className="section-customize clinic-child"
                        key={index}
                        onClick={() => this.handleViewDetailClinic(item)}
                      >
                        <div className="clinic-card">
                          <div className="clinic-img-wrapper">
                            <img src={item.image} alt={item.name} />
                          </div>

                          <h3 className="clinic-name">{item.name}</h3>
                        </div>
                      </div>
                    );
                  })}
              </Slider>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);
