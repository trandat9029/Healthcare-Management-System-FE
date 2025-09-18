import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import * as actions from '../../../store/actions'
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
class OutstandingDoctor extends Component {

    constructor(props){
        super(props)
        this.state = {
            arrDoctors: []
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.topDoctorsRedux !== this.props.topDoctorsRedux){
            this.setState({
                arrDoctors: this.props.topDoctorsRedux,
            })
        }
    }

    render() {
        let { arrDoctors } = this.state;
        let { language } = this.props;
        // arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors);
        console.log(arrDoctors);
        
        return (
            <>
                <div className="section-share section-outstanding-doctor">
                    <div className="section-container">
                        <div className="section-header">
                            <span className="title-section"><FormattedMessage id="homepage.outstanding-doctor" /></span>
                            <button className="btn-section"><FormattedMessage id="homepage.more-info"/></button>
                        </div>
                        <div className="section-body">
                            <Slider {...this.props.settings} >
                                
                                {arrDoctors && arrDoctors.length > 0 && 
                                    arrDoctors.map((item, index) =>{
                                        let imageBase64 = '';
                                        if(item.image){
                                            imageBase64 = new Buffer(item.image, 'base64').toString('binary')
                                        }

                                        let nameVi = `${item.positionData.valueVi}, ${item.firstName} ${item.lastName}`;
                                        let nameEn = `${item.positionData.valueEn}, ${item.lastName} ${item.firstName} `;
                                        return (
                                            <div className="section-customize" key={index}>
                                                <div className="customize-border">
                                                    <div className="outer-bg">
                                                        <div className="bg-image section-outstanding-doctor" style={{ backgroundImage: `url(${imageBase64})`}}></div>
                                                    </div>
                                                    <div className="position text-center">
                                                        <h3 className="position-name">{language === LANGUAGES.VI ? nameVi : nameEn}</h3>
                                                        <p>Ten chuyen khoa</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
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
        topDoctorsRedux: state.admin.topDoctors,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor);
