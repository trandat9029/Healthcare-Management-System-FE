import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import * as actions from "../../../store/actions"
import Select from 'react-select';
import './ManageSchedule.scss'
import { LANGUAGES, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker'
import moment from 'moment';
import { toast } from 'react-toastify';
import _ from 'lodash';

import { saveBulkScheduleDoctorService } from '../../../services/userService';

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
            let data = this.props.allScheduleTime;
            if(data && data.length > 0){
                // data.map(item => {
                //     item.isSelected = false;
                //     return item;
                // })
                data = data.map(item =>({ ...item, isSelected: false}))
            }
            this.setState({
                rangeTime: data
            })
        }

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

    handleClickBtnTime = (time) =>{
        let { rangeTime } = this.state;
        if(rangeTime && rangeTime.length > 0){
            let data = rangeTime.map(item => {
                if(item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            this.setState({
                rangeTime : rangeTime,
            })
        }
    }

    handleSaveSchedule = async () =>{
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];

        if(!currentDate){
            toast.error('Invalid date!');
            return;
        }
        if(selectedDoctor && _.isEmpty(selectedDoctor)){
            toast.error('Invalid doctor!');
            return;
        }
        // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);

        // let formatedDate = moment(currentDate).unix();
        let formatedDate = new Date(currentDate).getTime();

        if(rangeTime && rangeTime.length > 0){
            let selectedTime = rangeTime.filter(item => item.isSelected === true);   
            if(selectedTime && selectedTime.length > 0){
                selectedTime.map((schedule, index ) => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formatedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object);

                })
            } else{
                toast.error('Invalid selected time!');
                return;
            }
        }

        let res = await saveBulkScheduleDoctorService({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formatedDate: formatedDate,
        })
        
        if(res && res.errCode === 0){
            toast.success('Save info succeed!')
        }else{
            toast.error('error saveBulkScheduleDoctorService');
            console.log('error saveBulkScheduleDoctorService >>> res: ', res);
            
        }
    }   


    render() {
        let { rangeTime } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
 
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
                                    minDate={yesterday}
                                />
                            </div>
                            <div className="col-12 pick-hour-container">
                                {rangeTime && rangeTime.length > 0 &&
                                    rangeTime.map((item, index) =>{
                                        return (
                                            <button 
                                                className={item.isSelected === true ? "btn btn-schedule active" : "btn btn-schedule"}
                                                key={index}
                                                onClick={() => this.handleClickBtnTime(item)}
                                            >
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </button>
                                        )
                                    })
                                }
                            </div>
                            <div className='col-12'>
                                <button className='col-12 btn btn-primary btn-save-schedule'
                                    onClick={() => this.handleSaveSchedule()}
                                >
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
