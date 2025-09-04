import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";

class OutstandingDoctor extends Component {
    render() {

        return (
            <>
                <div className="section-share section-outstanding-doctor">
                    <div className="section-container">
                        <div className="section-header">
                            <span className="title-section">Bác sĩ nổi bật tuần qua</span>
                            <button className="btn-section">xem thêm</button>
                        </div>
                        <div className="section-body">
                            <Slider {...this.props.settings} >
                                <div className="section-customize">
                                    <div className="customize-border">
                                        <div className="outer-bg">
                                            <div className="bg-image section-outstanding-doctor"></div>
                                        </div>
                                        <div className="position text-center">
                                            <h3>Ten bac si 1</h3>
                                            <p>Ten chuyen khoa</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="section-customize">
                                    <div className="customize-border">
                                        <div className="outer-bg">
                                            <div className="bg-image section-outstanding-doctor"></div>
                                        </div>
                                        <div className="position text-center">
                                            <h3>Ten bac si 2</h3>
                                            <p>Ten chuyen khoa</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="section-customize">
                                    <div className="customize-border">
                                        <div className="outer-bg">
                                            <div className="bg-image section-outstanding-doctor"></div>
                                        </div>
                                        <div className="position text-center">
                                            <h3>Ten bac si 3</h3>
                                            <p>Ten chuyen khoa</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="section-customize">
                                    <div className="customize-border">
                                        <div className="outer-bg">
                                            <div className="bg-image section-outstanding-doctor"></div>
                                        </div>
                                        <div className="position text-center">
                                            <h3>Ten bac si 4</h3>
                                            <p>Ten chuyen khoa</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="section-customize">
                                    <div className="customize-border">
                                        <div className="outer-bg">
                                            <div className="bg-image section-outstanding-doctor"></div>
                                        </div>
                                        <div className="position text-center">
                                            <h3>Ten bac si 5</h3>
                                            <p>Ten chuyen khoa</p>
                                        </div>
                                    </div> 
                                </div>
                                <div className="section-customize">
                                    <div className="customize-border">
                                        <div className="outer-bg">
                                            <div className="bg-image section-outstanding-doctor"></div>
                                        </div>
                                        <div className="position text-center">
                                            <h3>Ten bac si 6</h3>
                                            <p>Ten chuyen khoa</p>
                                        </div>
                                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor);
