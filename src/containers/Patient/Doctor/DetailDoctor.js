import React, { Component } from 'react';
import { connect } from "react-redux";

import * as actions from "../../../store/actions"

import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss'

import { getDetailInfoDoctorService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfo from './DoctorExtraInfo';
// import LikeAndShare from '../SocialPlugin/LikeAndShare'
// import Comment from '../SocialPlugin/Comment';

class DetailDoctor extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            // infoDoctor: [],
            detailDoctor: {},
            currentDoctorId:  -1,

        }
    }

    async componentDidMount(){
        // this.props.getInfoDetailDoctorRedux()
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id,
            })

            let res = await getDetailInfoDoctorService(id);
            if(res && res.errCode === 0){
                this.setState({
                    detailDoctor: res.data,

                })
            } else{

            }           
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){

    }


    render() {
        
        let {language} = this.props;
        let { detailDoctor } = this.state;
        let nameVi = '';
        let nameEn = '';
        if(detailDoctor && detailDoctor.positionData){
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.lastName} ${detailDoctor.firstName} `;
        }

        return (
            <>
                <HomeHeader isShowBanner={false}/>
                <div className='doctor-detail-container'>
                    {/* intro doctor */}
                    <div className="intro-doctor">
                        <div 
                            className="content-left" 
                            style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : '' })`}}>

                        </div>
                        <div className="content-right">
                            <div className="up">
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className="down">
                                {detailDoctor.Markdown && detailDoctor.Markdown.description
                                    &&  <span>
                                            {detailDoctor.Markdown.description}
                                        </span>
                                }
                            </div>
                        </div>
                    </div>

                    {/* schedule doctor */}
                    <div className="schedule-doctor">
                        <div className="content-left">
                            <DoctorSchedule 
                                doctorIdFromParent={this.state.currentDoctorId} 
                            />
                        </div>
                        <div className="content-right">
                            <DoctorExtraInfo 
                                doctorIdFromParent={this.state.currentDoctorId} 
                            /> 
                        </div>

                    </div>

                    {/* detail-info-doctor */}
                    <div className="detail-info-doctor">
                        {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML 
                            &&  <div dangerouslySetInnerHTML={{__html: detailDoctor.Markdown.contentHTML}}>
                                    
                                </div>
                        }
                    </div>

                    {/* comment-doctor */}
                    <div className="comment-doctor"></div>
                </div>
            </>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        // infoDoctor: state.admin.infoDoctor,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // getInfoDetailDoctorRedux: () => dispatch(actions.getInfoDetailDoctor())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
