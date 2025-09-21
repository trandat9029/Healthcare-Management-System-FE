import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import * as actions from "../../../store/actions"
import Select from 'react-select';
import './ManageSchedule.scss'
import { LANGUAGES } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker'
import moment from 'moment';


class ManageSchedule extends Component {
    constructor(props){
        super(props);
        // const currentDate = new Date();
        // currentDate.setHours(0, 0, 0, 0);

        this.state = {
            listDoctors :  [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],
        }
    }

    buildDataInputSelect = (inputData) =>{
            let result = [];
            let { language } = this.props;
            if(inputData && inputData.length > 0){
                inputData.map((item, index) =>{
                    let object = {}; 
                    let labelEn = `${item.lastName} ${item.firstName}`;
                    let labelVi = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                })
    
            }
    
            return result;
        }

    componentDidMount(){
        this.props.fetchAllDoctorsRedux();
        this.props.fetchAllScheduleTimeRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.allDoctors !== this.props.allDoctors){
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect,
            })
        }
        if(prevProps.allScheduleTime !== this.props.allScheduleTime){
            this.setState({
                rangeTime: this.props.allScheduleTime
            })
        }
        // if(prevProps.language !== this.props.language){
        //     let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
        //     this.setState({
        //         listDoctors: dataSelect,
        //     })
        // }
    }

     handleChangeSelect = async (selectedOption) =>{
        this.setState({
            selectedDoctor: selectedOption
        });
        
    }

    handleOnchangeDatePicker = (date) =>{
        this.setState({
            currentDate: date[0],
        })
    }


    render() {
        console.log('check state: ', this.state);
        let { rangeTime } = this.state;
        let { language } = this.props;
 
        return (
            <>
                <div className='manage-schedule-container'>
                    <div className="manage-schedule-title">
                        <FormattedMessage id="manage-schedule.title" />
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-6 form-group">
                                <label htmlFor=""><FormattedMessage id="manage-schedule.choose-doctor" /></label>
                                <Select  
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listDoctors}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label htmlFor=""><FormattedMessage id="manage-schedule.choose-date" /></label>
                                <DatePicker 
                                    className="form-control"
                                    onChange={this.handleOnchangeDatePicker}
                                    value={this.state.currentDate}
                                    minDate={new Date()}
                                />
                            </div>
                            <div className="col-12 pick-hour-container">
                                {rangeTime && rangeTime.length > 0 &&
                                    rangeTime.map((item, index) =>{
                                        return (
                                            <button className='btn btn-schedule' key={index}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </button>
                                        )
                                    })
                                }
                            </div>
                            <div className='col-12'>
                                <button className='col-12 btn btn-primary btn-save-schedule'>
                                    <FormattedMessage id="manage-schedule.save-info" />
                                </button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allScheduleTime: state.admin.allScheduleTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux : () => dispatch(actions.fetchAllDoctor()),
        fetchAllScheduleTimeRedux : () => dispatch(actions.fetchAllScheduleTime())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
