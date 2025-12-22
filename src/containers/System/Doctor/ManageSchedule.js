// src/containers/System/Admin/ManageSchedule.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions';
import Select from 'react-select';
import './ManageSchedule.scss';
import { LANGUAGES } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import { toast } from 'react-toastify';
import _ from 'lodash';

import { saveBulkScheduleDoctorService, getScheduleDoctorByDate } from '../../../services/doctorService';


class ManageSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      currentDate: null,
      rangeTime: [],
    };
  }

  componentDidMount() {
    this.initDoctorFromProps();
    this.props.fetchAllScheduleTimeRedux();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.doctorInfo !== this.props.doctorInfo ||
      prevProps.language !== this.props.language
    ) {
      this.initDoctorFromProps();
    }

    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      let data = this.props.allScheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => ({
          ...item,
          isSelected: false,
        }));
      }

      this.setState(
        { rangeTime: data },
        () => {
          // CHỈ tick lại sau khi rangeTime đã tồn tại
          if (this.state.currentDate) {
            this.loadExistingScheduleByDate();
          }
        }
      );
    }


  }

  initDoctorFromProps = () => {
    const { doctorInfo, language } = this.props;
    if (!doctorInfo || !doctorInfo.id) return;

    const labelVi = `${doctorInfo.firstName} ${doctorInfo.lastName}`;
    const labelEn = `${doctorInfo.lastName} ${doctorInfo.firstName}`;
    const option = {
      value: doctorInfo.id,
      label: language === LANGUAGES.VI ? labelVi : labelEn,
    };

    this.setState({
      listDoctors: [option],
      selectedDoctor: option,
    });
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({
      selectedDoctor: selectedOption,
    });
  };

  handleOnchangeDatePicker = (dateArr) => {
    const date = dateArr && dateArr[0] ? dateArr[0] : null;

    this.setState(
      {
        currentDate: date,
      },
      () => {
        this.loadExistingScheduleByDate();
      }
    );
  };


  handleClickBtnTime = (time) => {
    let { rangeTime } = this.state;
    if (rangeTime && rangeTime.length > 0) {
      const data = rangeTime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      });
      this.setState({
        rangeTime: data,
      });
    }
  };

  handleSaveSchedule = async () => {
    let { rangeTime, selectedDoctor, currentDate } = this.state;

    if (!currentDate) {
      toast.error('Invalid date!');
      return;
    }
    if (!selectedDoctor || _.isEmpty(selectedDoctor)) {
      toast.error('Invalid doctor!');
      return;
    }

    const formatedDate = new Date(currentDate).getTime();
    const result = [];

    if (rangeTime && rangeTime.length > 0) {
      const selectedTime = rangeTime.filter(
        (item) => item.isSelected === true
      );
      if (selectedTime && selectedTime.length > 0) {
        selectedTime.forEach((schedule) => {
          const object = {};
          object.doctorId = selectedDoctor.value;
          object.date = formatedDate;
          object.timeType = schedule.keyMap;
          result.push(object);
        });
      } else {
        toast.error('Invalid selected time!');
        return;
      }
    }

    const res = await saveBulkScheduleDoctorService({
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      formatedDate: formatedDate,
    });

    if (res && res.errCode === 0) {
      toast.success('Save info succeed!');
      if (this.props.onSaved) {
        this.props.onSaved();
      }
    } else {
      toast.error('error saveBulkScheduleDoctorService');
      console.log('error saveBulkScheduleDoctorService >>> res: ', res);
    }
  };

  loadExistingScheduleByDate = async () => {
    const { selectedDoctor, currentDate, rangeTime } = this.state;

    if (!selectedDoctor?.value) return;
    if (!currentDate) return;

    const doctorId = selectedDoctor.value;
    const date = new Date(currentDate).getTime();

    try {
      const res = await getScheduleDoctorByDate(doctorId, date);
      console.log('check res: ', res);

      // Chuẩn hóa response
      // Nếu res là axios response thì có status, còn nếu res là data luôn thì không có status
      const payload = res && typeof res.status === 'number' ? res.data : res;

      if (payload && payload.errCode === 0) {
        const schedules = payload.data || [];

        const selectedTimeTypes = new Set(schedules.map((s) => s.timeType));

        const newRangeTime = (rangeTime || []).map((t) => ({
          ...t,
          isSelected: selectedTimeTypes.has(t.keyMap),
        }));

        this.setState({ rangeTime: newRangeTime });
      } else {
        const newRangeTime = (rangeTime || []).map((t) => ({
          ...t,
          isSelected: false,
        }));
        this.setState({ rangeTime: newRangeTime });
      }
    } catch (e) {
      console.log('loadExistingScheduleByDate error:', e);
    }
  };



  render() {
    const { rangeTime, listDoctors, selectedDoctor, currentDate } =
      this.state;
    const { language, onClose } = this.props;
    const yesterday = new Date(
      new Date().setDate(new Date().getDate() - 1)
    );

    return (
      <div className="schedule-modal-backdrop">
        <div className="schedule-modal-content">
          <button className="schedule-modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>

          <div className="manage-schedule-container">
            <div className="manage-schedule-title">
              <FormattedMessage id="admin.doctor.manage-schedule.schedule-create.title" />
            </div>

            <div className="manage-schedule-form container">
              <div className="row ">
                <div className="col-6 form-group">
                  <label className="manage-schedule-label">
                    <FormattedMessage id="admin.doctor.manage-schedule.schedule-create.doctor" />
                  </label>
                  <Select
                    value={selectedDoctor}
                    onChange={this.handleChangeSelect}
                    options={listDoctors}
                    isDisabled={true}
                    classNamePrefix="manage-schedule-select"
                  />
                </div>
                <div className="col-6 form-group">
                  <label className="manage-schedule-label">
                    <FormattedMessage id="admin.doctor.manage-schedule.schedule-create.choose-date" />
                  </label>
                  <DatePicker
                    className="form-control manage-schedule-date"
                    onChange={this.handleOnchangeDatePicker}
                    value={currentDate}
                    minDate={yesterday}
                  />
                </div>

                <div className="col-12 pick-hour-container">
                  {rangeTime &&
                    rangeTime.length > 0 &&
                    rangeTime.map((item, index) => {
                      return (
                        <button
                          className={
                            item.isSelected === true
                              ? 'btn btn-schedule active'
                              : 'btn btn-schedule'
                          }
                          key={index}
                          onClick={() => this.handleClickBtnTime(item)}
                        >
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </button>
                      );
                    })}
                </div>

                <div className="col-12">
                  <button
                    className="btn btn-primary btn-save-schedule"
                    onClick={this.handleSaveSchedule}
                  >
                    <FormattedMessage id="admin.doctor.manage-schedule.schedule-create.save" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    allScheduleTime: state.admin.allScheduleTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllScheduleTimeRedux: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
