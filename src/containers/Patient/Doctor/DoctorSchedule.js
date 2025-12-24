import React, { Component } from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import './DoctorSchedule.scss';
import { getScheduleDoctorByDate } from '../../../services/doctorService';
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [],
      allAvailableTime: [],
      isOpenModalBooking: false,
      dataScheduleTimeModal: {},
      selectedDate: null,
      rawScheduleData: [],
    };

    this.refreshTimer = null;
  }

  async componentDidMount() {
    const { language, doctorIdFromParent } = this.props;

    const allDays = this.getArrDays(language);
    const selectedDate = allDays?.[0]?.value;

    this.setState({ allDays, selectedDate });

    if (doctorIdFromParent && selectedDate) {
      await this.fetchAndApplySchedule(doctorIdFromParent, selectedDate);
    }

    this.startRealtimeRefresh();
  }

  async componentDidUpdate(prevProps, prevState) {
    const { language, doctorIdFromParent } = this.props;

    // 1) Đổi ngôn ngữ -> rebuild allDays, giữ selectedDate nếu có
    if (language !== prevProps.language) {
      const allDays = this.getArrDays(language);
      const selectedDate = this.state.selectedDate || allDays?.[0]?.value;

      this.setState({ allDays, selectedDate }, async () => {
        if (doctorIdFromParent && selectedDate) {
          await this.fetchAndApplySchedule(doctorIdFromParent, selectedDate);
        }
      });
    }

    // 2) Đổi doctorId -> fetch lại theo selectedDate hiện tại (hoặc ngày đầu)
    if (doctorIdFromParent !== prevProps.doctorIdFromParent) {
      const allDays = this.getArrDays(language);
      const selectedDate = this.state.selectedDate || allDays?.[0]?.value;

      this.setState({ allDays, selectedDate }, async () => {
        if (doctorIdFromParent && selectedDate) {
          await this.fetchAndApplySchedule(doctorIdFromParent, selectedDate);
        }
      });
    }

    // 3) selectedDate đổi -> apply lại filter trên raw data (hoặc fetch tuỳ bạn)
    if (this.state.selectedDate !== prevState.selectedDate) {
      const filtered = this.filterScheduleRealtime(
        this.state.rawScheduleData,
        this.state.selectedDate,
        language
      );
      this.setState({ allAvailableTime: filtered });
    }
  }

  componentWillUnmount() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }

  startRealtimeRefresh = () => {
    if (this.refreshTimer) clearInterval(this.refreshTimer);

    this.refreshTimer = setInterval(() => {
      const { selectedDate, rawScheduleData } = this.state;
      const { language } = this.props;

      if (!selectedDate) return;

      if (!this.isToday(selectedDate)) return;

      const filtered = this.filterScheduleRealtime(rawScheduleData, selectedDate, language);

      if (filtered.length !== this.state.allAvailableTime.length) {
        this.setState({ allAvailableTime: filtered });
      }
    }, 60000);
  };

  fetchAndApplySchedule = async (doctorId, dateValue) => {
    try {
      const res = await getScheduleDoctorByDate(doctorId, dateValue);
      const raw = res?.data ? res.data : [];

      const filtered = this.filterScheduleRealtime(raw, dateValue, this.props.language);

      this.setState({
        rawScheduleData: raw,
        allAvailableTime: filtered,
      });
    } catch (e) {
      this.setState({
        rawScheduleData: [],
        allAvailableTime: [],
      });
    }
  };

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getArrDays = (language) => {
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};

      if (language === LANGUAGES.VI) {
        if (i === 0) {
          let DDMM = moment(new Date()).format('DD/MM');
          let today = `Hôm nay  - ${DDMM}`;
          object.label = today;
        } else {
          let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
          object.label = this.capitalizeFirstLetter(labelVi);
        }
      } else {
        if (i === 0) {
          let DDMM = moment(new Date()).format('DD/MM');
          let today = `Today  - ${DDMM}`;
          object.label = today;
        } else {
          object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM');
        }
      }

      object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
      allDays.push(object);
    }

    return allDays;
  };

  isToday = (dateValue) => {
    const selected = moment(Number(dateValue)).startOf('day').valueOf();
    const today = moment().startOf('day').valueOf();
    return selected === today;
  };

  parseStartMinutesFromLabel = (timeLabel) => {
    // timeLabel ví dụ: "08:00 - 09:00"
    if (!timeLabel) return null;

    const firstPart = timeLabel.split('-')[0]?.trim(); // "08:00"
    if (!firstPart) return null;

    const parts = firstPart.split(':');
    if (parts.length < 2) return null;

    const hh = Number(parts[0]);
    const mm = Number(parts[1]);

    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;

    return hh * 60 + mm;
  };

  filterScheduleRealtime = (list, selectedDateValue, language) => {
    const isToday = this.isToday(selectedDateValue);
    const nowMinutes = moment().hours() * 60 + moment().minutes();

    return (list || []).filter((item) => {
      // 1) Ẩn slot full: currentNumber >= maxNumber
      const current = Number(item.currentNumber || 0);
      const max = Number(item.maxNumber || 0);

      if (max > 0 && current >= max) return false;

      // 2) Nếu hôm nay thì ẩn slot đã qua giờ bắt đầu
      if (isToday) {
        const label = language === LANGUAGES.VI
          ? item?.timeTypeData?.valueVi
          : item?.timeTypeData?.valueEn;

        const startMins = this.parseStartMinutesFromLabel(label);

        // Nếu parse được giờ, chặn slot có start <= now
        if (startMins !== null && startMins <= nowMinutes) return false;
      }

      return true;
    });
  };

  handleOnChangeSelect = async (event) => {
    const date = event.target.value;
    const { doctorIdFromParent } = this.props;

    this.setState({ selectedDate: date });

    if (doctorIdFromParent && doctorIdFromParent !== -1) {
      await this.fetchAndApplySchedule(doctorIdFromParent, date);
    }
  };

  handleClickScheduleTime = (time) => {
    this.setState({
      isOpenModalBooking: true,
      dataScheduleTimeModal: time,
    });
  };

  closeBookingModal = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };

  render() {
    let { allDays, allAvailableTime, isOpenModalBooking, dataScheduleTimeModal, selectedDate } = this.state;
    let { language } = this.props;

    return (
      <>
        <div className='doctor-schedule-container'>
          <div className='all-schedule'>
            <select value={selectedDate || ''} onChange={this.handleOnChangeSelect}>
              {allDays && allDays.length > 0 &&
                allDays.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="all-available-time">
            <div className='text-calendar'>
              <i className="fa-solid fa-calendar-days"></i>
              <span><FormattedMessage id="patient.detail-doctor.schedule" /></span>
            </div>

            <div className="time-content">
              {allAvailableTime && allAvailableTime.length > 0 ? (
                <>
                  <div className='time-content-btns'>
                    {allAvailableTime.map((item, index) => {
                      const timeDisplay = language === LANGUAGES.VI
                        ? item?.timeTypeData?.valueVi
                        : item?.timeTypeData?.valueEn;

                      const current = Number(item.currentNumber || 0);
                      const max = Number(item.maxNumber || 0);
                      const left = max > 0 ? Math.max(0, max - current) : null;

                      return (
                        <button
                          key={index}
                          className={language === LANGUAGES.VI ? 'btn-time-vi' : 'btn-time-en'}
                          onClick={() => this.handleClickScheduleTime(item)}
                        >
                          {timeDisplay} {left !== null ? `(${left})` : ''}
                        </button>
                      );
                    })}
                  </div>

                  <div className='book-free'>
                    <span>
                      <FormattedMessage id="patient.detail-doctor.choose" />
                      <i className="fa-solid fa-hand-point-up"></i>
                      <FormattedMessage id="patient.detail-doctor.book-free" />
                    </span>
                  </div>
                </>
              ) : (
                <div className='no-schedule'>
                  <FormattedMessage id="patient.detail-doctor.no-schedule" />
                </div>
              )}
            </div>
          </div>
        </div>

        <BookingModal
          isOpenModal={isOpenModalBooking}
          closeBookingModal={this.closeBookingModal}
          dataTime={dataScheduleTimeModal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(DoctorSchedule);
